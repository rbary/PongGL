/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var GenericException = new JS.Class({
    initialize : function(message, className, methodName, exceptionName)
    {
        this.name = (exceptionName && (exceptionName instanceof String)) ? exceptionName : "GenericException";
        this.message = (message && (message instanceof String)) ? message : "no details given";
        this.className = (className && (className instanceof String)) ? className : "'Unknown class'";
        this.methodName = (methodName && (methodName instanceof String)) ? methodName : "'Unknown method'";
    },

    getMessage: function()
    {
        return "Exception\n\t"+
                this.name+" in "+this.className+"."+this.methodName+
                ": " + this.message;
    }
});
