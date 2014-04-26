/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

define(
   ['PongScene',
   'KinematicEngine',
   'PongRenderer'],
   
   function(PongScene, KinematicEngine, PongRenderer)
   {
        var PongGame = new JS.Class({
            init: function()
            {
                    this.pongScene = new PongScene();
                    this.kEngine = new KinematicEngine();
                    this.kEngine.bindScene(this.pongScene);

                    this.renderer = new PongRenderer("view", window.innerWidth, window.innerHeight);
                    this.renderer.bindComponents(this.pongScene, this.kEngine);

                    this.renderer.setCameraControls();
                    this.renderer.makeNormalBox();
                    this.renderer.makeAxis();

                    this.renderer.setCameraPosition(this.pongScene.wallWidth/2+0.4, 0.4, 0);
            },

            start: function()
            {
                requestAnimationFrame(this.start);
                this.renderer.render();
                this.renderer.update();
            }

        });
        
        return PongGame;
   });
