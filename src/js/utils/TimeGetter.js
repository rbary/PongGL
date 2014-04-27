
define(
    ['__Base__'],
    
    function(__Base__)
    {
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
                return (new Date()).getTime() * this.scaleFactor;
            }
        });

        return TimeGetter;
    });


