
define(
    ['Abstract3DObject',
    'EnumRayCastingMode',
    'EnumCollisionType',
    'CollisionTestResultHolder',
    'Geometry',
    'DefaultParameters'],
    
    function(Abstract3DObject, EnumRayCastingMode, EnumCollisionType, CollisionTestResultHolder, Geometry, DefaultParameters)
    {
        /**
         * 
         * @type Class
         * 
         * Abstract because new THREE.Mesh still doesn't set the geometry and the material
         * 
         * Note: finaly, we only need the acceleration and the initial speed, to deduce
         * the instant position and instant speed.
         * One need to be careful not to modify the initial speed by mistake.
         */
        var AbstractDynamic3DObject = new JS.Class(Abstract3DObject,
        {
            initialize: function(name, xPos, yPos, zPos, geometry, material, mass, acceleration, initialSpeed)
            {
                this.callSuper(name, xPos, yPos, zPos, geometry, material);
                this.checkArgs([mass, acceleration, initialSpeed], [Number, THREE.Vector3, THREE.Vector3], 'initialize');

                this._mass = mass;
                this._acc = (new THREE.Vector3()).copy(acceleration);
                this._speed = (new THREE.Vector3()).copy(initialSpeed);
                this._timeCursor = 0; /*!< Allows to move back and forth in the current simulation time interval */

                this._obstacles = {motionless:[], moving:[]};
                this._collisionTolerance = DefaultParameters.collisionTolerance;

                this._rayCaster = new THREE.Raycaster();
                this._rayDirections = [];
                this._rayLaunchPoints = [];
                this._rayCastingMode = EnumRayCastingMode.none;

                this._initialAcc = this._acc;
                this._initialSpeed = this._speed;
            },

            setMass : function(newMass)
            {
                this.checkArgs([newMass], [Number], 'setMass');

                this._mass = newMass;
            },
            setInitialSpeed : function(speed)
            {
                this.checkArgs([speed], [THREE.Vector3], 'setSpeed');

                this._initialSpeed = (new THREE.Vector3()).copy(speed);
            },
            setSpeed : function(speed)
            {
                this.checkArgs([speed], [THREE.Vector3], 'setSpeed');

                this._speed = (new THREE.Vector3()).copy(speed);
            },
            setInitialAcceleration : function(acc)
            {
                this.checkArgs([acc], [THREE.Vector3], 'setAcceleration');

                this._initialAcc = (new THREE.Vector3()).copy(acc);
            },
            setAcceleration : function(acc)
            {
                this.checkArgs([acc], [THREE.Vector3], 'setAcceleration');

                this._acc = (new THREE.Vector3()).copy(acc);
            },
            reset: function()
            {
                this.callSuper();
                this.setSpeed(this._initialSpeed);
                this.setAcceleration(this._initialAcc);
            },
            setCollisionTolerance: function(tolerance)
            {
                this.checkArgs([tolerance], [Number], 'setCollisionTolerance');

                this._collisionTolerance = Math.abs(tolerance);
            },
            setTimeCursor: function(time)
            {
                this.checkArgs([time], [Number], 'setAcceleration');

                this._timeCursor = Math.abs(time);
            },
            addMovingObstacle: function(movingObstacle)
            {
                this.checkArgs([movingObstacle], [Abstract3DObject], 'addMovingObstacle');

                this._obstacles.moving.push(movingObstacle);
            },
            addMotionLessObstacle: function(motionLessObstacle)
            {
                this.checkArgs([motionLessObstacle], [Abstract3DObject], 'addMotionLessObstacle');

                this._obstacles.motionless.push(motionLessObstacle);
            },
            addObstacles: function(motionLessObstacleList, movingObstacleList)
            {
                this.addMotionLessObstacle(motionLessObstacleList);
                this.addMovingObstacle(movingObstacleList);
            },

            setOmniDirectionalRays: function()
            {
                this._rayDirections = [
                    new THREE.Vector3(0, 1, 0),
                    new THREE.Vector3(1, 1, 0),
                    new THREE.Vector3(1, 0, 0),
                    new THREE.Vector3(1, -1, 0),
                    new THREE.Vector3(0, -1, 0),
                    new THREE.Vector3(-1, -1, 0),
                    new THREE.Vector3(-1, 0, 0),
                    new THREE.Vector3(-1, 1, 0)
                ];

                this._rayLaunchPoints = [this.position()];
                this._rayCastingMode = EnumRayCastingMode.omnidirectional;
            },

            setUniDirectionalRays: function(dirVector)
            {
                this.checkArgs([dirVector], [THREE.Vector3], 'setUniDirectionalRays');

                this._rayDirections = [dirVector];

                var bb = this.getBoundingBox();

                var x = bb.max.x;
                var y = this.position().z;
                var z = bb.max.z;
                var l = bb.max.x - bb.min.x;

                this._rayLaunchPoints = [
                    new THREE.Vector3(x, y, z),
                    new THREE.Vector3(x, y, z-l/2),
                    new THREE.Vector3(x, y, z-l),
                    new THREE.Vector3(x-l/2, y, z-l),
                    new THREE.Vector3(x-l, y, z-l),
                    new THREE.Vector3(x-l, y, z-l/2),
                    new THREE.Vector3(x-l, y, z),
                    new THREE.Vector3(x-l/2, y, z),
                    new THREE.Vector3(x-l/2, y, z-l/2)
                ];

                this._rayCastingMode = EnumRayCastingMode.unidirectional;
            },

            getRaysIntersection: function(obstaclesList)
            {
                this.checkArgs([obstaclesList], [Array], 'getRaysIntersection');

                var currentRayCastingRes;
                var minRayCastingRes = {};
                var minDistance = -1;

                for(var i = 0; i < this._rayDirections.length; ++i)
                {
                    if(this._rayCastingMode === EnumRayCastingMode.omnidirectional)
                        this._rayCaster.set(this._mesh.position, this._rayDirections[i]);
                    else
                        this._rayCaster.set(this._rayLaunchPoints[i], this._rayDirections[0]);

                    var allIntersects = this._rayCaster.intersectObjects(obstaclesList);

                    if(allIntersects.length > 0)
                    {
                        currentRayCastingRes = allIntersects[0];

                        if(currentRayCastingRes.distance < minDistance || minDistance < 0)
                        {
                            minDistance = currentRayCastingRes.distance;
                            minRayCastingRes = currentRayCastingRes.clone();
                        }
                    }
                }

                return this._makeCollisionTestResult(minRayCastingRes);
            },

            _makeCollisionTestResult: function(rayCastingRes)
            {
                this.checkArgs([rayCastingRes], [Object], '_makeCollisionTestResult');

                var isColliding = false;
                var collisionType = EnumCollisionType.NONE;
                
                if(Object.keys(rayCastingRes).length === 0)
                    rayCastingRes = {distance:null, point:null, face:null, faceIndex:null, object:null};
                
                if(rayCastingRes.object !== undefined && rayCastingRes.object !== null && rayCastingRes.object !== {})
                {
                    if(rayCastingRes.distance <= this._collisionTolerance)
                    {
                        // Direction constraint:
                        // close objects are not acutally colliding if they're going
                        // far from each other, instead of getting closer
                        if(Geometry.areConverging(this, rayCastingRes.object))
                        {
                            isColliding = true;
                            collisionType = EnumCollisionType.EXACT;
                        }
                    }

                    var faceNormal = Geometry.computeNormal(rayCastingRes.object.getVertex(rayCastingRes.face.a),
                                                            rayCastingRes.object.getVertex(rayCastingRes.face.b),
                                                            rayCastingRes.object.getVertex(rayCastingRes.face.c));
                }
                
                return (new CollisionTestResultHolder()).setResult(isColliding, this, rayCastingRes.object,
                                                                   rayCastingRes.point, faceNormal,
                                                                   collisionType, null);
            },

            detectContact: function()
            {
                this.setOmniDirectionalRays();
                return this.getRaysIntersection(this._obstacles.motionless.concat(this._obstacles.moving));
            },

            mass : function()
            {
                return this._mass;
            },
            initialSpeed : function()
            {
                return this._initialSpeed.clone();
            },
            initialAcceleration : function()
            {
                return this._initialAcc.clone();
            },
            speed : function()
            {
                return this._speed.clone();
            },
            acceleration : function()
            {
                return this._acc.clone();
            },
            obstacles : function()
            {
                return this._obstacles; // My Cloner module doesn't work
            },
            movingObstacles : function()
            {
                return this._obstacles.moving; // My Cloner module doesn't work
            },
            motionLessObstacles : function()
            {
                return this._obstacles.motionless; // My Cloner module doesn't work
            },
            timeCursor: function()
            {
                return this._timeCursor;
            }
        });
        
        return AbstractDynamic3DObject;
    });


