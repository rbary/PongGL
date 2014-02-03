/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


// must implement IDrawable
var Ball = new JS.Class(AbstractDynamic3Dobject, {
    initialize: function(radius, xPos, yPos, zPos, mass, initialAcceleration, initialSpeed){
        var geometry = new THREE.SphereGeometry(radius, 10, 10, 0, Math.PI*2, 0, Math.PI*2);
        var material = new THREE.MeshBasicMaterial({ color: 0xff4A00, wireframe: false });

        this.callSuper("Ball", xPos, yPos, zPos, geometry, material, mass, initialAcceleration, initialSpeed);
    }
});