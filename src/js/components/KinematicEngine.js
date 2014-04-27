
define(
    ['PongScene',
    'AbstractDynamic3DObject',
    '__Base__',
    'DefaultParameters'],

    function(PongScene, AbstractDynamic3DObject, __Base__, DefaultParameters)
    {
        var KinematicEngine = new JS.Class(__Base__,
        {
            initialize: function()
            {
                this.callSuper('KinematicEngine');
                
                this._timeStep = DefaultParameters.timeStep;
                this._pongScene = null;
            },

            bindScene: function(pongScene)
            {
                this.checkArgs([pongScene],[PongScene],'bindScene');
                this._pongScene = pongScene;
            },

            setTimeStep: function(timeStep)
            {
                this.checkArgs([timeStep], [Number], 'setStartTime');

                this._timeStep = (timeStep >= 0) ? timeStep : DefaultParameters.timeStep;
            },

            timeStep: function()
            {
                return this._timeStep;
            },
            
            reset: function()
            {
                for(var i=0; i < this._pongScene.movingObjects.length; ++i)
                {
                    this._pongScene.movingObjects[i].reset();
                    this._pongScene.movingObjects[i].setTimeCursor(0);
                }
            },

            /*** ball motion
            * formule de calcul de delta x
            * obtenu par soustraction de la formule x(t) = 1/2*a*t^2 + v0*t + x0
            * delta x = x2 - x1
            * a: vecteur accélération
            * v: vecteur vitesse
            * x2 - x1 = 1/2*a*(t2^2 - t1^2) + v0*(t2 - t1)
            ***/
            getKinematicsDelta: function(dynamic3Dobject)
            {
                this.checkArgs([dynamic3Dobject], [AbstractDynamic3DObject], 'getKinematicsDelta');

                var timeDelta = dynamic3Dobject.timeCursor();
                var squaredTimeDelta = timeDelta*timeDelta;

                var a = (new THREE.Vector3).copy(dynamic3Dobject.acceleration());
                var v = (new THREE.Vector3).copy(dynamic3Dobject.speed());
                var positionDelta;

                var speeDelta = (new THREE.Vector3()).copy(a).multiplyScalar(timeDelta);
                positionDelta = (new THREE.Vector3()).copy(a).multiplyScalar(0.5*squaredTimeDelta).add( v.multiplyScalar(timeDelta) );

                return {speeDelta:speeDelta, positionDelta:positionDelta};
            },

            move: function(dynamic3Dobject)
            {
                var kinematicsDelta = this.getKinematicsDelta(dynamic3Dobject);

                dynamic3Dobject.translate(kinematicsDelta.positionDelta);
                dynamic3Dobject.setSpeed(dynamic3Dobject.speed().add(kinematicsDelta.speeDelta));
            },

            moveBack: function(dynamic3Dobject)
            {
                var kinematicsDelta = this.getKinematicsDelta(dynamic3Dobject);

                dynamic3Dobject.translate(kinematicsDelta.positionDelta.multiplyScalar(-1));
                dynamic3Dobject.setSpeed(dynamic3Dobject.speed().add(kinematicsDelta.speeDelta.multiplyScalar(-1)));
            },

            //Computes the new position of the given object within the time interval,
            step: function(dynamic3Dobject)
            {
                dynamic3Dobject.setTimeCursor(this._timeStep);

                this.move(dynamic3Dobject);
            },

            //Computes the new position all objects within the time interval,
            stepAll: function()
            {
                for(var i=0; i < this._pongScene.movingObjects.length; ++i)
                {
                    this.step(this._pongScene.movingObjects[i]);
                }
            },

            //computes the position of the given objects at the given time, without shifting the time interval. 
            stepObjectsTo: function(dynamic3DobjectsList, toTime)
            {
                for(var i=0; i < dynamic3DobjectsList.length; ++i)
                {
                    var dynamic3Dobject = dynamic3DobjectsList[i];
                    dynamic3Dobject.setTimeCursor(toTime);

                    this.move(dynamic3Dobject);
                }
            },

            //computes the positions of all objects at the given time, without shifting the time interval. 
            //Use shiftTimeInterval to shift the time interval
            stepAllTo: function(toTime)
            {
                for(var i=0; i < this._pongScene.movingObjects.length; ++i)
                {
                    this._pongScene.movingObjects[i].setTimeCursor(toTime);
                    this.move(this._pongScene.movingObjects[i]);
                }
            },

            //Moves back the object to previous state, without shifting the time interval.
            //Use shiftTimeInterval to shift the time interval
            stepObjectsBack: function(dynamic3DobjectsList)
            {
                for(var i=0; i < dynamic3DobjectsList.length; ++i)
                {
                    this.moveBack(dynamic3DobjectsList[i]);
                    dynamic3DobjectsList[i].setTimeCursor(0);
                }
            },

            //Moves back the object to previous state, without shifting the time interval.
            //Use shiftTimeInterval to shift the time interval
            stepBackAll: function()
            {
                for(var i=0; i < this._pongScene.movingObjects.length; ++i)
                {
                    this.moveBack(this._pongScene.movingObjects[i]);
                    this._pongScene.movingObjects[i].setTimeCursor(0);
                }
            },

            timeOfPosition: function(dynamic3Dobject, position, initialPosition)
            {
                // Make sure to use a point on the trajectory:
                // project the given point on the trajectory
                var u = dynamic3Dobject.speed().normalize();
                var P = u.multiplyScalar( position.sub(initialPosition).dot(u) );
                
                //compute time of position P
                var a = dynamic3Dobject.acceleration();
                var xP1 = initialPosition.x;
                var xP2 = P.x;

                var squaredTime = 2*(xP2 - xP1)/a.x;

                return Math.sqrt(squaredTime);
            },

            //Shifts the time interval, and computes the new position of all objects
            newFrame: function()
            {
                for(var i=0; i < this._pongScene.movingObjects.length; ++i)
                {
                    this.step(this._pongScene.movingObjects[i]);
                }
            }
        });
        
        return KinematicEngine;
    });


