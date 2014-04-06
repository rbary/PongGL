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
        
        this._scene = null;
        this.startTime = 0;
        this.endTime = 0;
        this._collisionTolerance = 0.0001;
    },
    
    bindScene: function(pongScene)
    {
        this.checkArgs([pongScene],[PongScene],'bindScene');
        
        this._scene = pongScene;
    },
    
    bindKinEngine: function(kinEngine)
    {
        this.checkArgs([kinEngine],[KinematicEngine],'bindKinEngine');
        
        this._kinEgine = kinEngine;
    },
    
    setTimeInterval: function(startTime, endTime)
    {
        this.checkArgs([startTime, endTime],[Number, Number],'setTimeInterval');
        
        this.startTime = startTime;
        this.endTime = endTime;
    },
    
    setCollisionTolerance: function(tolerance)
    {
        this.checkArgs([tolerance],[Number],'setCollisionTolerance');
        
        this._collisionTolerance = Math.abs(tolerance);
    },
    
    detect: function()
    {
        var ball = this._scene.ball;
        var collisionTestResult = new CollisionTestResultHolder();
        
        ball.setOmniDirectionalRays();
        collisionTestResult = ball.detectContact();
        
        if(!collisionTestResult.isColliding)
        {
            collisionTestResult = _latelyDetect();
        }
        
        else
        {
            collisionTestResult.collisionTime = this.endTime;
        }
        
        return collisionTestResult;
    },
    
    //***** Lately detect collision (object already crossed each other) ******
    
    _latelyDetect : function()
    {
        var mlCollisionTestResult = _latelyMotionLess();
        var mvCollisionTestResult = _latelyMoving();
        
        return _earliestCollision(mlCollisionTestResult, mvCollisionTestResult);
        
    },
    
    // lately detect collision with motionless obstacles
    // Motionless obstacles are group under the motionless field of the
    // colliders object field in a dynamic3DObject
    // 
    // send ray at startime, get closest object CLO, compute vec(CP)
    // send ray to CLO at endtime, compute vec(CP')
    // collision if vec(CP).vec(CP') < 0
    _latelyMotionLess: function()
    {
        var ball = this._scene.ball;
        
        var motionLessObstacles = ball.colliders().motionless;
        var collisionTestResult;
        
        //We go back to the step start time
        this._kinEgine.stepBack();
        
        ball.setUniDirectionalRays(ball.speed());
        collisionTestResult = ball.getRaysIntersection(motionLessObstacles);
        
        if(collisionTestResult.isColliding)
        {
            var vecCP0 = collisionTestResult.collider.position();
            vecCP0.add(ball.position().multiplyScalar(-1));
        
            // We go to the end of the time interval
            this._kinEgine.stepTo(this.endTime);
            
            collisionTestResult = ball.getRaysIntersection([collisionTestResult.collider]);
            
            var vecCP1 = collisionTestResult.collider.position();
            vecCP1.add(ball.position().multiplyScalar(-1));
            
            var scalarProd = vecCP1.dot(vecCP0);
            
            collisionTestResult.isColliding = (scalarProd <= 0.0001); //!!! Attention à la valeur limite du zéro
            
            //***** Compute exact collision time
            // compute the time when the ball is at collision point
            if(collisionTestResult.isColliding)
            {
                  collisionTestResult.collisionTime = this._kinEngine.timeOfPosition(ball, collisionTestResult.collisionPoint);
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
    _latelyMoving: function()
    {
        var ball = this._scene.ball;

        var movingObstacles = ball.colliders().moving;
        var currentCollisionTestResult;
        var earliestCollisionTestResult = new CollisionTestResultHolder();
        var minTime = -1;
        
        for(var i=0; i < movingObstacles.length; ++i)
        {
            var obstacle = movingObstacles[i];

            //***** Suspect collision

            this._kinEgine.stepBack();

            var A = ball.position();
            var B = obstacle.position();
            var vecU = ball.speed();
            var vecV = obstacle.speed();
            var vecW = vecU.clone().cross(vecV);

            var AB = obstacle.position().add(ball.position().multiplyScalar(-1));

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

            var isSuspicious = (dist <= this._collisionTolerance);

            //***** Check contact at suspected position
            
            if(isSuspicious)
            {
                var time = this._kinEngine.timeOfPosition(ball, P1);
                
                this._kinEngine.stepTo(time);
                ball.setOmniDirectionalRays();
                currentCollisionTestResult = ball.detectContact();
                
                if(time < minTime || minTime < 0)
                {
                    earliestCollisionTestResult = currentCollisionTestResult.clone();
                    earliestCollisionTestResult.collisionTime = time;
                    minTime = time;
                }
            }
        }
        
        // We go to the end of the time interval
        this._kinEgine.stepTo(this.endTime);

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
