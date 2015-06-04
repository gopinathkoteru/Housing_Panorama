var camera, scene, renderer;
var raycaster = new THREE.Raycaster();;
var clear_pano = [], blur_pano;
var current_pano;
var pano_num;
var isUserInteracting = false;
var onMouseDownMouseX = 0, onMouseDownMouseY = 0;
var onMouseDownLon = 0;
var onMouseDownLat = 0;
var phi = 0, theta = 0;
var transition = false;
var images = [];

var hotspots_angle = [[[1,109,47]], [[2,52,48], [4,111,98], [0,303,43]], [[3,107,58], [1,230,48]], [[2,293,58], [4,185,45]], [[3,5,41], [1,288,93]]]; 

var img_name = ['r','l','u','d','f','b'];
var mouse_speed = 0.3;

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


    var path = "panos/1/mobile_";
    var clear_pano1 = create_pano(path,1.0);
    var clear_pano2 = create_pano(path,0.0);
    clear_pano = [clear_pano1,clear_pano2];
    blur_pano = create_pano(path,0.0);
    pano_num = 0;

    current_pano = 0;
    preload_images();
    Hotspots(0);

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
    camera.lat = Math.max( - 35, Math.min( 35,camera.lat ) );
    phi = THREE.Math.degToRad( 90 - camera.lat );
    theta = THREE.Math.degToRad( camera.lon );

    camera.target.x = 500 * Math.sin( phi ) * Math.cos( theta );
    camera.target.y = 500 * Math.cos( phi );
    camera.target.z = 500 * Math.sin( phi ) * Math.sin( theta );

    camera.lookAt( camera.target );

    renderer.render( scene, camera );

}
