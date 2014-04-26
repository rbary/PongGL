
requirejs.config({
    paths: {
        IllegalArgumentException: '../exceptions/IllegalArgumentException'
    }
});

define(
    ['AbstractChecker',
    'IllegalArgumentException',
    ],
    
    function(AbstractChecker, IllegalArgumentException)
    {
        var NullityChecker = new JS.Class(AbstractChecker,
        {
            initialize : function(className, methodName)
            {
                this.callSuper(className, methodName);

                this.isFaulty = false;
                this.faultyState = "";
            },

            _checkFormat : function(param)
            {
                if(!param)
                {
                    var message = "in "+this.className+"."+this.methodName+", argument 'param' must not be null or undefined";
                    throw new IllegalArgumentException(message, 'NullityChecker', '_checkFormat');
                }

                if(param.constructor !== Object)
                {
                    var message = "in "+this.className+"."+this.methodName+", argument 'param' must be an object of the form {name:'paramName', value:paramValue}";
                    throw new IllegalArgumentException(message, 'NullityChecker', '_checkFormat');
                }

                if(!param.name)
                {
                    var message = "in "+this.className+"."+this.methodName+", argument 'param' must be an object of the form {name:'paramName', value:paramValue}.\n\t property 'name' is missing or null.";
                    throw new IllegalArgumentException(message, 'NullityChecker', '_checkFormat');
                }

                if(param.value === undefined)
                {
                    var message = "in "+this.className+"."+this.methodName+", argument 'param' must be an object of the form {name:'paramName', value:paramValue}.\n\t property 'value' is missing.";
                    throw new IllegalArgumentException(message, 'NullityChecker', '_checkFormat');
                }
            },

            /**
             * @param {list of dict} parameters list of parameters, in the form [{name:'param1', value:value1}, {name:'param2', value:value2}]
             */
            check: function(parameters, methodName)
            {

                if(methodName instanceof String && methodName !== '')
                    this.setMethodName(methodName);

                if(!parameters)
                {
                    var message = "in "+this.className+"."+this.methodName+", argument 'parameters' can't be evaluated";
                    throw new IllegalArgumentException(message, 'NullityChecker', 'check');
                }

                if(parameters.constructor !== Array)
                {
                    var message = "in "+this.className+"."+this.methodName+", argument 'parameters' must be an array of the form form [{name:'param1', value:value1}, {name:'param2', value:value2}]";
                    throw new IllegalArgumentException(message, 'NullityChecker', 'check');
                }

                var message = this.className+"."+this.methodName+": ";
                var isFaulty = false;
                var faultyState = "";
                for(var i=0; i < parameters.length; ++i)
                {
                    var param = parameters[i];
                    this._checkFormat(param);

                    if(param === null || param === undefined)
                    {
                        faultyState = (param === undefined) ? "undefined" : "null";
                        message += "argument at position "+(i+1)+" in the given arguments list is "+faultyState;
                        isFaulty = true;
                    }
                }

                if(isFaulty)
                {
                    throw new IllegalArgumentException(message, 'NullityChecker', 'check');
                }
            },

            /**
             * @param {list of dict} parameters list of parameters, in the form [{name:'param1', value:value1}, {name:'param2', value:value2}]
             */
            checkNamed: function(parameters)
            {

                if(!parameters)
                {
                    var message = "called in "+this.className+"."+this.methodName+", argument 'parameters' can't be evaluated";
                    throw new IllegalArgumentException(message, 'NullityChecker','checkNamed');
                }

                if(parameters.constructor !== Array)
                {
                    var message = "called in "+this.className+"."+this.methodName+", argument 'parameters' must be an array of the form form [{name:'param1', value:value1}, {name:'param2', value:value2}]";
                    throw new IllegalArgumentException(message, 'NullityChecker','checkNamed');
                }

                var message = this.className+"."+this.methodName+": ";
                var isFaulty = false;
                var faultyState = "";
                for(var i=0; i < parameters.length; ++i)
                {
                    var param = parameters[i];
                    this._checkFormat(param);

                    if(param.value === null || param.value === undefined)
                    {
                        faultyState = (param.value === undefined) ? "undefined" : "null";
                        message += "parameter "+param.name+" is "+faultyState;
                        isFaulty = true;
                    }
                }

                if(isFaulty)
                {
                    throw new IllegalArgumentException(message, 'NullityChecker', 'checkNamed');
                }
            }
        });
        
        return NullityChecker;
    });


