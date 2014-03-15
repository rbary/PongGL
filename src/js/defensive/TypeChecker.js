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
            var message = "in "+this.className+"."+this.methodName+",  parameter 'args' is undefined";
            throw new IllegalArgumentException(message, 'TypeChecker', '_checkFormat');
        }

        if(args.constructor !== Array)
        {
            var message = "TypeChecker._checkFormat(for "+this.className+"."+this.methodName+"parameter 'args' must be an array";
            throw new IllegalArgumentException(message, 'TypeChecker', '_checkFormat');
        }

        if(types === undefined)
        {
            var message = "TypeChecker._checkFormat(for "+this.className+"."+this.methodName+"parameter 'types' is undefined";
            throw new IllegalArgumentException(message, 'TypeChecker', '_checkFormat');
        }

        if(types.constructor !== Array)
        {
            var message = "TypeChecker._checkFormat(for "+this.className+"."+this.methodName+"parameter 'types' must be an array";
            throw new IllegalArgumentException(message, 'TypeChecker', '_checkFormat');
        }

        if(args.length !== types.length)
        {
            var message = "TypeChecker._checkFormat(for "+this.className+"."+this.methodName+"'args' and 'types' must be of the same number";
            throw new LogicErrorException(message, 'TypeChecker', '_checkFormat');
        }
    },
    
    /**
     * @param {list of values} arguments list of arguments to be type checked.
     * @param {list of types} types list of constructors or JS.Class classes
     */
    check : function(args, types, methodName)
    {
        if(methodName instanceof String && methodName !== '')
            this.methodName = methodName;

        this._checkFormat(args, types);
        
        var message = "";
        var faulty = false;
        for(var i=0; i < types.length; ++i)
        {
            var arg = args[i];
            var type = types[i];
            
            if(!(arg instanceof type) && arg !== null)
            {
                message += "arguments "+i+" is not of the corresponding type\n\t";
                faulty = true;
            }
        }
        
        if(faulty)
            throw new TypeErrorException(message, this.className, this.methodName);
    }
});
