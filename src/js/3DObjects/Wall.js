
define(
    ['Abstract3DObject',
    'TypeChecker'],
    
    function(Abstract3DObject, TypeChecker)
    {
        var Wall = new JS.Class(Abstract3DObject,
        {
            initialize: function(name, xPos, yPos, zPos, width, height, depth)
            {
                (new TypeChecker('Wall','initialize')).check([width, height, depth],[Number, Number, Number],''); //inner typechecker not set yet (callSuper() is later)
                var geometry = new THREE.CubeGeometry(width, height, depth);
                var material = new THREE.MeshPhongMaterial({ color: 0xcccccc, wireframe: false });

                this.callSuper(name, xPos, yPos, zPos, geometry, material);
            }
        });
        
        return Wall;
    });


