/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var PongScene = new JS.Class({
    initialize: function(){
        this.ball = new Ball(5, 0, 0, 0, 500, 0, 0);
        
        this.scene = new THREE.Scene();
        
        this.scene.add(this.ball.getThreeMesh());
    },
    
    getThreeScene: function(){
        return this.scene;
    }
});