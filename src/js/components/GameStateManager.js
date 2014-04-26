
requirejs.config({
    paths: {
        __Base__: '../defensive/__Base__'
    }
});


define(
    ['__Base__'],
    
    function(__Base__)
    {
        var GameStateManager = new JS.Class(__Base__,
        {
            initialize: function(){}
        });
        
        return GameStateManager;
    });


