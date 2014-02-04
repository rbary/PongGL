/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var painter;

function animate()
{
    requestAnimationFrame(animate);
    painter.paint();
    painter.update();
}

window.onload = function(){
    painter = new PongPainter(window.innerWidth, window.innerHeight);
    
    painter.setCameraControls();
    animate();
};
