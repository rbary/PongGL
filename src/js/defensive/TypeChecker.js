/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var TypeChecker = new JS.Class(AbstractChecker, {
    initialize : function(className, methodName)
    {
        this.callSuper(className, methodName);
    },
    
    _checkFormat : function(args, types)
    {
        if(args === undefined)
        {
            var message = "called in "+this.className+"."+this.methodName+",  parameter 'args' is undefined";
            throw new IllegalArgumentException(message, 'TypeChecker', '_checkFormat');
        }

        if(args.constructor !== Array && !(args instanceof Array))
        {
            var message = "called in "+this.className+"."+this.methodName+", parameter 'args' must be an array";
            throw new IllegalArgumentException(message, 'TypeChecker', '_checkFormat');
        }

        if(types === undefined)
        {
            var message = "called in "+this.className+"."+this.methodName+", parameter 'types' is undefined";
            throw new IllegalArgumentException(message, 'TypeChecker', '_checkFormat');
        }

        if(types.constructor !== Array && !(types instanceof Array))
        {
            var message = "called in "+this.className+"."+this.methodName+", parameter 'types' must be an array";
            throw new IllegalArgumentException(message, 'TypeChecker', '_checkFormat');
        }

        if(args.length !== types.length)
        {
            console.log("Logging from TypeChecker_checkFormat");
            console.log("args: "+args);
            console.dir(args);
            console.log("types: "+types.toString());
            var message = "called in "+this.className+"."+this.methodName+", 'args' and 'types' must be of the same size";
            throw new LogicErrorException(message, 'TypeChecker', '_checkFormat');
        }
    },
    
    /**
     * @param {list of values} arguments list of arguments to be type checked.
     * @param {list of types} types list of constructors or JS.Class classes
     */
    check : function(args, types, methodName)
    {        
        if((methodName.constructor === String || methodName instanceof String) && methodName !== '')
            this.methodName = methodName;

        this._checkFormat(args, types);
        
        var message = "";
        var faulty = false;
        for(var i=0; i < types.length; ++i)
        {
            var arg = args[i];
            var type = types[i];
            var typeMatch = true;
            
            typeMatch = (arg.constructor === type);
            if(!this.strictMode)
                typeMatch = typeMatch || (arg instanceof type);
            
            if(!typeMatch && arg !== null)
            {
                console.log(arg);
                message += "arguments "+(i+1)+" is not of the corresponding type\n\t";
                faulty = true;
            }
        }
        
        if(faulty)
            throw new TypeErrorException(message, this.className, this.methodName);
    }
});
