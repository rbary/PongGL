
define(
    ['GenericException'],
    function(GenericException)
    {
        var NullPointerException = new JS.Class(GenericException,
        {
            initialize : function(message, className, methodName)
            {
                this.callSuper(message, className, methodName, 'NullPointerException');
            }
        });
        
        return NullPointerException;
    });



