var camera, scene, renderer;
var raycaster = new THREE.Raycaster();

var images = {};
var clearImages = {};
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
    keySpeed:2,
    count:100,
    webgl:true
};

init();
animate();

function go_fullscreen()
{
	var container = document.getElementById( 'container' );
	container.style.width = window.innerWidth + 'px';
	container.style.height = window.innerHeight + 'px';

	renderer.setSize(window.innerWidth, window.innerHeight);
	var image = document.getElementById("fullscreen-image");
	image.style.visibility = "hidden";

	camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

function detectWebgl () 
{ 
    try 
    { 
        var canvas = document.createElement( 'canvas' ); 
        return !! ( window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ) );
    } 
    catch ( e ) 
    { 
        Config.webgl = false;
        return false; 
    } 
} 

function init()
{
    var container, mesh;

    container = document.getElementById( 'container' );
    scene = new THREE.Scene();

    texture_placeholder = document.createElement( 'canvas' );
    texture_placeholder.width = 128;
    texture_placeholder.height = 128;
    
    renderer = detectWebgl()? new THREE.WebGLRenderer(): new THREE.CanvasRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );

    console.log(Config.webgl);

    container.appendChild( renderer.domElement );
    renderer.setSize( container.offsetWidth, container.offsetHeight );

    camera = new THREE.PerspectiveCamera( 60, container.offsetWidth / container.offsetHeight, 1, 1100 );
    camera.target = new THREE.Vector3( 0, 0, 0 );

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

Config.rotateCamera = function (time,lat)
{
    var duration = Date.now() - time;
    if(duration < 1000)
    {
        if(Config.isUserInteracting==true)
        {
            return;
        }
        Config.lon += 0.2;
        Config.lat = lat - (lat * duration)/1000 ; 
        requestAnimationFrame(function () {Config.rotateCamera(time,lat)}); 
    }
    else
    {
        Config.lon += 0.2;
        Config.lat = 0;
    }
}

function update()
{
    if(Config.isUserInteracting == false && Config.count == 100)
    {
        Config.lon += 0.2;
    }
    else if(Config.isUserInteracting == false)
    {
        Config.count += 1;
        if(Config.count==100)
        {
            Config.rotateCamera(Date.now(),Config.lat);
        }
    }

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
