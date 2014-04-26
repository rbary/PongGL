
define(
    ['GenericException'],
    function(GenericException)
    {
        var TypeErrorException = new JS.Class(GenericException,
        {
            initialize : function(message, className, methodName)
            {
                this.callSuper(message, className, methodName, 'TypeErrorException');
            }
        });
        
        return TypeErrorException;
    });
