
define(
    ['GenericException'],
    function(GenericException)
    {
        var LogicErrorException = new JS.Class(GenericException,
        {
            initialize : function(message, className, methodName)
            {
                this.callSuper(message, className, methodName, 'LogicErrorException');
            }
        });
        return LogicErrorException;
    });


