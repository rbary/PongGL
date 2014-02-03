/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var PongScene = new JS.Class({
    initialize: function(){
        this.walls = new Array();

        this.ball = new Ball(0.1, 0, 0, 0, 500, 0, 0);
        this.walls[0] = new Wall('wall0', 0, 0, 0.5, 0.5, 0.3, 0.05);
        
        this.scene = new THREE.Scene();
        
        this.scene.add(this.ball.getThreeMesh());
        this.scene.add(this.walls[0].getThreeMesh());
    },
    
    getThreeScene: function(){
        return this.scene;
    }
});