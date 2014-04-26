
requirejs.config({
    paths: {
        Three: '../lib/three.js/Three',
        OrbitControls: '../lib/three.js/OrbitControls',
        FullScreen: '../lib/THREEx/THREEx.FullScreen',
        WindowResize: '../lib/THREEx/THREEx.WindowResize',
        KeyboardState: '../lib/THREEx/THREEx.KeyboardState',
        JSLoader: '../lib/JS.Class/min/loader',
        JSCore: '../lib/JS.Class/min/core',
        DatGui: '../lib/dat.gui/dat.gui',
        PongGame: 'components/PongGame'
        
//        ,
//        Abstract3DObject: '3DObjects/Abstract3DObject',
//        AbstractDynamic3DObjact: '3DObjects/AbstractDynamic3DObjact',
//        Ball: '3DObjects/Ball',
//        Bat: '3DObjects/Bat',
//        NormalBox: '3DObjects/NormalBox',
//        Wall: '3DObjects/Wall',
//        
//        CollisionDetector: 'components/CollisionDetector',
//        CollisionReactor: 'components/CollisionReactor',
//        CollisionTestResultHolder: 'components/CollisionTestResultHolder',
//        GameStateManager: 'components/GameStateManager',
//        KinematicEngine: 'components/KinematicEngine',
//        PongRenderer: 'components/PongRenderer',
//        PongScene: 'components/PongScene',
//        
//        AbstractCkecker: 'defensive/AbstractCkecker',
//        NullityCkecker: 'defensive/NullityCkecker',
//        TypeCkecker: 'defensive/TypeCkecker',
//        __Base__: 'defensive/__Base__',
//        
//        GenericException: 'exceptions/GenericException',
//        IllegalArgumentException: 'exceptions/IllegalArgumentException',
//        LogicErrorException: 'exceptions/LogicErrorException',
//        NullPointerException: 'exceptions/NullPointerException',
//        RuntimeErrorException: 'exceptions/RuntimeErrorException',
//        TypeErrorException: 'exceptions/TypeErrorException',
//        
//        EnumCollisionType: 'utils/EnumCollisionType',
//        EnumRayCastingMode: 'utils/EnumRayCastingMode',
//        TimeGetter: 'utils/TimeGetter'
    },
    shim: {
      'OrbitControls': ['Three'],
      'FullScreen' : ['Three'],
      'WindowResize' : ['Three'],
      'KeyboardState' : ['Three'],
      'JSCore': ['JSLoader']
    }
});

require(
   ['PongGame',
   'Three',
   'OrbitControls',
   'FullScreen',
   'WindowResize',
   'KeyboardState',
   'JSLoader',
   'JSCore',
   'DatGui'],
   
   function(PongGame)
   {
       
       try
       {
           var game = new PongGame();
           game.start();
       }

       catch(ex if ex instanceof GenericException)
       {
           console.log("\nLogging from Main.js, catching instanceof GenericException\n");
           console.log(ex.getMessage());
       }

        catch(ex)
        {
            console.log("\nLogging from Main.js, catching other errors\n");
            console.log(ex.message);
        }
   });
//
//require(
//   ['components/PongScene',
//    'components/PongRenderer',
//    'components/KinematicEngine'],
//
//function(PongScene, PongRenderer, KinematicEngine)
//{
//    var renderer;
//
//    function animate()
//    {
//        requestAnimationFrame(animate);
//        renderer.render();
//        renderer.update();
//    }
//
//    function start()
//    {
//        try
//        {
//            var pongScene = new PongScene();
//            var kEngine = new KinematicEngine();
//            kEngine.bindScene(pongScene);
//
//            renderer = new PongRenderer("view", window.innerWidth, window.innerHeight);
//            renderer.bindComponents(pongScene, kEngine);
//
//            renderer.setCameraControls();
//            renderer.makeNormalBox();
//            renderer.makeAxis();
//
//            renderer.setCameraPosition(pongScene.wallWidth/2+0.4, 0.4, 0);
//
//            animate();
//        }
//
//        catch(ex if ex instanceof GenericException)
//        {
//            console.log("\nLogging from Main.js, catching instanceof GenericException\n");
//            console.log(ex.getMessage());
//        }
//
//    //    catch(ex)
//    //    {
//    //        console.log("\nLogging from Main.js, catching other errors\n");
//    //        console.log(ex.message);
//    //    }
//    };
//    
//    start();
//});
