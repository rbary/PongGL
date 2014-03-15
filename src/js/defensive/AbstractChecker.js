/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var AbstractChecker = new JS.Class({
    initialize : function(className, methodName)
    {
        this.className = (className && (className.constructor === String || className instanceof String)) ? className : "'Unknow class'";
        this.className = (className && (className.constructor === String || className instanceof String)) ? className : "'Unknow class'";
        this.methodName = (methodName && (className.constructor === String || methodName instanceof String)) ? methodName : "'Unknow method'";
        this.strict = true;
    },
    
    setClassName : function(className)
    {
        this.className = (className && (className.constructor === String || className instanceof String)) ? className : "'Unknow class'";
    },
    
    setMethodName : function(methodName)
    {
        this.methodName = (methodName && (className.constructor === String || methodName instanceof String)) ? methodName : "'Unknow class'";
    },
    
    setCallerNames : function(className, methodName)
    {
        this.className = (className && (className.constructor === String || className instanceof String)) ? className : "'Unknow class'";
        this.methodName = (methodName && (className.constructor === String || methodName instanceof String)) ? methodName : "'Unknow class'";
    },
    
    setStrictMode : function(yesNo)
    {
        this.strict = new Boolean(yesNo);
    }
});