
define(
    ['GenericException'],
    function(GenericException)
    {
        var IllegalArgumentException = new JS.Class(GenericException,
        {
            initialize : function(message, className, methodName)
            {
                this.callSuper(message, className, methodName, 'IllegalArgumentException');
            }
        });
        
        return IllegalArgumentException;
    });


