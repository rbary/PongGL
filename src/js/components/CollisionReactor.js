
define(
    ['__Base__',
    'KinematicEngine',
    'AbstractDynamic3DObject',
    'CollisionTestResultHolder'],
    
    function(__Base__, KinematicEngine, AbstractDynamic3DObject, CollisionTestResultHolder)
    {
        var CollisionReactor = new JS.Class(__Base__,
        {
            initialize: function()
            {
                this.callSuper('CollisionReactor');

                this._kinEngine = null;
            },

            bindKinEngine: function(kinEngine)
            {
                this.checkArgs([kinEngine], [KinematicEngine], 'bindKinEngine');

                this._kinEngine = kinEngine;
            },

            computeReactions: function(collisionTestResultsList)
            {
                this.checkArgs([collisionTestResultsList], [Array], 'computeReactions');

                this._kinEngine.stepBackAll();

                for (var i = 0; i < collisionTestResultsList.length; ++i)
                {
                    var collider = collisionTestResultsList[i].collider;

                    if (collider instanceof AbstractDynamic3DObject)
                    {
                        this._reactMoving(collisionTestResultsList[i]);
                    }

                    else
                    {
                        this._reactMotionLess(collisionTestResultsList[i]);
                    }
                }
            },

            _reactMoving: function(collisionTestResult)
            {
                this.checkArgs([collisionTestResult], [CollisionTestResultHolder], '_reactMoving');
                
                var movingObject = collisionTestResult.movingObject;
                var collider = collisionTestResult.collider;
                
                // Go to collision time
                this._kinEngine.stepObjectsBack([movingObject, collider]);
                this._kinEngine.stepObjectsTo([movingObject, collider], collisionTestResult.collisionTime);

                //***** Speeed
                var V1 = movingObject.speed();
                var V2 = collider.speed();
                var m1 = movingObject.mass();
                var m2 = collider.mass();
                var V_G = V1.clone.multiplyScalar(m1).add(V2.clone.multiplyScalar(m2)).multiplyScalar(1 / (m1+m2));

                movingObject.setSpeed(V_G.clone().multiplyScalar(2).add(V1.clone().multiplyScalar(-1)));
                collider.setSpeed(V_G.clone().multiplyScalar(2).add(V2.clone().multiplyScalar(-1)));

                //***** Acceleration
                var speedDelta1 = movingObject.speed().add(V1.clone().multiplyScalar(-1));
                var speedDelta2 = collider.speed().add(V2.clone().multiplyScalar(-1));

                var timeDelta = collisionTestResult.collisionTime - this._kinEngine.startTime;

                var accDelta1 = speedDelta1.multiplyScalar(1 / timeDelta);
                var accDelta2 = speedDelta2.multiplyScalar(1 / timeDelta);

                movingObject.setAcceleration(movingObject.acceleration().add(accDelta1));
                collider.setAcceleration(movingObject.acceleration().add(accDelta2));

                // Go to step end time
                this._kinEngine.stepObjectsBack([movingObject, collider]);
                this._kinEngine.stepObjectsTo([movingObject, collider], this._kinEngine.endTime());
            },

            _reactMotionLess: function(collisionTestResult)
            {
                this.checkArgs([collisionTestResult], [CollisionTestResultHolder], '_reactMotionLess');

                var movingObject = collisionTestResult.movingObject;
                
                // Go to collision time
                this._kinEngine.stepObjectsBack([movingObject]);
                this._kinEngine.stepObjectsToTime([movingObject], collisionTestResult.collisionTime);

                //***** Speeed
                var V = movingObject.speed();
                var N = collisionTestResult.collisionFaceNormal.clone();

                movingObject.setSpeed(V.clone().add(N.clone().multiplyScalar(-2*V.dot(N))));

                //***** Acceleration
                var speedDelta = movingObject.speed().add(V.clone().multiplyScalar(-1));
                var timeDelta = collisionTestResult.collisionTime - this._kinEngine.startTime;
                var accDelta = speedDelta.multiplyScalar(1 / timeDelta);

                movingObject.setAcceleration(movingObject.acceleration().add(accDelta));

                // Go step endtime
                this._kinEngine.stepObjectsBack([movingObject]);
                this._kinEngine.stepObjectsTo([movingObject], this._kinEngine.endTime());
            }
        });
        
        return CollisionReactor;
    });
