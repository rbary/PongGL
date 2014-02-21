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
    
    mass : function(){
        return this._mass;
    },
    speed : function(){
        return this._speed;
    },
    acceleration : function(){
        return this._acc;
    }
});