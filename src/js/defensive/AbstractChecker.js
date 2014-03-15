/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var AbstractChecker = new JS.Class({
    initialize : function(className, methodName)
    {
        console.log("\nLogging from AbstractChecker.\n");
        console.log("className: "+className);
        console.log("className.constructor === String: "+(className.constructor === String));
        console.log("className instanceof String: "+(className instanceof String));
        console.log("className && (className instanceof String): "+(className && (className instanceof String)));
        this.className = (className && (className instanceof String)) ? className : "'Unknow class'";
        this.methodName = (methodName && (methodName instanceof String)) ? methodName : "'Unknow method'";
    },
    
    setClassName : function(className)
    {
        this.className = (className && (className instanceof String)) ? className : "'Unknow class'";
    },
    
    setMethodName : function(methodName)
    {
        this.methodName = (methodName && (methodName instanceof String)) ? methodName : "'Unknow class'";
    },
    
    setCallerNames : function(className, methodName)
    {
        this.className = (className && (className instanceof String)) ? className : "'Unknow class'";
        this.methodName = (methodName && (methodName instanceof String)) ? methodName : "'Unknow class'";
    }
});