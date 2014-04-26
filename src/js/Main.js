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
    
    catch(ex if ex instanceof GenericException)
    {
        console.log("\nLogging from Main.js, catching instanceof GenericException\n");
        console.log(ex.getMessage());
    }
    
//    catch(ex)
//    {
//        console.log("\nLogging from Main.js, catching other errors\n");
//        console.log(ex.message);
//    }
};

function type(obj){
	var text = obj.constructor.toString();
	return text.match(/function (.*)\(/)[1];
}