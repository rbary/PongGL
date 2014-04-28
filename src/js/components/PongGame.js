
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
                this.kEngine = null;
                this.collisionDetector = null;
                this.collisionReactor = null;
                this.animate = null;
                this.animateOn = false;
            },
            
            init: function()
            {
                try
                {
                    var pongScene = new PongScene();
                    this.kEngine = new KinematicEngine();
                    this.kEngine.bindScene(pongScene);

                    this.collisionDetector = new CollisionDetector();
                    this.collisionDetector.bindComponents(pongScene, this.kEngine);

                    this.collisionReactor = new CollisionReactor();
                    this.collisionReactor.bindKinEngine(this.kEngine);

                    this.renderer = new PongRenderer("view", window.innerWidth, window.innerHeight);
                    this.renderer.bindScene(pongScene);

                    this.renderer.setCameraControls();
                    this.renderer.makeNormalBox();
                    this.renderer.makeAxis();

                    this.renderer.setCameraPosition(pongScene.wallWidth / 2 + 0.4, 0.4, 0);

                    var monitor = new PongMonitor();
                    monitor.bindPongGame(this);
                }

                catch (ex)
                {
                    if(ex instanceof GenericException)
                    {
                        console.log("\nLogging from Main.js, catching instanceof GenericException\n");
                        console.log(ex.getMessage());
                    }
                    else
                        console.log(ex.message);
                }
            },
            
            setAnimateFunction: function(animateFunction)
            {
                this.checkArgs([animateFunction],[Function],'setAnimateFunction');
                
                this.animate = animateFunction;
            },
            
            updateGL: function()
            {
                this.renderer.update();
            },
            
            step: function()
            {
                this.kEngine.newFrame();
                var collisionTestResultsList = this.collisionDetector.detect();
                this.collisionReactor.computeReactions(collisionTestResultsList);
            },
            
            loop: function()
            {
                this.animateOn = true;
                
                if(this.animate !== null)
                    this.animate();
                else
                    console.log("PongGame.loop: no animation fonction defined");
            },
            
            stopLoop: function()
            {
                this.animateOn = false;
            },
            
            reset: function()
            {
                this.kEngine.reset();
                this.renderer.update();
            }
        });
        
        return PongGame;
    });