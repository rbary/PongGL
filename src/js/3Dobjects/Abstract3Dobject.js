/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * 
 * @type Class
 * 
 * Abstract because new THREE.Mesh does not define the geometry and the material
 */
var Abstract3Doject = new JS.Class({
    initialize: function(name, xPos, yPos, zPos, geometry, material){
        this._name = name;
        this._mesh = new THREE.Mesh(geometry, material);
        this._mesh.position.set(xPos, yPos, zPos);
        
        this._mesh.geometry.computeBoundingBox();
    },
    
    setName: function(name){
        this._name = name;
    },
    setX: function(xPos){
        this._mesh.position.x = xPos;
    },
    setY: function(yPos){
        this._mesh.position.y = yPos;
    },
    setZ: function(zPos){
        this._mesh.position.z = zPos;
    },
    setPosition: function(xPos, yPos, zPos){
        this._mesh.position.set(xPos, yPos, zPos);
    },
    translate: function(translationVector){
        this._mesh.position.add(translationVector);
    },
    setRotation: function(xRot, yRot, zRot){
        this._mesh.rotation.set(xRot, yRot, zRot);
    },
    computeBondingBox : function(){
        this._mesh.geometry.computeBoundingBox();
    },

    name: function(){
        return this._name;
    },
    xPos: function(){
        return this._mesh.position.x;
    },
    yPos: function(){
        return this._mesh.position.y;
    },
    zPos: function(){
        return this._mesh.position.z;
    },
    position: function(){
        return this._mesh.position;
    },
    rotation: function(){
        return this._mesh.rotation;
    },
    getThreeMesh: function(){
        return this._mesh;
    },
    getBoundingBox : function(){
        var myBb = this._mesh.geometry.boundingBox.clone();
        return new THREE.Box3(myBb.min, myBb.max);
    }
});