
define(
    ['AbstractDynamic3DObject',
    'TypeChecker'],
    
    function(AbstractDynamic3DObject, TypeChecker)
    {
        var Ball = new JS.Class(AbstractDynamic3DObject,
        {
            initialize: function(radius, xPos, yPos, zPos, mass, acceleration, initialSpeed)
            {
                (new TypeChecker('Ball','initialize')).check([radius],[Number],'initialize'); //inner typechecker not set yet (callSuper() is later)
                var geometry = new THREE.SphereGeometry(radius, 10, 10, 0, Math.PI*2, 0, Math.PI*2);
                var material = new THREE.MeshPhongMaterial({ color: 0xff4A00, wireframe: false });

                this.callSuper("Ball", xPos, yPos, zPos, geometry, material, mass, acceleration, initialSpeed);

                this.radius = radius;
            },

            radius: function()
            {
                return this.radius;
            }
        });
        
        return Ball;
    });


