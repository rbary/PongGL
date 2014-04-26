
define(
    ['AbstractDynamic3DObject',
    'TypeChecker'],
    
    function(AbstractDynamic3DObject, TypeChecker)
    {
        var Bat = new JS.Class(AbstractDynamic3DObject,
        {
            initialize: function(name, xPos, yPos, zPos, width, height, depth, mass, acceleration, initialSpeed)
            {
                (new TypeChecker('Bat','initialize')).check([width, height, depth],[Number, Number, Number],''); //inner typechecker not set yet (callSuper() is later)
                var geometry = new THREE.CubeGeometry(width, height, depth);
                var material = new THREE.MeshPhongMaterial({ color: 0xcccccc, wireframe: false });

                this.callSuper(name, xPos, yPos, zPos, geometry, material, mass, acceleration, initialSpeed);
            }
        });
        
        return Bat;
    });


