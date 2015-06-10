var camera, scene, renderer;
var raycaster = new THREE.Raycaster();

var images = {};
var clear  = {};

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
