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
// must implement IDynamic
var AbstractDynamic3Dobject = new JS.Class(Abstract3Doject, {
    initialize: function(name, xPos, yPos, zPos, geometry, material, mass, acceleration, initialSpeed){
        this.callSuper(name, xPos, yPos, zPos, geometry, material);
        this._mass = mass;
        this._acc = (new THREE.Vector3()).copy(acceleration);
        this._speed = (new THREE.Vector3()).copy(initialSpeed);
        this._obstacles = [];
        this._collisionTolerance = 0.03;

        this._rays = [
            new THREE.Vector3(0, 0, 1), // z axis ?
            new THREE.Vector3(1, 0, 0), // x axis ?
            new THREE.Vector3(1, 0, 1),
            new THREE.Vector3(1, 0, -1),
            new THREE.Vector3(0, 0, -1),
            new THREE.Vector3(-1, 0, -1),
            new THREE.Vector3(-1, 0, 0),
            new THREE.Vector3(-1, 0, 1)
        ];
        this._rayCaster = new THREE.Raycaster();
    },
    
    setMass : function(newMass){
        this._mass = newMass;
    },
    setSpeed : function(speed){
        this._speed = (new THREE.Vector3()).copy(speed);
    },
    setAcceleration : function(acc){
        this._acc = (new THREE.Vector3()).copy(acc);
    },
    setColliders: function(collidersList){
        this._obstacles = collidersList;
    },
    addCollider : function(collider){
        this._obstacles.push(collider);
    },
    
    checkCollisions: function(){
        //test bounding boxes first
        var intersect = {}; // raaaa : possible issue --> local reference
        var collision = false;
        var i = 0;
        while(i < this._obstacles.length && !collision)
        {
            collision = this.getBoundingBox().isIntersectionBox(this._obstacles[i].getBoundingBox());
            
            if(collision)
            {
                intersect = {'':0,}; //define an enum for collision types (penetratre, contact, late)
            }
            
            ++i;
        }
        
        //Raycasting
        i = 0;
        while(i < this._rays && !collision)
        {
            this._rayCaster.set(this._mesh.position, this._rays[i]);
            var allIntersects = this._rayCaster.intersectObjects(this._obstacles);
            
            if(allIntersects.length > 0 && allIntersects[0].distance > this._collisionTolerance)
            {
                collision = true;
                intersect = allIntersects[0];
            }
            ++i;
        }
        
        return intersect;
    },
    
    mass : function(){
        return this._mass;
    },
    speed : function(){
        return this._speed;
    },
    acceleration : function(){
        return this._acc;
    },
    colliders : function(){
        return this._obstacles;
    }
});