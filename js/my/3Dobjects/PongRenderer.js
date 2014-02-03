/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var PongRenderer = new JS.Class({
    initialize: function(htmlContainerId, width, height, scene){
        this.scene = scene;

        this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
        this.camera.position.set(0, 0, 1000);
        this.scene.add(this.camera);
        
        this.threeRenderer = new THREE.WebGLRenderer();
        this.threeRenderer.setSize(width, height);

        this.htmlContainer = document.getElementById(htmlContainerId);
        this.htmlContainer.appendChild(this.threeRenderer.domElement);
        
    },
    
    render: function(){
        //check if scene instance of THREE.Scene

        this.threeRenderer.render(this.scene, this.camera);
    }
});