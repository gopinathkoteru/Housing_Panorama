var camera, scene, renderer;
var raycaster = new THREE.Raycaster();;

var isUserInteracting = false;
var onMouseDownMouseX = 0, onMouseDownMouseY = 0;
var onMouseDownLon = 0;
var onMouseDownLat = 0;
var phi = 0, theta = 0;

var images = {};

var img_name = ['r','l','u','d','f','b'];
var mouse_speed = 0.3;



var pano = function(panoid,is_blur){
    this.panoid = panoid;
    this.name = "panorama";
    this.isBlur = is_blur;
};

var Transition = 
{
    path : "",
    hotspotAngles : [],
    currentPano : 0,
    panoNum : 0,
    moving : false
};

Transition.init = function(path,hotspots_angle)
{
    Transition.path = path;
    Transition.hotspotAngles = hotspots_angle;
    
    var path = path + "1/" + "mobile_";
    Transition.blurPano = new pano(1,true);
    var clearPano1 = new pano(1,false);
    var clearPano2 = new pano(1,false);
    
    Transition.blurPano.createPano(path,0.0);
    clearPano1.createPano(path,1.0);
    clearPano2.createPano(path,0.0);

    Transition.clearPano = [clearPano1,clearPano2];
};

init();
animate();

function init() 
{
    var container, mesh;

    container = document.getElementById( 'container' );

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );
    camera.target = new THREE.Vector3( 0, 0, 0 );

    camera.lon = 0;
    camera.lat = 0;


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
    camera.lon = (camera.lon + 360)%360;
    camera.lat = Math.max( - 35, Math.min( 35,camera.lat ) );
    phi = THREE.Math.degToRad( 90 - camera.lat );
    theta = THREE.Math.degToRad( camera.lon );

    camera.target.x = 500 * Math.sin( phi ) * Math.cos( theta );
    camera.target.y = 500 * Math.cos( phi );
    camera.target.z = 500 * Math.sin( phi ) * Math.sin( theta );

    camera.lookAt( camera.target );

    renderer.render( scene, camera );

}
