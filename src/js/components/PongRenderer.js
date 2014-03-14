/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var PongRenderer = new JS.Class({
    initialize: function(htmlContainerId, width, height, pongScene){
        this.width = width;
        this.height = height;
        this.lastTime = 0;
        this.cameraControls = null;
        
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 10);
        
	this.light = new THREE.PointLight(0xffffff);
	this.light.position.set(0,3,0);

        this.threeRenderer = new THREE.WebGLRenderer();
        this.threeRenderer.setSize(width, height);

        this.htmlContainer = document.getElementById(htmlContainerId);
        this.htmlContainer.appendChild(this.threeRenderer.domElement);

        THREEx.WindowResize(this, this.camera);
        this.fullScreenBindedKey = THREEx.FullScreen.bindKey({charCode: 'f'.charCodeAt(0)});        
    },
    
    bindScene: function(pongScene){
        this.pongScene = pongScene;
        this.threeScene = pongScene.getThreeScene();
        this.threeScene.add(this.camera);
        this.threeScene.add(this.light);
    },
    
    bindKinematicEngine: function(kinematicEngine){
        this.kEngine = kinematicEngine;
    },
    
    bindComponents: function(pongScene, kinematicEngine){
        bindScene(pongScene);
        bindKinematicEngine(kinematicEngine);
    },
    
    makeNormalBox: function(){
        this._normalBox = new NormalBox();
        this._normalBox.setVisible(true);
        this.threeScene.add(this._normalBox.getThreeMesh());
    },
    
    makeAxis: function(){
        this._axisHelper = new THREE.AxisHelper(1);
        this.threeScene.add(this._axisHelper);
    },
    
    setCameraControls: function(){
        this.cameraControls = new THREE.OrbitControls(this.camera, this.domElement);
    },
    
    render: function(){
        this.threeRenderer.render(this.threeScene, this.camera);
    },
    
    update: function(){
        //camera control with mouse (for tests)
        if(this.cameraControls !== null)
            this.cameraControls.update();
        
        this.kEngine.moveBall();
    },
    
    width: function(){
        return this.width;
    },
    
    height: function(){
        return this.height;
    },
    
    setSize: function(width, height){
        this.width = width;
        this.height = height;
    },
    
    setCameraPosition: function(x, y, z){
        this.camera.position.set(x, y, z);
        this.camera.lookAt(new THREE.Vector3(0,0,0));
    },
    
    setFullScreenBindKey: function(char){
        this.fullScreenBindedKey.unbind();
        this.fullScreenBindedKey = THREEx.FullScreen.bindKey({charCode: char.charCodeAt(0)});
    }
});