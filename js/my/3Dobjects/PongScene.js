/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var SceneMetrics = {
    WorldSize: new THREE.Vector3(2, 2, 2),
    WallThickness: 0.05,
    WallSurfaceRatio: 0.02
};


var PongScene = new JS.Class({
    wallWidth: 0.7,
    wallHeight: 0.3,
    wallThickness: 0.02,
    groundWidth: 0.7,
    groundHeight: 0.5,
    ballRadius: 0.01,
    ballMass: 500, //en grammes
    
    initialize: function(){
        this.walls = new Array();

        this.ball = new Ball(this.ballRadius, 0, 0, 0, this.ballMass, 0, 0);
        this.ball.setY(-0.03);
        
        this.walls[0] = new Wall('wall-left', 0,0,this.groundHeight/2, this.wallWidth, this.wallHeight, this.wallThickness);
        this.walls[1] = new Wall('wall-right', 0,0,-this.groundHeight/2, this.wallWidth, this.wallHeight, this.wallThickness);
        //ground
        this.walls[2] = new Wall('ground', 0,0,0, this.groundWidth, this.wallThickness, this.groundHeight);
        this.walls[2].setY(-0.05);
        
        this.scene = new THREE.Scene();
        
        this.scene.add(this.ball.getThreeMesh());
        
        this.scene.add(this.walls[0].getThreeMesh());
        this.scene.add(this.walls[1].getThreeMesh());
        this.scene.add(this.walls[2].getThreeMesh());
    },
    
    getThreeScene: function(){
        return this.scene;
    }
});