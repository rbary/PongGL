/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var __Base__ = new JS.Class({
    initialize : function(name)
    {
        this.nullityChecker = new NullityChecker(name);
        this.typeChecker = new TypeChecker(name);
        
        this.typeChecker.check(arguments, [String]);
        
        this.name = name ? name : '__Base__';
    },

    checkNullity: function(args, methodName)
    {
        this.nullityChecker.check(args, methodName);
    },

    checkTypes : function(args, methodName)
    {
        this.typeChecker.check(args, methodName);
    },

    checkArgs : function(args)
    {
        this.nullityChecker = new NullityChecker(args);
        this.typeChecker = new TypeChecker(args);
    },
    
    setName: function(name)
    {
        this.typeChecker.check(arguments, [String]);

        this.name = name ? name : '__Base__';
    },

    getName: function()
    {
        return this.name;
    }
});
