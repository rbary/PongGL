/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var GenericException = new JS.Class({
    initialize : function(message, exceptionName){
        this.name = (exceptionName !== null) ? exceptionName : "GenericException";
        this._message = (message !== null) ? message : "";
    },

    message: function(){
        return "Exception\n\t" + this.name + ": " + this._message;
    }
});
