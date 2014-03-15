/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var NullityChecker = new JS.Class({
    initialize : function(className, methodName)
    {
        this.className = (className) ? className : "'Unknown class'";
        this.methodName = (methodName) ? methodName : "'Unknow method'";
        this.isFaulty = false;
        this.faultyState = "";
    },
    
    _checkFormat : function(param)
    {
        if(!param)
        {
            var message = "NullityChecker.check._checkFormat(for "+this.className+"."+this.methodName+"): argument 'param' must not be null or undefined";
            throw new GenericException(message, "IllegalArgument");
        }

        if(param.constructor !== Object)
        {
            var message = "NullityChecker.check._checkFormat(for "+this.className+"."+this.methodName+"): argument 'param' must be an object of the form {name:'paramName', value:paramValue}";
            throw new GenericException(message, "IllegalArgument");
        }

        if(!param.name)
        {
            var message = "NullityChecker.check._checkFormat(for "+this.className+"."+this.methodName+"): argument 'param' must be an object of the form {name:'paramName', value:paramValue}.\n\t property 'name' is missing or null.";
            throw new GenericException(message, "IllegalArgument");
        }

        if(param.value === undefined)
        {
            var message = "NullityChecker.check._checkFormat(for "+this.className+"."+this.methodName+"): argument 'param' must be an object of the form {name:'paramName', value:paramValue}.\n\t property 'value' is missing.";
            throw new GenericException(message, "IllegalArgument");
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
            var message = "NullityChecker.check(for "+this.className+"."+this.methodName+"): argument 'parameters' can't be evaluated";
            throw new GenericException(message, "IllegalArgument");
        }
        
        if(parameters.constructor !== Array)
        {
            var message = "NullityChecker.check(for "+this.className+"."+this.methodName+"): argument 'parameters' must be an array of the form form [{name:'param1', value:value1}, {name:'param2', value:value2}]";
            throw new GenericException(message, "IllegalArgument");
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
                message += "argument at position "+i+" in the given arguments list is "+faultyState;
                isFaulty = true;
            }
        }
        
        if(isFaulty)
        {
            throw new GenericException(message, "IllegalArguments");
        }
    },
    
    /**
     * @param {list of dict} parameters list of parameters, in the form [{name:'param1', value:value1}, {name:'param2', value:value2}]
     */
    checkNamed: function(parameters)
    {

        if(!parameters)
        {
            var message = "NullityChecker.checkNamed(for "+this.className+"."+this.methodName+"): argument 'parameters' can't be evaluated";
            throw new GenericException(message, "IllegalArgument");
        }
        
        if(parameters.constructor !== Array)
        {
            var message = "NullityChecker.checkNamed(for "+this.className+"."+this.methodName+"): argument 'parameters' must be an array of the form form [{name:'param1', value:value1}, {name:'param2', value:value2}]";
            throw new GenericException(message, "IllegalArgument");
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
            throw new GenericException(message, "IllegalArguments");
        }
    }
});