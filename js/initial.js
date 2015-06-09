var camera, scene, renderer;
var raycaster = new THREE.Raycaster();

var images = {};

var Config = 
{
    imgName :['r','l','u','d','f','b'],
    mouseSpeed : 0.3,
    isUserInteracting :false,
    phi : 0, 
    theta : 0,
    lon :0,
    lat :0,
    keyMax : 7,
    keySpeed:2
};

var Pano = function( panoid, is_blur ){
    this.panoid = panoid;
    this.name = "panorama";
    this.isBlur = is_blur;
};

var Hotspot = {
    panoid : 0,
    hotspotAngles : []
};

var Transition = 
{
    path : "",
    currentPano : 0,
    panoNum : 0,
    moving : false
};

Transition.init = function( path)
{
    Transition.path = path;
    
    var path = path + "1/" + "mobile_";
    Transition.blurPano = new Pano(1,true);
    var clearPano1 = new Pano(1,false);
    var clearPano2 = new Pano(1,false);
    
    Transition.blurPano.createPano(path,0.0);
    clearPano1.createPano(path,1.0);
    clearPano2.createPano(path,0.0);

    Transition.clearPano = [clearPano1,clearPano2];

    Transition.preloadImages();  
};

Hotspot.init = function(hotspots_angle)
{
    Hotspot.hotspotAngles = hotspots_angle;
}

init();
animate();

function init() 
{
    var container, mesh;

    container = document.getElementById( 'container' );

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );
    camera.target = new THREE.Vector3( 0, 0, 0 );

    scene = new THREE.Scene();

    texture_placeholder = document.createElement( 'canvas' );
    texture_placeholder.width = 128;
    texture_placeholder.height = 128;
    
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'mouseup', onDocumentMouseUp, false );
    document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );
    document.addEventListener( 'DOMMouseScroll', onDocumentMouseWheel, false);

    document.addEventListener( 'touchstart', touchHandler, false );
    document.addEventListener( 'touchmove', touchHandler, false );
    document.addEventListener( 'touchend', touchHandler, false );

    document.addEventListener( 'keydown', onDocumentKeyDown, false );
    document.addEventListener( 'keyup', onDocumentKeyUp, false );

    window.addEventListener( 'resize', onWindowResize, false );

}


function animate()
{

    requestAnimationFrame( animate );
    update();

}


function update()
{
    Config.lon = (Config.lon + 360)%360;
    Config.lat = Math.max( - 35, Math.min( 35,Config.lat ) );
    Config.phi = THREE.Math.degToRad( 90 - Config.lat );
    Config.theta = THREE.Math.degToRad( Config.lon );

    camera.target.x = 500 * Math.sin( Config.phi ) * Math.cos( Config.theta );
    camera.target.y = 500 * Math.cos( Config.phi );
    camera.target.z = 500 * Math.sin( Config.phi ) * Math.sin( Config.theta );

    camera.lookAt( camera.target );

    renderer.render( scene, camera );

}
