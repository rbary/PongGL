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
        
        this.typeChecker.check([name], [String], '__Base__.initialise');
        
        this.name = name ? name : '__Base__';
    },

    checkNullity: function(args, methodName)
    {
        this.nullityChecker.check(args, methodName);
    },

    checkTypes : function(args, types, methodName)
    {
        this.typeChecker.check(args, types, methodName);
    },

    checkArgs : function(args, types, methodName)
    {
        this.typeChecker.check(args, types, methodName);
        this.typeChecker.check(args, types, methodName);
    },
    
    setName: function(name)
    {
        this.typeChecker.check([name], [String], '__Base__.setName');

        this.name = name ? name : '__Base__';
    },

    getName: function()
    {
        return this.name;
    }
});
