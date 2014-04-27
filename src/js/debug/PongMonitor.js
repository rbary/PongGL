/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

define(
    ['__Base__',
    'KinematicEngine',
    'PongGame',
    'DatGui'],
    
    function(__Base__, KinematicEngine, PongGame)
    {
        var PongMonitor = new JS.Class(__Base__,
        {
            initialize: function()
            {
                this.callSuper('PongMonitor');
                
                this.kinEngine = null;
                this.pongGame = null;
                this.gui = new dat.GUI();
            },
            
            bindKinEngine: function(kinEngine)
            {
                this.checkArgs([kinEngine], [KinematicEngine], 'bindKinEngine');
                
                this.kinEngine = kinEngine;
                this.gui.add(this.kinEngine, '_timeStep');
            },
            
            bindPongGame: function(pongGame)
            {
                // Don't know why the following doesn't work
                //this.checkArgs([pongGame], [PongGame], 'bindPongGame');
                
                this.pongGame = pongGame;
                this.gui.add(this.pongGame, 'step');
                this.gui.add(this.pongGame, 'loop');
                this.gui.add(this.pongGame, 'stopLoop');
                this.gui.add(this.pongGame, 'reset');
            }
        });
        
        return PongMonitor;
    });
