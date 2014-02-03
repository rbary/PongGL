/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var PongRenderer = new JS.Class({
    initialize: function(htmlContainerId, width, height, scene){
        this._width = width;
        this._height = height;
        this._normalBox = new NormalBox();
        this._axisHelper = new THREE.AxisHelper(1);
        this._axisHelper.visible = false;
        this.scene = scene;
        
        this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 10);
        this.camera.position.set(1, 2, 3);
        this.camera.lookAt(new THREE.Vector3(0,0,0));
        this.scene.add(this.camera);

        this.scene.add(this._normalBox.getThreeMesh());
        this.scene.add(this._axisHelper);

        this.threeRenderer = new THREE.WebGLRenderer();
        this.threeRenderer.setSize(width, height);

        this.htmlContainer = document.getElementById(htmlContainerId);
        this.htmlContainer.appendChild(this.threeRenderer.domElement);
        
    },
    
    showNormalBox: function(boolValue){
        this._normalBox.setVisible(boolValue);
    },
    
    showAxis: function(boolValue){
        if(typeof(boolValue) === 'boolean')
        {
            this._axisHelper.visible = boolValue;
        }
        else
        {
            this._axisHelper.visible = false;
        }
    },
    
    render: function(){
        //check if scene instance of THREE.Scene

        this.threeRenderer.render(this.scene, this.camera);
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
    }
});