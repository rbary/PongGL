/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var PongRenderer = new JS.Class({
    initialize: function(htmlContainerId, width, height, scene){
        this._width = width;
        this._height = height;
        this.cameraControls = null;
        this.scene = scene;
        
        this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 10);
        this.camera.position.set(1, 2, 3);
        this.camera.lookAt(new THREE.Vector3(0,0,0));
        this.scene.add(this.camera);

        this.threeRenderer = new THREE.WebGLRenderer();
        this.threeRenderer.setSize(width, height);

        this.htmlContainer = document.getElementById(htmlContainerId);
        this.htmlContainer.appendChild(this.threeRenderer.domElement);

        THREEx.WindowResize(this, this.camera);
        this.fullScreenBindedKey = THREEx.FullScreen.bindKey({charCode: 'f'.charCodeAt(0)});        
    },
    
    makeNormalBox: function(){
        this._normalBox = new NormalBox();
        this._normalBox.setVisible(true);
        this.scene.add(this._normalBox.getThreeMesh());
    },
    
    makeAxis: function(){
        this._axisHelper = new THREE.AxisHelper(1);
        this.scene.add(this._axisHelper);
    },
    
    setCameraControls: function(){
        this.cameraControls = new THREE.OrbitControls(this.camera, this.domElement);
    },
    
    render: function(){
        this.threeRenderer.render(this.scene, this.camera);
    },
    
    update: function(){
        if(this.cameraControls !== null)
            this.cameraControls.update();
    },
    
    width: function(){
        return this._width;
    },
    
    height: function(){
        return this._height;
    },
    
    setSize: function(width, height){
        this._width = width;
        this._height = height;
    },
    
    setFullScreenBindKey: function(char){
        this.fullScreenBindedKey.unbind();
        this.fullScreenBindedKey = THREEx.FullScreen.bindKey({charCode: char.charCodeAt(0)});
    }
});