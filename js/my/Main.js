/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function createScene(width, height)
{
    var pongScene = new PongScene();
    var renderer = new PongRenderer("view", width, height, pongScene.getThreeScene());
    
    renderer.makeNormalBox();
    renderer.makeAxis();
    
    renderer.render();
}

window.onload = function(){
    createScene(window.innerWidth, window.innerHeight);
};
