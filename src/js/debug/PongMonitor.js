/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

define(
    ['__Base__',
    'KinematicEngine',
    'DatGui'],
    
    function(__Base__, KinematicEngine)
    {
        var PongMonitor = new JS.Class(__Base__,
        {
            initialize: function()
            {
                this.callSuper('PongMonitor');
                
                this.kinEngine = null;
                this.gui = new dat.GUI();
            },
            
            bindKinEngine: function(kinEngine)
            {
                this.checkArgs([kinEngine], [KinematicEngine], 'bindKinEngine');
                
                this.kinEngine = kinEngine;
                this.gui.add(this.kinEngine, '_startTime');
            }
        });
        
        return PongMonitor;
    });
