
define(
    [],
    function()
    {
        var AbstractChecker = new JS.Class({
            initialize : function(className, methodName)
            {
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
                this.methodName = (methodName && (methodName.constructor === String || methodName instanceof String)) ? methodName : "'Unknow method'";
                this.methodName = methodName;
            },

            setCallerNames : function(className, methodName)
            {
                this.className = (className && (className.constructor === String || className instanceof String)) ? className : "'Unknow class'";
                this.methodName = (methodName && (className.constructor === String || methodName instanceof String)) ? methodName : "'Unknow method'";
            },

            setStrictMode : function(yesNo)
            {
                this.strict = new Boolean(yesNo);
            }
        });
        
        return AbstractChecker;
    });


