/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var CollisionTestResultHolder = new JS.Class(__Base__,
{
    
    initialize: function()
    {
        this.callSuper('CollisionTestResultHolder');
        
        this.isColliding = false;
        this.collider = null;
        this.collisionPoint = null;
        this.collisionType = EnumCollisionType.NONE;
        this.collisionTime = 0;
    },
    
    setResult: function(isColliding, collider, collisionPoint, collisionType, collisionTime)
    {
        this.checkArgs([isColliding, collider, collisionPoint, collisionType, collisionTime],[Boolean, Abstract3Dobject, THREE.Vector3, String, Number],'setResult');
        
        this.isColliding = isColliding;
        this.collider = collider;
        this.collisionPoint = collisionPoint;
        this.collisionType = collisionType;
        this.collisionTime = collisionTime;
        
        return this;
    }
});