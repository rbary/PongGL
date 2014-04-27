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
                
                this.pongGame = null;
                this.gui = new dat.GUI();
            },
            
            bindPongGame: function(pongGame)
            {
                // Don't know why the following doesn't work
                //this.checkArgs([pongGame], [PongGame], 'bindPongGame');
                
                this.pongGame = pongGame;
                
                var folder;
                var subFolder;
                var min = 0.;
                var step = 0.001;
                
                // Animation Controlls
                folder = this.gui.addFolder('Animation Controll');
                folder.add(this.pongGame, 'step');
                folder.add(this.pongGame, 'loop');
                folder.add(this.pongGame, 'stopLoop');
                folder.add(this.pongGame, 'reset');
                
                // Kinematic Engine
                folder = this.gui.addFolder('Kinematic Engine');
                folder.add(this.pongGame.kEngine, '_timeStep').min(min).step(0.0001).listen();
                
                // The ball
                folder = this.gui.addFolder('Pong Ball');
                var ball = this.pongGame.renderer.pongScene.ball;
                var mesh = ball._mesh;
                subFolder = folder.addFolder('Position');
                subFolder.add(mesh.position, 'x').min(min).step(step).listen();
                subFolder.add(mesh.position, 'y').min(min).step(step).listen();
                subFolder.add(mesh.position, 'z').min(min).step(step).listen();
                subFolder = folder.addFolder('Rotation');
                subFolder.add(mesh.rotation, 'x');
                subFolder.add(mesh.rotation, 'y');
                subFolder.add(mesh.rotation, 'z');
                subFolder = folder.addFolder('Initial Acceleration');
                subFolder.add(ball._initialAcc, 'x').min(min).step(step).listen();
                subFolder.add(ball._initialAcc, 'y').min(min).step(step).listen();
                subFolder.add(ball._initialAcc, 'z').min(min).step(step).listen();
                subFolder = folder.addFolder('Initial Speed');
                subFolder.add(ball._initialSpeed, 'x').min(min).step(step).listen();
                subFolder.add(ball._initialSpeed, 'y').min(min).step(step).listen();
                subFolder.add(ball._initialSpeed, 'z').min(min).step(step).listen();
                subFolder = folder.addFolder('Acceleration');
                subFolder.add(ball._acc, 'x').min(min).step(step).listen();
                subFolder.add(ball._acc, 'y').min(min).step(step).listen();
                subFolder.add(ball._acc, 'z').min(min).step(step).listen();
                subFolder = folder.addFolder('Speed');
                subFolder.add(ball._speed, 'x').min(min).step(step).listen();
                subFolder.add(ball._speed, 'y').min(min).step(step).listen();
                subFolder.add(ball._speed, 'z').min(min).step(step).listen();
                
                folder.add(ball, '_mass');
                folder.add(ball, '_timeCursor').min(min).step(step).listen();
                folder.add(ball, '_collisionTolerance');
            }
        });
        
        return PongMonitor;
    });
