/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var Wall = new JS.Class(Abstract3Doject, {
    initialize: function(name, xPos, yPos, zPos, width, height, depth){
        var geometry = new THREE.CubeGeometry(width, height, depth);
        var material = new THREE.MeshBasicMaterial({ color: 0xffcccc, wireframe: true });
        
        this.callSuper(name, xPos, yPos, zPos, geometry, material);
    }
});
