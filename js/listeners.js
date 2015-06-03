function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseDown( event ) {

    event.preventDefault();

    isUserInteracting = true;

    onPointerDownPointerX = event.clientX;
    onPointerDownPointerY = event.clientY;

    onPointerDownLon = camera.lon;
    onPointerDownLat = camera.lat;


    var vector = new THREE.Vector3();
    vector.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
    vector.unproject( camera );
    raycaster.set( camera.position, vector.sub( camera.position ).normalize() );


    var intersects = raycaster.intersectObjects( scene.children, true );

    if ( intersects.length > 0  && intersects[0].object.name=="hotspot") {

        var rotate_angle = intersects[0].object.angle - camera.lon;

        while(rotate_angle > 180)
        {
            rotate_angle = rotate_angle - 360;
        }
        while(rotate_angle < -180)
        {
            rotate_angle = rotate_angle + 360;
        }
        rotate_camera(rotate_angle,intersects[0].object.pano_id,intersects[0].object.angle);
    }

}

function onDocumentMouseMove( event ) {

    if ( isUserInteracting === true ) {

        camera.lon = ( onPointerDownPointerX - event.clientX ) * mouse_speed + onPointerDownLon;
        camera.lat = ( event.clientY - onPointerDownPointerY ) * mouse_speed + onPointerDownLat;

    }

}

function onDocumentMouseUp( event ) {

    isUserInteracting = false;

}

var maxspeed = 7;
var current_speed = 2;

function onDocumentKeyDown( event ) {

    if (!event)
        event = window.event;
    var keyPressed = event.keyCode;

    if (keyPressed == 37) //left arrow
    {
        camera.lon -= current_speed;
    }
    else if (keyPressed == 39 ) //right arrow
    {
        camera.lon += current_speed;
    }
    else if (keyPressed == 38) //up arrow
    {
        if(transition==false)
        {
            var num_hotspots = hotspots_angle[current_pano].length;
            var near_angle,near_id;
            var flag = false;
            var temp;

            for(i=0;i<num_hotspots;i++)
            {
                temp = hotspots_angle[current_pano][i][1] - 90;
                var lon = (camera.lon+360) % 360;;
                if(temp < 0 )
                {
                    temp = temp + 360;
                }
                if( ((lon>=45) &&(lon<=315) && (temp<=(lon+45)%360) &&(temp>=(lon-45)%360)) || ((lon<=45) && (temp>=0) && (temp<=lon+45)) || ((lon<=45)&&(temp>=(lon-45)%360) && (temp<=360)) ||  ((lon>=315) && (temp>=(lon-45)) && (temp<=360)) || ((lon>=315)&&(temp>=0) &&(temp<= (lon+45)%360)) )
                {

                    if(flag == false)
                    {
                        near_angle = temp;
                        near_id = i;

                        flag = true;
                    }
                    if(Math.abs( temp-lon) < Math.abs(near_angle-lon))
                    {
                        near_angle = temp;
                        near_id = i;

                        flag = true;

                    }
                }
            }
            if(flag == true)
            {
                var rotate_angle = near_angle - camera.lon;

                while(rotate_angle > 180)
                {
                    rotate_angle = rotate_angle - 360;
                }
                while(rotate_angle < -180)
                {
                    rotate_angle = rotate_angle + 360;
                }

                transition = true;

                rotate_camera(rotate_angle,hotspots_angle[current_pano][near_id][0],near_angle);
            }
        }
    }
    if (isUserInteracting == true) {
        if(current_speed < maxspeed)
            current_speed+=1;
    }
    isUserInteracting = true;
}


function onDocumentKeyUp ( event ) 
{

    isUserInteracting = false;
    current_speed = 2;
}

function onDocumentMouseWheel( event ) {

    if ( event.wheelDeltaY ) {

        camera.fov -= event.wheelDeltaY * 0.05;



    } else if ( event.wheelDelta ) {

        camera.fov -= event.wheelDelta * 0.05;



    } else if ( event.detail ) {

        camera.fov += event.detail * 1.0;

    }

    camera.updateProjectionMatrix();

}

