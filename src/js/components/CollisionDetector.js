/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var CollisionDetector = new JS.Class(__Base__,
{
    initialize: function()
    {
        this.callSuper('CollisionDetector');
        
        this._pongScene = null;
        this._collisionTolerance = 0.0001;
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
    // 
    // send ray at startime, get closest object CLO, compute vec(CP)
    // send ray to CLO at endtime, compute vec(CP')
    // collision if vec(CP).vec(CP') < 0
    _latelyMotionLess: function(movingObject)
    {
        var collisionTestResult;
        
        //We go back to the step start time
        this._kinEngine.stepBackAll();
        var initialPosition = movingObject.position();
        
        movingObject.setUniDirectionalRays(movingObject.speed());
        collisionTestResult = movingObject.getRaysIntersection(movingObject.motionLessObstacles());
        
        // Problem: make sure collider is null when no ray intersected
        if(collisionTestResult.collider === null)
        {
            var vecCP0 = collisionTestResult.collider.position();
            vecCP0.add(movingObject.position().multiplyScalar(-1));
        
            // We go to the end of the time interval
            this._kinEngine.stepAllTo(this._kinEngine.endTime());
            
            // Problem: should the direction be the opposite of the one at start time ?
            // If so, the test will be different (just test if there is still intersection with the ray at
            // endTime. If not intersection, test bounding box intersection ?
            // If not, avoid, in the first test above, situations where the moving object is actually
            // rolling away from the motion less
            //
            // Other problem: what if objects are intersecting at endTime (one inside the other) ?
            // => Add bounding box intersection test
            collisionTestResult = movingObject.getRaysIntersection([collisionTestResult.collider]);
            
            var vecCP1 = collisionTestResult.collider.position();
            vecCP1.add(movingObject.position().multiplyScalar(-1));
            
            var scalarProd = vecCP1.dot(vecCP0);
            
            collisionTestResult.isColliding = (scalarProd <= 0.0001); //!!! Attention à la valeur limite du zéro
            
            //***** Compute exact collision time
            // compute the time when the ball is at collision point
            if(collisionTestResult.isColliding)
            {
                  collisionTestResult.collisionTime = this._kinEngine.timeOfPosition(movingObject, collisionTestResult.collisionPoint, initialPosition);
            }
        }
        
        return collisionTestResult;
    },
    
    //lately detect collision with moving obstacles
    //***** Suspect collision
    // compute the distance between the trajectories,
    // suspicion if distance less than tolerance
    // if suspicion, compute closest points between trajectories
    //
    //***** Check contact at suspected position
    // compute the time when one of the object is at suspected collision point
    // compute the position of the other object at that time
    // check contact (or intersection)
    _latelyMoving: function(movingObject)
    {
        var movingObstacles = movingObject.movingObstacles();
        var currentCollisionTestResult;
        var earliestCollisionTestResult = new CollisionTestResultHolder();
        var minTime = -1;
        
        for(var i=0; i < movingObstacles.length; ++i)
        {
            var obstacle = movingObstacles[i];

            //***** Suspect collision
            
            // Let's go at the begining of the time interval
            this._kinEngine.stepObjectsBack([movingObject, obstacle]);

            // Problem: avoid the situation where the objects are actually
            // rolling away from each other
            var A = movingObject.position();
            var B = obstacle.position();
            var vecU = movingObject.speed();
            var vecV = obstacle.speed();
            var vecW = vecU.clone().cross(vecV);

            var AB = obstacle.position().add(movingObject.position().multiplyScalar(-1));

            var matM = new THREE.Matrix3(vecW.x, vecU.x, -vecV.x,
                                         vecW.y, vecU.y, -vecV.y,
                                         vecW.z, vecU.z, -vecV.z);
            var invM = new THREE.Matrix3().getInverse(matM);

            var vecX = invM.multiplyVector3([AB])[0];
            var r0 = vecX.y;
            var s0 = vecX.z;
            var P1 = new THREE.Vector3(vecU.x* r0 + A.x,
                                       vecU.y* r0 + A.y,
                                       vecU.z* r0 + A.z);

            var P2 = new THREE.Vector3(vecV.x* s0 + B.x,
                                       vecV.y* s0 + B.y,
                                       vecV.z* s0 + B.z);

            var dist = P1.clone().add(P2.clone().multiplyScalar(-1)).length();

            // Problem: the distance between trajectories is not the collision tolerance (which is for
            // ray casting, and thus only for the distance between the surfaces).
            // Should it be: tolerance+sum(objects radius) ? Problem: radius may be very inexact.
            var isSuspicious = (dist <= this._collisionTolerance);

            //***** Check contact at suspected position
            
            if(isSuspicious)
            {
                var time = this._kinEngine.timeOfPosition(movingObject, P1);
                
                this._kinEngine.stepObjectsTo([movingObject, obstacle], time);
                movingObject.setOmniDirectionalRays();
                currentCollisionTestResult = movingObject.detectContact();
                
                if(currentCollisionTestResult.isColliding && (time < minTime || minTime < 0))
                {
                    earliestCollisionTestResult = currentCollisionTestResult.clone();
                    earliestCollisionTestResult.collisionTime = time;
                    minTime = time;
                }
            }
        }
        
        // We go back at the end of the time interval
        this._kinEngine.stepObjectsTo([movingObject, obstacle], this._kinEngine.endTime());

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
