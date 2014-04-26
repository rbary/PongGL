
define(
    ['__Base__',
    'EnumCollisionType',
    'Abstract3DObject'],
    
    function(__Base__, EnumCollisionType, Abstract3DObject)
    {
        var CollisionTestResultHolder = new JS.Class(__Base__,
        {

            initialize: function()
            {
                this.callSuper('CollisionTestResultHolder');

                this.isColliding = false;
                this.movingObject = null;
                this.collider = null;
                this.collisionPoint = null;
                this.collisionFaceNormal = null;
                this.collisionType = EnumCollisionType.NONE;
                this.collisionTime = 0;
            },

            setResult: function(isColliding, movingObject, collider, collisionPoint, collisionFaceNormal, collisionType, collisionTime)
            {
                this.checkArgs([isColliding, collider, collider, collisionPoint, collisionFaceNormal, collisionType, collisionTime],
                               [Boolean, Abstract3DObject, Abstract3DObject, THREE.Vector3, THREE.Vector3, String, Number],'setResult');

                this.isColliding = isColliding;
                this.movingObject = movingObject;
                this.collider = collider;
                this.collisionPoint = collisionPoint;
                this.collisionType = collisionType;
                this.collisionFaceNormal = collisionFaceNormal;
                this.collisionTime = collisionTime;

                return this;
            }
        });
        
        return CollisionTestResultHolder;
    });


