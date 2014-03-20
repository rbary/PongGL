/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var KinematicEngine = new JS.Class(__Base__,{
    initialize: function()
    {
        this.callSuper('KinematicEngine');
        this._lastTime = 0;
        this._pongScene = null;
    },
    
    bindScene: function(pongScene)
    {
        this.checkArgs([pongScene],[PongScene],'bindScene');
        this._pongScene = pongScene;
    },

    /*** ball motion
    * formule de calcul de delta x
    * obtenu par soustraction de la formule x(t) = 1/2*a*t^2 + v0*t + x0
    * delta x = x2 - x1
    * a: vecteur accélération
    * v: vecteur vitesse
    * x2 - x1 = 1/2*a*(t2^2 - t1^2) + v0*(t2 - t1)
    ***/
    moveBall: function()
    {
        var currentTime = (new Date()).getTime();
        if(this._lastTime === 0)
            this._lastTime = currentTime;

        var timeDelta = currentTime - this._lastTime;
        var squaredTimeDelta = (currentTime*currentTime - this._lastTime*this._lastTime);
        squaredTimeDelta /= 1000000000000; //getTime() is milliseconds, and the formula is seconds
        
        var a = (new THREE.Vector3).copy(this._pongScene.ball.acceleration());
        var v = (new THREE.Vector3).copy(this._pongScene.ball.speed());
        var positionDelta;
        
        var speeDelta = (new THREE.Vector3()).copy(a).multiplyScalar(timeDelta);
        positionDelta = (new THREE.Vector3()).copy(a).multiplyScalar(0.5*squaredTimeDelta).add( v.multiplyScalar(timeDelta) );
        
        this._pongScene.ball.translate(positionDelta);
        this._pongScene.ball.speed().add(speeDelta);
        
        this._lastTime = currentTime;
    },
    
    moveBat: function(bat, xdelta)
    {
        this.checkArgs([bat, xdelta],[Bat, Number],'moveBat');
    }
});
