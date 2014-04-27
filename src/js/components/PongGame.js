
define(
    ['__Base__',
    'PongScene',
    'KinematicEngine',
    'CollisionDetector',
    'CollisionReactor',
    'PongRenderer',
    'PongMonitor',
    'GenericException'],
    
    function(__Base__, PongScene, KinematicEngine, CollisionDetector, CollisionReactor,
             PongRenderer, PongMonitor, GenericException)
    {
        var PongGame = new JS.Class(__Base__,
        {
            initialize: function()
            {
                this.callSuper('PongGame');
                
                this.renderer = null;
                this.animate = null;
            },
            
            init: function()
            {
                try
                {
                    var pongScene = new PongScene();
                    var kEngine = new KinematicEngine();
                    kEngine.bindScene(pongScene);

                    var collisionDetector = new CollisionDetector();
                    collisionDetector.bindComponents(pongScene, kEngine);

                    var collisionReactor = new CollisionReactor();
                    collisionReactor.bindKinEngine(kEngine);

                    this.renderer = new PongRenderer("view", window.innerWidth, window.innerHeight);
                    this.renderer.bindComponents(pongScene, kEngine, collisionDetector, collisionReactor);

                    this.renderer.setCameraControls();
                    this.renderer.makeNormalBox();
                    this.renderer.makeAxis();

                    this.renderer.setCameraPosition(pongScene.wallWidth / 2 + 0.4, 0.4, 0);

                    var monitor = new PongMonitor();
                    monitor.bindKinEngine(kEngine);
                }

                catch (ex if ex instanceof GenericException)
                {
                    console.log("\nLogging from Main.js, catching instanceof GenericException\n");
                    console.log(ex.getMessage());
                }
            },
            
            setAnimateFunction: function(animateFunction)
            {
                this.checkArgs([animateFunction],[Function],'setAnimateFunction');
                
                this.animate = animateFunction;
            },
            
            step: function()
            {
                this.renderer.render();
                this.renderer.update();
            },
            
            loop: function()
            {
                this.animate();
            }
        });
        
        return PongGame;
    });