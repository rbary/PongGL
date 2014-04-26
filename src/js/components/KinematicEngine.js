//
//requirejs.config({
//    paths: {
//        TimeGetter: '../utils/TimeGetter',
//        AbstractDynamic3DObject: '../3DObjects/AbstractDynamic3DObject'
//    }
//});

define(
    ['PongScene',
    'TimeGetter',
    'AbstractDynamic3DObject',
    '__Base__'],

    function(PongScene, TimeGetter, AbstractDynamic3DObject, __Base__)
    {
        var KinematicEngine = new JS.Class(__Base__,
        {
            initialize: function()
            {
                this.callSuper('KinematicEngine');

                this._startTime = 0;
                this._endTime = 0;
                this._pongScene = null;
                this.timeGetter = new TimeGetter();
            },

            bindScene: function(pongScene)
            {
                this.checkArgs([pongScene],[PongScene],'bindScene');
                this._pongScene = pongScene;
            },

            setStartTime: function(time)
            {
                this.checkArgs([time], [Number], 'setStartTime');

                this._startTime = (time >= 0) ? time : 0;
            },

            setEndTime: function(time)
            {
                this.checkArgs([time], [Number], 'setEndTime');

                this._endTime = (time >= 0) ? time : 0;
            },

            startTime: function()
            {
                return this._startTime;
            },

            endTime: function()
            {
                return this._endTime;
            },

            setTimeInterval: function(startTime, endTime)
            {
                this.checkArgs([startTime, endTime], [Number, Number], 'setInterval');

                this._startTime = Math.abs(startTime);
                this._endTime = Math.abs(endTime);
            },

            shiftTimeInterval: function(toTime)
            {
                this.checkTypes([toTime],[Number],'shiftTimeInterval');

                this._startTime = this._endTime;
                if(toTime !== null)
                {
                    this._endTime = toTime;

                    //At the very begenning (defines initial time t0)
                    if(this._startTime === 0)
                        this._startTime = this._endTime;
                }

                for(var i=0; i < this._pongScene.movingObjects.length; ++i)
                {
                    this._pongScene.movingObjects[i].setTimeCursor(this._endTime);
                }
            },

            /*** ball motion
            * formule de calcul de delta x
            * obtenu par soustraction de la formule x(t) = 1/2*a*t^2 + v0*t + x0
            * delta x = x2 - x1
            * a: vecteur accélération
            * v: vecteur vitesse
            * x2 - x1 = 1/2*a*(t2^2 - t1^2) + v0*(t2 - t1)
            ***/
            getKinematicsDelta: function(dynamic3Dobject)
            {
                this.checkArgs([dynamic3Dobject], [AbstractDynamic3DObject], 'getKinematicsDelta');

                var currentTime = dynamic3Dobject.timeCursor();
                var lastTime = (this._startTime === 0) ? currentTime : this._startTime;

                var timeDelta = currentTime - lastTime;
                var squaredTimeDelta = (currentTime*currentTime - lastTime*lastTime);

                var a = (new THREE.Vector3).copy(dynamic3Dobject.acceleration());
                var v = (new THREE.Vector3).copy(dynamic3Dobject.speed());
                var positionDelta;

                var speeDelta = (new THREE.Vector3()).copy(a).multiplyScalar(timeDelta);
                positionDelta = (new THREE.Vector3()).copy(a).multiplyScalar(0.5*squaredTimeDelta).add( v.multiplyScalar(timeDelta) );

                return {speeDelta:speeDelta, positionDelta:positionDelta};
            },

            move: function(dynamic3Dobject)
            {
                var kinematicsDelta = this.getKinematicsDelta(dynamic3Dobject);

                dynamic3Dobject.translate(kinematicsDelta.positionDelta);
                dynamic3Dobject.setSpeed(dynamic3Dobject.speed().add(kinematicsDelta.speeDelta));
            },

            moveBack: function(dynamic3Dobject)
            {
                var kinematicsDelta = this.getKinematicsDelta(dynamic3Dobject);

                dynamic3Dobject.translate(kinematicsDelta.positionDelta.multiplyScalar(-1));
                dynamic3Dobject.setSpeed(dynamic3Dobject.speed().add(kinematicsDelta.speeDelta.multiplyScalar(-1)));
            },

            //Computes the new position of the given object within the time interval,
            //without shifting the time interval
            step: function(dynamic3Dobject)
            {
                dynamic3Dobject.setTimeCursor(this._endTime);

                this.move(dynamic3Dobject);
            },

            //Computes the new position all objects within the time interval,
            //without shifting the time interval
            stepAll: function()
            {
                for(var i=0; i < this._pongScene.movingObjects.length; ++i)
                {
                    this.step(this._pongScene.movingObjects[i]);
                }
            },

            //computes the position of the given objects at the given time, without shifting the time interval. 
            stepObjectsTo: function(dynamic3DobjectsList, toTime)
            {
                for(var i=0; i < dynamic3DobjectsList.length; ++i)
                {
                    var dynamic3Dobject = dynamic3DobjectsList[i];
                    dynamic3Dobject.setTimeCursor(toTime);

                    this.move(dynamic3Dobject);
                }
            },

            //computes the positions of all objects at the given time, without shifting the time interval. 
            //Use shiftTimeInterval to shift the time interval
            stepAllTo: function(toTime)
            {
                for(var i=0; i < this._pongScene.movingObjects.length; ++i)
                {
                    this._pongScene.movingObjects[i].setTimeCursor(toTime);
                    this.move(this._pongScene.movingObjects[i]);
                }
            },

            //Moves back the object to previous state, without shifting the time interval.
            //Use shiftTimeInterval to shift the time interval
            stepObjectsBack: function(dynamic3DobjectsList)
            {
                for(var i=0; i < dynamic3DobjectsList.length; ++i)
                {
                    var dynamic3Dobject = dynamic3DobjectsList[i];

                    this.moveBack(dynamic3Dobject);
                    dynamic3Dobject.setTimeCursor(this._startTime);
                }
            },

            //Moves back the object to previous state, without shifting the time interval.
            //Use shiftTimeInterval to shift the time interval
            stepBackAll: function()
            {
                for(var i=0; i < this._pongScene.movingObjects.length; ++i)
                {
                    this.moveBack(this._pongScene.movingObjects[i]);
                    this._pongScene.movingObjects[i].setTimeCursor(this._startTime);
                }
            },

            timeOfPosition: function(dynamic3Dobject, position, initialPosition)
            {
                var a = dynamic3Dobject.acceleration();
                var xP1 = initialPosition.x;
                var xP2 = position.x;

                var squaredTime = 2*(xP2 - xP1)/a.x + this._startTime*this._startTime;

                return Math.sqrt(squaredTime);
            },

            //Shifts the time interval, and computes the new position of all objects
            newFrame: function()
            {
                this.shiftTimeInterval( this.timeGetter.getSec() );

                //console.log(this._pongScene.movingObjects.length);
                for(var i=0; i < this._pongScene.movingObjects.length; ++i)
                {
                    this.move(this._pongScene.movingObjects[i]);
                }
            }
        });
        
        return KinematicEngine;
    });


