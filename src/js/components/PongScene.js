/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var PongScene = new JS.Class(__Base__,{
    wallWidth: 0.7,
    wallHeight: 0.3,
    wallThickness: 0.02,
    batWidth: 0.3,
    batHeight: 0.03,
    batThickness: 0.03,
    groundWidth: 0.7,
    groundHeight: 0.5,
    ballRadius: 0.01,
    ballMass: 500, //en grammes
    initialSpeed: new THREE.Vector3(0.0001,0,0),
    initialAcceleration: new THREE.Vector3(0,0,0),
    
    initialize: function()
    {
        this.walls = new Array();
        this.bats = new Array();
        this.movingObjects = new Array();

        this.ball = new Ball(this.ballRadius, 0, 0, 0, this.ballMass, this.initialAcceleration, this.initialSpeed);
        this.ball.setY(-0.03);
        
        this.walls[0] = new Wall('wall-left', 0,0,this.groundHeight/2, this.wallWidth, this.wallHeight, this.wallThickness);
        this.walls[1] = new Wall('wall-right', 0,0,-this.groundHeight/2, this.wallWidth, this.wallHeight, this.wallThickness);
        //ground
        this.walls[2] = new Wall('ground', 0,0,0, this.groundWidth, this.wallThickness, this.groundHeight);
        this.walls[2].setY(-0.05);
        
        var v0 = new THREE.Vector3(0,0,0);
        this.bats[0] = new Bat('playersBat', this.groundWidth/2,-0.03,0, this.batThickness, this.batHeight, this.batWidth, 0,v0,v0);
        this.bats[1] = new Bat('cpuBat', -this.groundWidth/2,-0.03,0, this.batThickness, this.batHeight, this.batWidth, 0,v0,v0);
        
        this.movingObjects.push(this.ball);
        for(var i=0; i < this.walls.length; ++i)
        {
            this.ball.addMotionLessObstacle(this.walls[i]);
        }
        for(var i=0; i < this.bats.length; ++i)
        {
            this.ball.addMotionLessObstacle(this.bats[i]);
        }

        this.scene = new THREE.Scene();
        
        this.scene.add(this.ball.getThreeMesh());
        
        this.scene.add(this.walls[0].getThreeMesh());
        this.scene.add(this.walls[1].getThreeMesh());
        this.scene.add(this.walls[2].getThreeMesh());

        this.scene.add(this.bats[0].getThreeMesh());
        this.scene.add(this.bats[1].getThreeMesh());
    },
    
    getThreeScene: function()
    {
        return this.scene;
    }
});