function onWindowResize()
{

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}


function touchHandler(event)
{
    var touches = event.changedTouches,
        first = touches[0],
        type = "";
    switch(event.type)
    {
        case "touchstart": type = "mousedown"; break;
        case "touchmove":  type = "mousemove"; break;
        case "touchend":   type = "mouseup";   break;
        default:           return;
    }


    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1, first.screenX, first.screenY, first.clientX, first.clientY, false, false, false, false, 0/*left*/, null);

    first.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}


function onDocumentMouseDown( event )
{

    event.preventDefault();

    Config.isUserInteracting = true;

    onPointerDownPointerX = event.clientX;
    onPointerDownPointerY = event.clientY;

    onPointerDownLon = Config.lon;
    onPointerDownLat = Config.lat;


    var vector = new THREE.Vector3();
    vector.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
    vector.unproject( camera );
    raycaster.set( camera.position, vector.sub( camera.position ).normalize() );


    var intersects = raycaster.intersectObjects( scene.children, true );

    if ( intersects.length > 0  && intersects[0].object.name == "hotspot")
    {
        Transition.start(intersects[0].object.hotspotId);
    }

}


function onDocumentMouseMove( event )
{

    if ( Config.isUserInteracting === true )
    {

        Config.lon = ( onPointerDownPointerX - event.clientX ) * Config.mouseSpeed + onPointerDownLon;
        Config.lat = ( event.clientY - onPointerDownPointerY ) * Config.mouseSpeed + onPointerDownLat;

    }

}


function onDocumentMouseUp( event )
{

    Config.isUserInteracting = false;

}

function onDocumentKeyDown( event )
{

    if (!event)
        event = window.event;
    var keyPressed = event.keyCode;

    if (keyPressed == 37) //left arrow
    {
        Config.lon -= Config.keySpeed;
    }
    else if (keyPressed == 39 ) //right arrow
    {
        Config.lon += Config.keySpeed;
    }
    else if (keyPressed == 38) //up arrow
    {
        if(Transition.moving==false)
        {
           var near_id = Hotspot.findNearestHotspot();
            if(near_id != -1)
            {
                Transition.start(near_id);
            }
        }
    }
    if (Config.isUserInteracting == true)
    {
        if(Config.keySpeed < Config.keyMax)
            Config.keySpeed += 1;
    }
    Config.isUserInteracting = true;
}


function onDocumentKeyUp ( event ) 
{

    Config.isUserInteracting = false;
    Config.keySpeed = 2;
}


function onDocumentMouseWheel( event )
{

    if ( event.wheelDeltaY )
    {
        camera.fov -= event.wheelDeltaY * 0.05;
    }
    else if ( event.wheelDelta )
    {
        camera.fov -= event.wheelDelta * 0.05;
    }
    else if ( event.detail )
    {
        camera.fov += event.detail * 1.0;
    }

    camera.fov = Math.max(60,Math.min(90,camera.fov));
    camera.updateProjectionMatrix();

}