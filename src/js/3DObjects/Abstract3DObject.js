
define(
    ['__Base__'],
    
    function(__Base__)
    {
        /**
         * 
         * @type Class
         * 
         * Abstract because new THREE.Mesh does not define the geometry and the material
         */
        var Abstract3DObject = new JS.Class(__Base__,
        {
            initialize: function(name, xPos, yPos, zPos, geometry, material)
            {
                this.callSuper(name);
                this.checkArgs([xPos, yPos, zPos, geometry, material], [Number, Number, Number, THREE.Geometry, THREE.Material], 'initialize');
                
                this._mesh = new THREE.Mesh(geometry, material);
                this._mesh.position.set(xPos, yPos, zPos);

                this._mesh.geometry.computeBoundingBox();
                
                // Paramters of object reset
                this._initialPosition = new THREE.Vector3(xPos, yPos, zPos);
                this._initialRotation = this._mesh.rotation.clone();
            },

            setName: function(name)
            {
                this.checkArgs([name], [String], 'setName');

                this._name = name;
            },
            setX: function(xPos)
            {
                this.checkArgs([xPos], [Number], 'setX');

                this._mesh.position.x = xPos;
            },
            setY: function(yPos)
            {
                this.checkArgs([yPos], [Number], 'setY');

                this._mesh.position.y = yPos;
            },
            setZ: function(zPos)
            {
                this.checkArgs([zPos], [Number], 'setZ');

                this._mesh.position.z = zPos;
            },
            setInitialPosition: function(xPos, yPos, zPos)
            {
                this.checkArgs([xPos, yPos, zPos], [Number, Number, Number], 'setInitialPosition');

                this._initialPosition = new THREE.Vector3(xPos, yPos, zPos);
            },
            setPosition: function(xPos, yPos, zPos)
            {
                this.checkArgs([xPos, yPos, zPos], [Number, Number, Number], 'setPosition');

                this._mesh.position.set(xPos, yPos, zPos);
            },
            translate: function(translationVector)
            {
                this.checkArgs([translationVector], [THREE.Vector3], 'translate');

                this._mesh.position.add(translationVector);
            },
            setInitialRotation: function(xRot, yRot, zRot)
            {
                this.checkArgs([xRot, yRot, zRot], [Number, Number, Number], 'setInitialPosition');

                this._initialRotation = new THREE.Vector3(xRot, yRot, zRot);
            },
            setRotation: function(xRot, yRot, zRot)
            {
                this.checkArgs([xRot, yRot, zRot], [Number, Number, Number], 'setRotation');

                this._mesh.rotation.set(xRot, yRot, zRot);
            },
            reset: function()
            {
                this.setPosition(this._initialPosition.x, this._initialPosition.y, this._initialPosition.z);
                this.setRotation(this._initialRotation.x, this._initialRotation.y, this._initialRotation.z);
            },
            computeBondingBox : function()
            {
                this._mesh.geometry.computeBoundingBox();
            },

            name: function()
            {
                return this._name.clone();
            },
            xPos: function()
            {
                return this._mesh.position.x;
            },
            yPos: function()
            {
                return this._mesh.position.y;
            },
            zPos: function()
            {
                return this._mesh.position.z;
            },
            initialPosition: function()
            {
                return this._initialPosition.clone();
            },
            initialRotation: function()
            {
                return this._initialRotation.clone();
            },
            position: function()
            {
                return this._mesh.position.clone();
            },
            rotation: function()
            {
                return this._mesh.rotation.clone();
            },
            getThreeMesh: function()
            {
                return this._mesh;
            },
            getVertex: function(index)
            {
                this.checkArgs([index],[Number],'getVertex');
                
                if(index < this._mesh.geometry.vertices.length)
                    return this._mesh.geometry.vertices[index];
                else
                    return null;
            },
            getBoundingBox : function()
            {
                var myBb = this._mesh.geometry.boundingBox.clone();
                return new THREE.Box3(myBb.min, myBb.max);
            }
        });
        
        return Abstract3DObject;
    });
