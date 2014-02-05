/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var PongRenderer = new JS.Class({
    initialize: function(htmlContainerId, width, height, pongScene){
        this._width = width;
        this._height = height;
        this.lastTime = 0;
        this.cameraControls = null;
        this.pongScene = pongScene;
        this.threeScene = pongScene.getThreeScene();
        
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 10);
        this.camera.position.set(1, 2, 3);
        this.camera.lookAt(new THREE.Vector3(0,0,0));
        this.threeScene.add(this.camera);
        
	this.light = new THREE.PointLight(0xffffff);
	this.light.position.set(0,3,0);
        this.threeScene.add(this.light);

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
        
        //ball motion
        //formule de calcul de delta x
        //obtenu par soustraction de la formule x(t) = 1/2*a*t^2 + v0*t + x0
        //delta x = x2 - x1
        //a: vecteur accélération
        //v: vecteur vitesse
        // x2 - x1 = 1/2*a*(t2^2 - t1^2) + v0*(t2 - t1)
        var currentTime = (new Date()).getTime();
        if(this.lastTime === 0)
            this.lastTime = currentTime;
        var timeDelta = currentTime - this.lastTime;
        var squaredTimeDelta = (currentTime*currentTime - this.lastTime*this.lastTime)/1000000000000; //this divisio because gettime is millisecondes, and the formula is secondes
        
        var a = (new THREE.Vector3).copy(this.pongScene.ball.acceleration());
        var v = (new THREE.Vector3).copy(this.pongScene.ball.speed());
        var positionDelta;
        
        var speeDelta = (new THREE.Vector3()).copy(a).multiplyScalar(timeDelta);
        positionDelta = (new THREE.Vector3()).copy(a).multiplyScalar(0.5*squaredTimeDelta).add( v.multiplyScalar(timeDelta) );
        
        this.pongScene.ball.translate(positionDelta);
        this.pongScene.ball.speed().add(speeDelta);
        
//        msg = "a:("+this.pongScene.ball.acceleration().x+","+this.pongScene.ball.acceleration().y+","+this.pongScene.ball.acceleration().z+")\n";
//        msg += "v:("+this.pongScene.ball.speed().x+","+this.pongScene.ball.speed().y+","+this.pongScene.ball.speed().z+")\n";
//        msg += "position:("+this.pongScene.ball.position().x+","+this.pongScene.ball.position().y+","+this.pongScene.ball.position().z+")\n";
//        console.log(msg);
        
        this.lastTime = currentTime;
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
    
    setCameraPosition: function(x, y, z){
        this.camera.position.set(x, y, z);
        this.camera.lookAt(new THREE.Vector3(0,0,0));
    },
    
    setFullScreenBindKey: function(char){
        this.fullScreenBindedKey.unbind();
        this.fullScreenBindedKey = THREEx.FullScreen.bindKey({charCode: char.charCodeAt(0)});
    }
});