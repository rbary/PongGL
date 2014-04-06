/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var KinematicEngine = new JS.Class(__Base__,
{
    initialize: function()
    {
        this.callSuper('KinematicEngine');
        
        this._lastTime = 0;
        this._currentTime = 0;
        this._pongScene = null;
        this.objects = [];
    },
    
    bindScene: function(pongScene)
    {
        this.checkArgs([pongScene],[PongScene],'bindScene');
        this._pongScene = pongScene;
    },
    
    setInitialTime: function(time)
    {
        this.checkArgs([time], [Number], 'setInitialTime');
        
        this._lastTime = (time >= 0) ? time : 0;
    },
    
    setCurrentTime: function(time)
    {
        this.checkArgs([time], [Number], 'setCurrentTime');
        
        this._currentTime = (time >= 0) ? time : 0;
    },
    
    setInterval: function(startTime, endTime)
    {
        this.checkArgs([startTime, endTime], [Number, Number], 'setInterval');
        
        this._lastTime = Math.abs(startTime);
        this._currentTime = Math.abs(endTime);
    },
    
    /*** ball motion
    * formule de calcul de delta x
    * obtenu par soustraction de la formule x(t) = 1/2*a*t^2 + v0*t + x0
    * delta x = x2 - x1
    * a: vecteur accélération
    * v: vecteur vitesse
    * x2 - x1 = 1/2*a*(t2^2 - t1^2) + v0*(t2 - t1)
    ***/
    getKinematicsDeltaAt: function(dynamic3Dobject, currentTime)
    {
        this.checkArgs([dynamic3Dobject, currentTime], [Abstract3Dobject, Number], 'getKinematicsDeltaAt');
        
        var lastTime = (this._lastTime === 0) ? currentTime : this._lastTime;

        var timeDelta = currentTime - lastTime;
        var squaredTimeDelta = (currentTime*currentTime - lastTime*lastTime);
        squaredTimeDelta /= 1000000000000; //getTime() is milliseconds, and the formula is seconds
        
        var a = (new THREE.Vector3).copy(dynamic3Dobject.acceleration());
        var v = (new THREE.Vector3).copy(dynamic3Dobject.speed());
        var positionDelta;
        
        var speeDelta = (new THREE.Vector3()).copy(a).multiplyScalar(timeDelta);
        positionDelta = (new THREE.Vector3()).copy(a).multiplyScalar(0.5*squaredTimeDelta).add( v.multiplyScalar(timeDelta) );
        
        return {speeDelta:speeDelta, positionDelta:positionDelta};
    },

    move: function(dynamic3Dobject, currentTime)
    {
        var kinematicsDelta = this.getKinematicsDeltaAt(dynamic3Dobject, currentTime);
        
        dynamic3Dobject.translate(kinematicsDelta.positionDelta);
        dynamic3Dobject.speed().add(kinematicsDelta.speeDelta);
    },
    
    moveAll: function(dynamic3Dobjects, toTime)
    {
        this.checkArgs([dynamic3Dobjects, toTime], [Array, Number], 'moveAll');
        
        var currentTime = (toTime <= 0) ? (new Date()).getTime() : toTime;
        
        if(this._lastTime === 0)
            this._lastTime = currentTime;
        
        for(var i=0; i < dynamic3Dobjects.length; ++i)
        {
            this.move(dynamic3Dobjects[i], currentTime);
        }
        
        this._lastTime = currentTime;
    },

    moveBall: function()
    {
        var currentTime = (new Date()).getTime();
        this.move(this._pongScene.ball, currentTime);
    },
    
    moveBat: function(bat, xdelta)
    {
        this.checkArgs([bat, xdelta],[Bat, Number],'moveBat');
    },
    
    step: function()
    {
        this._lastTime = this._currentTime;
        this._currentTime = (new Date()).getTime();
    },
    
    stepTo: function(time)
    {
        
    },
    
    stepBack: function()
    {
        
    },
    
    timeOfPosition: function(object, position)
    {
        
    }
});
