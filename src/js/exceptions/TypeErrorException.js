/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var TypeErrorException = new JS.Class(GenericException, {
    initialize : function(message, className, methodName)
    {
        this.callSuper(message, className, methodName, 'TypeErrorException');
    }
});
