
define(
    [],
    function()
    {
        var GenericException = new JS.Class({
            initialize : function(message, className, methodName, exceptionName)
            {
                this.name = (exceptionName && (exceptionName.constructor === String || exceptionName instanceof String)) ? exceptionName : "GenericException";
                this.message = (message && (message.constructor === String || message instanceof String)) ? message : "no details given";
                this.className = (className && (className.constructor === String || className instanceof String)) ? className : "'Unknown class'";
                this.methodName = (methodName && (methodName.constructor === String || methodName instanceof String)) ? methodName : "'Unknown method'";
            },

            getMessage: function()
            {
                return "Exception\n\t"+
                        this.name+" in "+this.className+"."+this.methodName+
                        ": " + this.message;
            }
        });
        
        return GenericException;
    });


