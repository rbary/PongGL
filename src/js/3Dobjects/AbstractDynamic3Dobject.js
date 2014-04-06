/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/**
 * 
 * @type Class
 * 
 * Abstract because new THREE.Mesh still doesn't set the geometry and the material
 * 
 * Note: finaly, we only need the acceleration and the initial speed, to deduce
 * the instant position and instant speed.
 * One need to be careful not to modify the initial speed by mistake.
 */
var AbstractDynamic3Dobject = new JS.Class(Abstract3Doject,
{
    initialize: function(name, xPos, yPos, zPos, geometry, material, mass, acceleration, initialSpeed)
    {
        this.callSuper(name, xPos, yPos, zPos, geometry, material);
        this.checkArgs([mass, acceleration, initialSpeed], [Number, THREE.Vector3, THREE.Vector3], 'initialize');
        
        this._mass = mass;
        this._acc = (new THREE.Vector3()).copy(acceleration);
        this._speed = (new THREE.Vector3()).copy(initialSpeed);
        this._obstacles = [];

        this._collisionTolerance = 0.0001;

        this._rayCaster = new THREE.Raycaster();
        this._rayDirections = [];
        this._rayLaunchPoints = [];
        this._rayCastingMode = EnumRayCastingMode.none;
    },
    
    setMass : function(newMass)
    {
        this.checkArgs([newMass], [Number], 'setMass');
        
        this._mass = newMass;
    },
    setSpeed : function(speed)
    {
        this.checkArgs([speed], [Number], 'setSpeed');
        
        this._speed = (new THREE.Vector3()).copy(speed);
    },
    setAcceleration : function(acc)
    {
        this.checkArgs([acc], [THREE.Vector3], 'setAcceleration');
        
        this._acc = (new THREE.Vector3()).copy(acc);
    },
    setColliders: function(collidersList)
    {
        this.checkArgs([collidersList], [Array], 'setColliders');

        this._obstacles = collidersList;
    },
    setCollisionTolerance: function(tolerance)
    {
        this.checkArgs([tolerance], [Number], 'setCollisionTolerance');

        this._collisionTolerance = Math.abs(tolerance);
    },
    addCollider : function(collider)
    {
        this.checkArgs([collider], [Abstract3DObject], 'addCollider');
        
        this._obstacles.push(collider);
    },
    
    setOmniDirectionalRays: function()
    {
        this._rayDirections = [
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(1, 1, 0),
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(1, -1, 0),
            new THREE.Vector3(0, -1, 0),
            new THREE.Vector3(-1, -1, 0),
            new THREE.Vector3(-1, 0, 0),
            new THREE.Vector3(-1, 1, 0)
        ];
        
        this._rayLaunchPoints = [this.position()];
        this._rayCastingMode = EnumRayCastingMode.omnidiectional;
    },
    
    setUniDirectionalRays: function(dirVector)
    {
        this.checkArgs([dirVector], [THREE.Vector3], 'setUniDirectionalRays');
        
        this._rayDirections = [dirVector];
        
        var bb = this.getBoundingBox();
        
        var x = bb.max.x;
        var y = this.position().z;
        var z = bb.max.z;
        var l = bb.max.x - bb.min.x;

        this._rayLaunchPoints = [
            new THREE.Vector3(x, y, z),
            new THREE.Vector3(x, y, z-l/2),
            new THREE.Vector3(x, y, z-l),
            new THREE.Vector3(x-l/2, y, z-l),
            new THREE.Vector3(x-l, y, z-l),
            new THREE.Vector3(x-l, y, z-l/2),
            new THREE.Vector3(x-l, y, z),
            new THREE.Vector3(x-l/2, y, z),
            new THREE.Vector3(x-l/2, y, z-l/2)
        ];
        
        this._rayCastingMode = EnumRayCastingMode.unidirectional;
    },
    
    getRaysIntersection: function(obstaclesList)
    {
        this.checkArgs([obstaclesList], [Array], 'getRaysIntersection');
        
        var currentRayCastingRes;
        var minRayCastingRes = {};
        var minDistance = -1;
        
        for(var i = 0; i < this._rayDirections.length; ++i)
        {
            if(this._rayCastingMode === EnumRayCastingMode.omnidiectional)
                this._rayCaster.set(this._mesh.position, this._rayDirections[i]);
            else
                this._rayCaster.set(this._rayLaunchPoints[i], this._rayDirections[0]);

            var allIntersects = this._rayCaster.intersectObjects(obstaclesList);
            
            if(allIntersects.length > 0)
            {
                currentRayCastingRes = allIntersects[0];
                
                if(currentRayCastingRes.distance < minDistance || minDistance < 0)
                {
                    minDistance = currentRayCastingRes.distance;
                    minRayCastingRes = currentRayCastingRes.clone();
                }
            }
        }
        
        return this._makeCollisionTestResult(minRayCastingRes);
    },
    
    _makeCollisionTestResult: function(rayCastingRes)
    {
        this.checkArgs([rayCastingRes], [Object], '_makeCollisionTestResult');
        
        var isColliding = false;
        var collisionType = EnumCollisionType.NONE;
        if(rayCastingRes.object !== null && rayCastingRes.object !== {})
        {
            if(rayCastingRes.distance <= this._collisionTolerance)
            {
                // Direction constraint:
                // tangent objects are not acutally colliding if they're going
                // far from each other, instead of getting closer
                var C1 = this.position();
                var C2 = rayCastingRes.object.position();
                var V1 = this.speed();
                var V2 = (rayCastingRes.object instanceof AbstractDynamic3Dobject) ?
                            rayCastingRes.object.speed() :
                                    new THREE.Vector3(0,0,0);
                var C1C2 = C2.clone().add(C1.clone().multiplyScalar(-1));
                var C2C1 = C1.clone().add(C2.clone().multiplyScalar(-1));
                
                if(C1C2.dot(V1) > 0 || C2C1.dot(V2) > 0)
                {
                    isColliding = true;
                    collisionType = EnumCollisionType.EXACT;
                }
            }
        }
        
        return (new CollisionTestResultHolder()).setResult(isColliding, rayCastingRes.object,
                                                         rayCastingRes.point, collisionType, null);
    },
    
    detectContact: function()
    {
        this.setOmniDirectionalRays();
        return this.getRaysIntersection(this._obstacles);
    },
    
    mass : function()
    {
        return this._mass;
    },
    speed : function()
    {
        return this._speed.clone();
    },
    acceleration : function()
    {
        return this._acc.clone();
    },
    colliders : function()
    {
        return this._obstacles.clone();
    }
});