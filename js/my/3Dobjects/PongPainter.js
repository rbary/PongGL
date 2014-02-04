/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var PongPainter = new JS.Class({
    initialize: function(width, height){
        this.pongScene = new PongScene();
        this.renderer = new PongRenderer("view", width, height, this.pongScene.getThreeScene());
        this.cameraControls = null;

        this.renderer.makeNormalBox();
        this.renderer.makeAxis();

        THREEx.WindowResize(this.renderer, this.renderer.camera);
        THREEx.FullScreen.bindKey({charCode: 'm'.charCodeAt(0)});
    },
    
    setCameraControls: function(){
        this.cameraControls = new THREE.OrbitControls(this.renderer.camera, this.renderer.domElement);
    },
    
    paint: function(){
        this.renderer.render();
    },
    
    update: function(){
        if(this.cameraControls !== null)
            this.cameraControls.update();
    }
});