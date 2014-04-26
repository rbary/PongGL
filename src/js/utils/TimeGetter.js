/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var TimeGetter = new JS.Class(__Base__,
{
    initialize: function()
    {
        this.callSuper('TimeGetter');

        this.scaleFactor = 0.001;
    },
    
    setScaleFactor: function(scaleFactor)
    {
        this.checkArgs([scaleFactor], [Number],'setScaleFactor');
        
        this.scaleFactor = scaleFactor;
        
        return this;
    },
    
    getMillisec: function()
    {
        return (new Date()).getTime() * this.scaleFactor;
    },
    
    getSec: function()
    {
        return (new Date()).getTime() * this.scaleFactor / 1000;
    }
});