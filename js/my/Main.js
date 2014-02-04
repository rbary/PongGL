/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var renderer;

function animate()
{
    requestAnimationFrame(animate);
    renderer.render();
    renderer.update();
}

window.onload = function(){
    var pongScene = new PongScene();
    renderer = new PongRenderer("view", window.innerWidth, window.innerHeight, pongScene.getThreeScene());
    
    renderer.setCameraControls();
    renderer.makeNormalBox();
    renderer.makeAxis();
    renderer.setFullScreenBindKey('m');
    
    animate();
};
