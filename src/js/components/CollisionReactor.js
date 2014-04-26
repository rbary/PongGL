//
//requirejs.config({
//    paths: {
//        __Base__: '../defensive/__Base__',
//        AbstractDynamic3DObject: '../3DObjects/AbstractDynamic3DObject'
//    }
//});

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
                    var movingObject = collisionTestResultsList[i].movingObject;
                    var collider = collisionTestResultsList[i].collider;

                    if (collider instanceof AbstractDynamic3DObject)
                    {
                        this._reactMoving(movingObject, collisionTestResultsList[i]);
                    }

                    else
                    {
                        this._reactMotionLess(movingObject, collisionTestResultsList[i]);
                    }
                }
            },

            _reactMoving: function(dynamic3Dobject, collisionTestResult)
            {
                this.checkArgs([dynamic3Dobject, collisionTestResult],
                        [AbstractDynamic3DObject, CollisionTestResultHolder], '_reactMoving');

                // Go to collision time
                this._kinEngine.stepObjectsToTime([dynamic3Dobject, collisionTestResult.collider],
                        collisionTestResult.collisionTime);

                //***** Speeed
                var V1 = dynamic3Dobject.speed();
                var V2 = collisionTestResult.collider.speed();
                var m1 = dynamic3Dobject.mass();
                var m2 = collisionTestResult.collider.mass();
                var V_G = V1.clone.multiplyScalar(m1).add(V2.clone.multiplyScalar(m2)).multiplyScalar(1 / (m1+m2));

                dynamic3Dobject.setSpeed(V_G.clone().multiplyScalar(2).add(V1.clone().multiplyScalar(-1)));
                collisionTestResult.collider.setSpeed(V_G.clone().multiplyScalar(2).add(V2.clone().multiplyScalar(-1)));

                //***** Acceleration
                var speedDelta1 = dynamic3Dobject.speed().add(V1.clone().multiplyScalar(-1));
                var speedDelta2 = collisionTestResult.collider.speed().add(V2.clone().multiplyScalar(-1));

                var timeDelta = collisionTestResult.collisionTime - this._kinEngine.startTime;

                var accDelta1 = speedDelta1.multiplyScalar(1 / timeDelta);
                var accDelta2 = speedDelta2.multiplyScalar(1 / timeDelta);

                dynamic3Dobject.setAcceleration(dynamic3Dobject.acceleration().add(accDelta1));
                collisionTestResult.collider.setAcceleration(dynamic3Dobject.acceleration().add(accDelta2));

                // Go to step end time
                this._kinEngine.stepObjectsToTime([dynamic3Dobject, collisionTestResult.collider],
                        this._kinEngine.endTime);
            },

            _reactMotionLess: function(dynamic3Dobject, collisionTestResult)
            {
                this.checkArgs([dynamic3Dobject, collisionTestResult],
                        [AbstractDynamic3DObject, CollisionTestResultHolder], '_reactMotionLess');

                // Go to collision time
                this._kinEngine.stepObjectsToTime([dynamic3Dobject], collisionTestResult.collisionTime);

                //***** Speeed
                var V = dynamic3Dobject.speed();
                var N = collisionTestResult.collisionFaceNormal.clone();

                dynamic3Dobject.setSpeed(V.clone().add(N.clone().multiplyScalar(-2*V.dot(N))));

                //***** Acceleration
                var speedDelta = dynamic3Dobject.speed().add(V.clone().multiplyScalar(-1));
                var timeDelta = collisionTestResult.collisionTime - this._kinEngine.startTime;
                var accDelta = speedDelta.multiplyScalar(1 / timeDelta);

                dynamic3Dobject.setAcceleration(dynamic3Dobject.acceleration().add(accDelta));

                // Go step endtime
                this._kinEngine.stepObjectsToTime([dynamic3Dobject], this._kinEngine.endTime);
            }
        });
        
        return CollisionReactor;
    });
