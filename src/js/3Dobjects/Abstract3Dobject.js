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
    initialize: function(name, xPos, yPos, zPos, geometry, material)
    {
        this._preInitialize(name, xPos, yPos, zPos, geometry, material);
        this._name = name;
        this._mesh = new THREE.Mesh(geometry, material);
        this._mesh.position.set(xPos, yPos, zPos);
        
        this._mesh.geometry.computeBoundingBox();
    },
    
    setName: function(name)
    {
        (new NullityChecker('Abstract3Doject', 'setName')).check([{name:'name', value:name}]);
        
        this._name = name;
    },
    setX: function(xPos)
    {
        (new NullityChecker('Abstract3Doject', 'xPos')).check([{name:'xPos', value:xPos}]);
        
        this._mesh.position.x = xPos;
    },
    setY: function(yPos){
        (new NullityChecker('Abstract3Doject', 'yPos')).check([{name:'yPos', value:yPos}]);
        
        this._mesh.position.y = yPos;
    },
    setZ: function(zPos){
        (new NullityChecker('Abstract3Doject', 'zPos')).check([{name:'zPos', value:zPos}]);
        
        this._mesh.position.z = zPos;
    },
    setPosition: function(xPos, yPos, zPos)
    {
        _preSetPosition(xPos, yPos, zPos);
        
        this._mesh.position.set(xPos, yPos, zPos);
    },
    translate: function(translationVector)
    {
        this._mesh.position.add(translationVector);
    },
    setRotation: function(xRot, yRot, zRot)
    {
        this._mesh.rotation.set(xRot, yRot, zRot);
    },
    computeBondingBox : function()
    {
        this._mesh.geometry.computeBoundingBox();
    },

    name: function()
    {
        return this._name;
    },
    xPos: function()
    {
        return this._mesh.position.x;
    },
    yPos: function()
    {
        return this._mesh.position.y;
    },
    zPos: function()
    {
        return this._mesh.position.z;
    },
    position: function()
    {
        return this._mesh.position;
    },
    rotation: function()
    {
        return this._mesh.rotation;
    },
    getThreeMesh: function()
    {
        return this._mesh;
    },
    getBoundingBox : function()
    {
        var myBb = this._mesh.geometry.boundingBox.clone();
        return new THREE.Box3(myBb.min, myBb.max);
    },
    
    _preInitialize: function(name, xPos, yPos, zPos, geometry, material)
    {
        var parameters = [{name:'name', value:name}, {name:'xPos', value:xPos},
            {name:'yPos', value:yPos}, {name:'zPos', value:zPos},
            {name:'geometry', value:geometry}, {name:'material', value:material}];
        
        (new NullityChecker('Abstract3Doject', '_preInitialize')).check(parameters);
    },
    
    _preSetPosition: function(xPos, yPos, zPos)
    {
        var parameters = [{name:'xPos', value:xPos}, {name:'yPos', value:yPos},
                          {name:'zPos', value:zPos}];
        
        (new NullityChecker('Abstract3Doject', '_preSetPosition')).check(parameters);
    }
});