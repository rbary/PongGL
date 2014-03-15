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

window.onload = function()
{
    try
    {
        var pongScene = new PongScene();
        var kEngine = new KinematicEngine();
        kEngine.bindScene(pongScene);

        renderer = new PongRenderer("view", window.innerWidth, window.innerHeight);
        renderer.bindComponents(pongScene, kEngine);

        renderer.setCameraControls();
        renderer.makeNormalBox();
        renderer.makeAxis();

        renderer.setCameraPosition(pongScene.wallWidth/2+0.4, 0.4, 0);

        animate();
    }
    
    catch(exception)
    {
        console.log("\nLogging from Main.js\n");
        console.log(exception.getMessage());
    }
};

function type(obj){
	var text = obj.constructor.toString();
	return text.match(/function (.*)\(/)[1];
}