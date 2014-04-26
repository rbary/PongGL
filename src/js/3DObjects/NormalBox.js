/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

define(
    ['Abstract3DObject'],
    
    function(Abstract3DObject)
    {
        var NormalBox = new JS.Class(Abstract3DObject,
        {
            initialize: function()
            {
                var geometry = new THREE.CubeGeometry(2, 2, 2, 0,0,0);
                var material = new THREE.MeshBasicMaterial({ color: 0xffcccc, wireframe: true });

                this.callSuper("NormalBox", 0, 0, 0, geometry, material);
                this._mesh.visible = false;
            },

            setVisible: function(boolValue)
            {
                if(typeof(boolValue) === 'boolean')
                {
                    this._mesh.visible = boolValue;
                }
                else
                {
                    this._mesh.visible = false;
                }
            }
        });
        
        return NormalBox;
    });



