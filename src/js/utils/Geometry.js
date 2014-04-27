
defin(
    ['__Base__',
    'AbstractDynamic3DObject',
    'Abstract3DObject'],
    
    function(__Base__, AbstractDynamic3DObject, Abstract3DObject)
    {
        var Geometry = new JS.Class(__Base__,
        {
            initialize: function()
            {
                this.callSuper('Geometry');
            },
            
            areConverging: function(movingObject, collider)
            {
                this.checkArgs([movingObject, collider],[AbstractDynamic3DObject, Abstract3DObject],'areConverging');
                
                var converging = false;
                
                if(collider instanceof AbstractDynamic3DObject || collider.constructor === AbstractDynamic3DObject)
                {
                    var P1 = movingObject.position().add(movingObject.speed().normalize());
                    var P2 = collider.position().add(collider.speed().normalize());
                    var P1P2 = P2.sub(P1);
                    var C1C2 = collider.position().sub(movingObject.position());
                    
                    converging = P1P2.length() < C1C2.length();
                }
                
                else
                {
                    var C1C2 = collider.position().sub(movingObject.position());
                    
                    converging = (C1C2.dot(movingObject.speed()) >= 0);
                }
                
                return converging;
            },
            
            computeNormal: function(vertexA, vertexB, vertexC)
            {
                this.checkArgs([vertexA, vertexB, vertexC], [THREE.Vector3], 'computeNormal');
                
                var AB = vertexB.clone().sub(vertexA).normalize();
                var AC = vertexC.clone().sub(vertexA).normalize();
                
                return AB.cross(AC);
            }
        });
        
        return new Geometry();
    });