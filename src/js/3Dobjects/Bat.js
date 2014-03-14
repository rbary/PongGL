/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



var Bat = new JS.Class(AbstractDynamic3Dobject, {
    initialize: function(name, xPos, yPos, zPos, width, height, depth, mass, acceleration, initialSpeed){
        var geometry = new THREE.CubeGeometry(width, height, depth);
        var material = new THREE.MeshPhongMaterial({ color: 0xcccccc, wireframe: false });
        
        this.callSuper(name, xPos, yPos, zPos, geometry, material, mass, acceleration, initialSpeed);
    }
});
