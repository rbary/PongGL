
define(
    ['__Base__',
    'KinematicEngine',
    'PongScene',
    'AbstractDynamic3DObject',
    'CollisionTestResultHolder',
    'Geometry',
    'DefaultParameters'],
    
    function(__Base__, KinematicEngine, PongScene, AbstractDynamic3DObject, CollisionTestResultHolder, Geometry, DefaultParameters)
    {
        var CollisionDetector = new JS.Class(__Base__,
        {
            initialize: function()
            {
                this.callSuper('CollisionDetector');

                this._pongScene = null;
                this._collisionTolerance = DefaultParameters.collisionTolerance;
                this.timeSubInterval = DefaultParameters.timeSubInterval; /*!< Time interval for sampling when detecting collision with moving object */
            },

            bindKinEngine: function(kinEngine)
            {
                this.checkArgs([kinEngine],[KinematicEngine],'bindKinEngine');

                this._kinEngine = kinEngine;
            },

            bindScene: function(pongScene)
            {
                this.checkArgs([pongScene],[PongScene],'bindScene');

                this._pongScene = pongScene;
            },
            bindComponents: function(pongScene, kinEngine)
            {
                this.checkArgs([pongScene, kinEngine],[PongScene, KinematicEngine],'bindComponents');
                
                this._pongScene = pongScene;
                this._kinEngine = kinEngine;
            },

            setCollisionTolerance: function(tolerance)
            {
                this.checkArgs([tolerance],[Number],'setCollisionTolerance');

                this._collisionTolerance = Math.abs(tolerance);
            },

            detect: function()
            {
                var collisionTestResultsList = [];

                for(var i=0; i < this._pongScene.movingObjects.length; ++i)
                {
                    var movingObject = this._pongScene.movingObjects[i];
                    var collisionTestResult = new CollisionTestResultHolder();

                    collisionTestResult = movingObject.detectContact();

                    if(!collisionTestResult.isColliding)
                    {
                        collisionTestResult = _latelyDetect(movingObject);
                    }

                    else
                    {
                        collisionTestResult.collisionTime = this._kinEngine.endTime();
                    }

                    if(collisionTestResult.isColliding)
                    {
                        collisionTestResultsList.push(collisionTestResult);
                    }
                }

                return collisionTestResultsList;
            },

            //***** Lately detect collision (object already crossed each other) ******

            _latelyDetect : function(movingObject)
            {
                this.check([movingObject], [AbstractDynamic3DObject], '_latelyDetect');

                var mlCollisionTestResult = _latelyMotionLess(movingObject); //collisions with motionless objects
                var mvCollisionTestResult = _latelyMoving(movingObject); // collisions with moving objects

                return _earliestCollision(mlCollisionTestResult, mvCollisionTestResult);

            },

            // lately detect collision with motionless obstacles
            // Motionless obstacles are grouped under the motionless field of the
            // obstacles object field in a dynamic3DObject
            _latelyMotionLess: function(movingObject)
            {
                var collisionTestResult;
                var motionLessObstacles = movingObject.motionLessObstacles();

                //We go back to the step start time
                this._kinEngine.stepObjectsBack(motionLessObstacles);
                this._kinEngine.stepObjectsBack([movingObject]);
                
                var initialPosition = movingObject.position();

                movingObject.setUniDirectionalRays(movingObject.speed());
                collisionTestResult = movingObject.getRaysIntersection(motionLessObstacles);

                //We go at to the step end time
                this._kinEngine.stepObjectsTo(motionLessObstacles, this._kinEngine.endTime());
                this._kinEngine.step(movingObject);
                
                if(collisionTestResult.collider !== null)
                {
                    var testAfter = movingObject.getRaysIntersection([collisionTestResult.collider]);
                    
                    // Case 1: the moving object have not actually reach the obstacle (but may be close enough)
                    if(testAfter.collider !== null)
                    {
                        collisionTestResult = testAfter;
                        collisionTestResult.collisionTime = this._kinEngine.timeStep();
                    }
                    
                    // Case 2 & 3: the moving object intersects or has passed throw the obstacle
                    else
                    {
                        collisionTestResult.collisionTime = this._kinEngine.timeOfPosition(movingObject, collisionTestResult.collisionPoint, initialPosition);
                    }
                }

                return collisionTestResult;
            },

            //lately detect collision with moving obstacles
            //***** Procedure:
            //Devide the time interval into several smaller intervals and check
            //contact in the laters.
            //The number of sub-intervals depends on the relative speed of the objects and
            //the distance between them; the duration of a sub-interval is fixed (it is
            //a parameter of the collision detector.
            //
            _latelyMoving: function(movingObject)
            {
                var movingObstacles = movingObject.movingObstacles();
                var earliestCollisionTestResult = new CollisionTestResultHolder();
                var minTime = -1;
                
                //We go back to the step start time
                this._kinEngine.stepObjectsBack(movingObstacles);
                this._kinEngine.stepObjectsBack(movingObject);
                
                movingObject.setUniDirectionalRays(movingObject.speed());

                for(var i=0; i < movingObstacles.length; ++i)
                {
                    var obstacle = movingObstacles[i];
                    
                    if(Geometry.areConverging(movingObject, obstacle))
                    {
                        // compute number of subintervals
                        var relativeSpeed = movingObject.speed().sub(obstacle.speed());
                        var C1C2 = obstacle.position().sub(movingObject.position());
                        var maxCollisionTime = Math.floor(C1C2.length() / relativeSpeed.length());
                        var nbSubIntervals = maxCollisionTime / this.timeSubInterval;
                        
                        // Iterate sub intervals
                        var collisionTest = new CollisionTestResultHolder();

                        // Prepare timestep backup value
                        var timeStepBak= this._kinEngine.timeStep();
                        //Init sub-interval
                        this._kinEngine.setTimeStep(this.timeSubInterval);
                        var pastTime = 0; // time accumulator
                        var j=0;
                        while(j < nbSubIntervals && !collisionTest.isColliding)
                        {
                            // Move obstacle at subEndTime
                            this._kinEngine.step(obstacle);
                            
                            // Make tests similar to detection with motion less objects
                            collisionTest = movingObject.getRaysIntersection([obstacle]);
                            
                            // Move movingObject at subEndTime
                            var initialPosition = movingObject.position();
                            this._kinEngine.step(movingObject);
                            
                            if(collisionTest.collider !== null)
                            {
                                var testAfter = movingObject.getRaysIntersection([obstacle]);

                                // Case 1: the moving object have not actually reach the obstacle (but may be close enough)
                                if(testAfter.collider !== null)
                                {
                                    // the method movingObject.getRaysIntersection called above determines
                                    // if a collision actually happened
                                    collisionTest= testAfter;
                                    collisionTest.collisionTime = pastTime + this._kinEngine.timeStep();
                                }

                                // Case 2 & 3: the moving object intersects or has passed throw the obstacle
                                else
                                {
                                    collisionTest.collisionTime = pastTime + this._kinEngine.timeOfPosition(movingObject, collisionTest.collisionPoint, initialPosition);
                                }
                            }
                            
                            if(j === nbSubIntervals-1)
                                this._kinEngine.setTimeStep(timeStepBak -  pastTime);
                            
                            pastTime += this._kinEngine.timeStep();
                            
                            ++j;
                        }
                        
                        // Keep only earliest collision
                        if(collisionTest.isColliding)
                        {
                            if(minTime === -1 || collisionTest.collisionTime < minTime)
                            {
                                minTime = collisionTest.collisionTime;
                                earliestCollisionTestResult = collisionTest;
                            }
                        }
                        
                        //Back the time interval up
                        this._kinEngine.setTimeStep(timeStepBak);
                        // Get movingObject back to real startTime
                        if(i !== movingObstacles.length-1)
                            this._kinEngine.stepObjectsBack([movingObject]);
                    }
                    
                    else
                        this._kinEngine.step(obstacle);
                }
                
                this._kinEngine.step(movingObject);
                
                return earliestCollisionTestResult;
            },

            _earliestCollision: function(mlCollisionTestResult, mvCollisionTestResult)
            {
                this.checkArgs([mlCollisionTestResult, mvCollisionTestResult],[CollisionTestResultHolder, CollisionTestResultHolder],'_earliestCollision');

                if(mlCollisionTestResult.isColliding && !mvCollisionTestResult.isColliding)
                {
                    return mlCollisionTestResult;
                }

                else if(!mlCollisionTestResult.isColliding && mvCollisionTestResult.isColliding)
                {
                    return mvCollisionTestResult;
                }

                else if(mlCollisionTestResult.isColliding && mvCollisionTestResult.isColliding)
                {
                    return (mlCollisionTestResult.collisionTime < mvCollisionTestResult.collisionTime) ? mlCollisionTestResult.collisionTime : mvCollisionTestResult.collisionTime;
                }

                else
                {
                    return mlCollisionTestResult;
                }
            }
        });
        
        return CollisionDetector;
    });


