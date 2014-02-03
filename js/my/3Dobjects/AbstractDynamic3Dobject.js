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
 */
// must implement IDynamic
var AbstractDynamic3Dobject = new JS.Class(Abstract3Doject, {
    initialize: function(name, xPos, yPos, zPos, geometry, material, mass, initialAcceleration, initialSpeed){
        this.callSuper(name, xPos, yPos, zPos, geometry, material);
        this._mass = mass;
        this._acc = initialAcceleration;
        this._speed = initialSpeed;
    },
    
    setMass : function(newMass){
        this._mass = newMass;
    },
    setSpeed : function(newSpeed){
        this._speed = newSpeed;
    },
    setAcceleration : function(newAcceleration){
        this._acc = newAcceleration;
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