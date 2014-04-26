
define(
    ['GenericException'],
    function(GenericException)
    {
        var RuntimeErrorException = new JS.Class(GenericException,
        {
            initialize : function(message, className, methodName)
            {
                this.callSuper(message, className, methodName, 'RuntimeErrorException');
            }
        });

        return RuntimeErrorException;
    });


