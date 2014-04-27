
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
        
        Abstract3DObject: '3DObjects/Abstract3DObject',
        AbstractDynamic3DObject: '3DObjects/AbstractDynamic3DObject',
        Ball: '3DObjects/Ball',
        Bat: '3DObjects/Bat',
        NormalBox: '3DObjects/NormalBox',
        Wall: '3DObjects/Wall',
        
        CollisionDetector: 'components/CollisionDetector',
        CollisionReactor: 'components/CollisionReactor',
        CollisionTestResultHolder: 'components/CollisionTestResultHolder',
        GameStateManager: 'components/GameStateManager',
        KinematicEngine: 'components/KinematicEngine',
        PongGame: 'components/PongGame',
        PongRenderer: 'components/PongRenderer',
        PongScene: 'components/PongScene',
        
        PongMonitor: 'debug/PongMonitor',
        
        AbstractChecker: 'defensive/AbstractChecker',
        NullityChecker: 'defensive/NullityChecker',
        TypeChecker: 'defensive/TypeChecker',
        __Base__: 'defensive/__Base__',
        
        GenericException: 'exceptions/GenericException',
        IllegalArgumentException: 'exceptions/IllegalArgumentException',
        LogicErrorException: 'exceptions/LogicErrorException',
        NullPointerException: 'exceptions/NullPointerException',
        RuntimeErrorException: 'exceptions/RuntimeErrorException',
        TypeErrorException: 'exceptions/TypeErrorException',
        
        EnumCollisionType: 'utils/EnumCollisionType',
        EnumRayCastingMode: 'utils/EnumRayCastingMode',
        Geometry: 'utils/Geometry',
        DefaultParameters: 'utils/DefaultParameters'
    },
    shim: { // dependencies with and between external librairies (which are not requirejs modules)
      'OrbitControls': ['Three'],
      'FullScreen' : ['Three'],
      'WindowResize' : ['Three'],
      'KeyboardState' : ['Three'],
      'JSCore': ['JSLoader'],
      'PongGame': ['JSCore']
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
   'JSCore'],
   
    function(PongGame)
    {
        var game;
        
        function animate()
        {
            game.updateGL();
            
            if(game.animateOn)
                game.step();
            
            requestAnimationFrame(animate);
        }
        
        var game = new PongGame();
        game.init();
        game.setAnimateFunction(animate);
        
        game.step();
        animate();
        //game.loop();
    });
