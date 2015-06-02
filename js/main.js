var camera, scene, renderer;
var raycaster;
var mesh1,mesh2,mesh3;
raycaster = new THREE.Raycaster();
var current_pano;
var remove;
var cam_pos;
var mesh_num;
var isUserInteracting = false;
var onMouseDownMouseX = 0, onMouseDownMouseY = 0;
var lon = 0, onMouseDownLon = 0;
var lat = 0, onMouseDownLat = 0;
var phi = 0, theta = 0;
var transition = false;

var hotspots_angle = [[[1,109,47]], [[2,52,48], [4,111,98], [0,303,43]], [[3,107,58], [1,230,48]], [[2,293,58], [4,185,45]], [[3,5,41], [1,288,93]]]; 
//var hotspots_angle = [[[1,180,60],[3,270,120]],[[2,220,120],[0,300,60]],[[3,270,60],[1,0,120]],[[0,0,120],[2,90,60]]];
var mouse_speed = 0.3;
init();
animate();

function loadNewmesh(pano_id,dist,angle)
{
    var par = pano_id + 1;
    //var path = "NPanos/blur_"+par+"/mobile_";
    var path = "panos/blur_"+par+"/blur_";
    var dfd = [];
    for(i=0;i<6;i++)
        dfd[i] = $.Deferred();

    mesh2.material.materials[0].map = gettexture(path + "r.jpg", dfd[0]);
    mesh2.material.materials[1].map = gettexture(path + "l.jpg", dfd[1]);
    mesh2.material.materials[2].map = gettexture(path + "u.jpg", dfd[2]);
    mesh2.material.materials[3].map = gettexture(path + "d.jpg", dfd[3]);
    mesh2.material.materials[4].map = gettexture(path + "f.jpg", dfd[4]);
    mesh2.material.materials[5].map = gettexture(path + "b.jpg", dfd[5]);
    dist = 50;

    mesh2.position.x = dist*Math.cos(THREE.Math.degToRad(angle ));
    mesh2.position.z = dist*Math.sin(THREE.Math.degToRad(angle ));

    for(i=0;i<6;i++)
    {
        mesh2.material.materials[i].opacity = 0;
    }

    //curr_speed = 3;
    time = 30;
    //dist = dist+30;
    remove = false;

    return $.when(dfd[0], dfd[1], dfd[2], dfd[3], dfd[4], dfd[5]).done(function(){
        console.log('loadNewmesh is done');
    }).promise();
}


function loadclearmesh(pano_id)
{
    pano_id += 1;

    //  var path = "NPanos/new_"+pano_id+"/mobile_";
    var path = "panos/"+pano_id+"/mobile_";
    var dfd = [];
    for(i=0;i<6;i++)
        dfd[i] = $.Deferred();

    if(mesh_num==1)
    {
        mesh3.material.materials[0].map = gettexture(path+"r.jpg", dfd[0]);
        mesh3.material.materials[1].map = gettexture(path+"l.jpg", dfd[1]);
        mesh3.material.materials[2].map = gettexture(path+"u.jpg", dfd[2]);
        mesh3.material.materials[3].map = gettexture(path+"d.jpg", dfd[3]);
        mesh3.material.materials[4].map = gettexture(path+"f.jpg", dfd[4]);
        mesh3.material.materials[5].map = gettexture(path+"b.jpg", dfd[5]);
        for(i=0;i<6;i++)
        {
            mesh3.material.materials[i].opacity = 0;
        }
    }
    else
    {
        mesh1.material.materials[0].map = gettexture(path+"r.jpg", dfd[0]);
        mesh1.material.materials[1].map = gettexture(path+"l.jpg", dfd[1]);
        mesh1.material.materials[2].map = gettexture(path+"u.jpg", dfd[2]);
        mesh1.material.materials[3].map = gettexture(path+"d.jpg", dfd[3]);
        mesh1.material.materials[4].map = gettexture(path+"f.jpg", dfd[4]);
        mesh1.material.materials[5].map = gettexture(path+"b.jpg", dfd[5]);
        for(i=0;i<6;i++)
        {
            mesh1.material.materials[i].opacity = 0;
        }
    }

    return $.when(dfd[0], dfd[1], dfd[2], dfd[3], dfd[4], dfd[5]).done(function(){
        console.log('loadclearmesh is done');
    }).promise();

}


function updateOpacity(dist,angle,pano_id,count)
{ 
    if(remove==false)
    {

        // dist = 30;
        //  camera.fov -= dist*0.01;
        // camera.updateProjectionMatrix();    

        mesh2.position.x -= (dist/time)*Math.cos(THREE.Math.degToRad(angle ));
        mesh2.position.z -= (dist/time)*Math.sin(THREE.Math.degToRad(angle ));

        // camera.position.x += 0.03*dist*Math.cos(THREE.Math.degToRad(angle ));
        //camera.position.z += 0.03*dist*Math.sin(THREE.Math.degToRad(angle ));
        //camera.updateProjectionMatrix();    


        count = count + 1;
        for(i=0;i<6;i++)
        {
            if(mesh_num==1)
            {
                mesh1.material.materials[i].opacity -= 1/time;
            }
            else
            {
                mesh3.material.materials[i].opacity -= 1/time;
            }
            mesh2.material.materials[i].opacity += 1/time;
        }
    }
    if(remove==true)
    {

        count = count + 1;
        for(i=0;i<6;i++)
        {
            mesh2.material.materials[i].opacity -= 1/time;
            if(mesh_num==1)
            {
                mesh3.material.materials[i].opacity += 1/time;
            }
            else
            {
                mesh1.material.materials[i].opacity += 1/time;
            }
        }
    }
    if(count==time && remove==false)
    {   
        for(i=0;i<6;i++)
        {
            if(mesh_num==1)
            {
                mesh1.material.materials[i].opacity = 0;
                mesh1.material.materials[i].map.dispose();
            }
            else
            {
                mesh3.material.materials[i].opacity = 0;
                mesh3.material.materials[i].map.dispose();
            }
            mesh2.material.materials[i].opacity = 1;
        }
        mesh2.position.x = 0;
        mesh2.position.z = 0;
        // camera.fov = 75;
        // camera.position.x = 0;
        //camera.position.z = 0;
        //camera.updateProjectionMatrix();


        count = 0;
        remove = true;
    }
    if(count==time && remove==true)
    {
        for(i=0;i<6;i++)
        {
            mesh2.material.materials[i].map.dispose();
        }
        for(i=0;i<6;i++)
        {
            if(mesh_num == 1)
            {
                mesh3.material.materials[i].opacity = 1;
            }
            else
            {
                mesh1.material.materials[i].opacity = 1;
            }
        }
        if(mesh_num == 1)
        {
            mesh_num = 3;
        }
        else
        {
            mesh_num = 1;
        }
        Hotspots(pano_id);

        return;
    }
    var function_name = function(){updateOpacity(dist,angle,pano_id,count);}
    requestAnimationFrame(function_name); 
}


function removemesh(pano_id,dist,angle) {
    current_pano = pano_id;
    old_pano = scene.getObjectByName("current_mesh");

    var len = scene.children.length;
    var p=0;
    for ( i = 0; i < len; i ++ ) {
        var object = scene.children[ p];

        if(object.name!=old_pano.name)
        {

            object.geometry.dispose();
            object.material.dispose();
            scene.remove(object);
        }
        else
        {
            p = p + 1;
        }
    }
    $(function(){
        loadNewmesh(pano_id,dist,angle).done(function(){

            loadclearmesh(pano_id).done(function(){
            
                console.log('function2 is done!');
                updateOpacity(dist,angle,pano_id,1);
            });
        });
    });
}


function create_mesh(path,opacity)
{
    var materials = [

        loadTexture(path+"r.jpg"), // right
        loadTexture(path+"l.jpg"), // left
        loadTexture(path+"u.jpg"), // top
        loadTexture(path+"d.jpg"), // bottom
        loadTexture(path+"f.jpg"), // front
        loadTexture(path+"b.jpg")  // back

            ];
    var mesh = new THREE.Mesh( new THREE.BoxGeometry( 300, 300, 300, 7, 7, 7 ), new THREE.MeshFaceMaterial( materials ) );
    mesh.scale.x = -1;

    for(i=0;i<6;i++)
    {
        mesh.material.materials[i].transparent = true;
        mesh.material.materials[i].opacity = opacity;
        mesh.material.materials[i].blending = THREE.AdditiveBlending;
    }
    mesh.name = "current_mesh";
    scene.add(mesh);

    return mesh;

}


function loadTexture( path ) {

    var texture = new THREE.Texture( texture_placeholder );
    var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );

    var image = new Image();
    image.onload = function () {

        texture.image = this;
        texture.needsUpdate = true;

    };
    image.src = path;

    return material;

}


function gettexture(path, dfd)
{
    var texture = new THREE.Texture( texture_placeholder );

    var image = new Image();
    image.onload = function () {

        texture.image = this;
        texture.needsUpdate = true;
        //alert("GOne")
        dfd.resolve();

    };
    image.src = path;

    return texture;
}


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


    var path = "panos/1/mobile_";
    mesh1 = create_mesh(path,1.0);
    mesh2 = create_mesh(path,0.0);
    mesh3 = create_mesh(path,0.0);
    mesh_num = 1;

    current_pano = 0;
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

    document.addEventListener( 'keydown', onDocumentKeyDown, false );
    document.addEventListener( 'keyup', onDocumentKeyUp, false );

    document.addEventListener( 'dragover', function ( event ) {

        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';

    }, false );

    document.addEventListener( 'dragenter', function ( event ) {

        document.body.style.opacity = 0.5;

    }, false );

    document.addEventListener( 'dragleave', function ( event ) {

        document.body.style.opacity = 1;

    }, false );

    document.addEventListener( 'drop', function ( event ) {

        event.preventDefault();

        var reader = new FileReader();
        reader.addEventListener( 'load', function ( event ) {

            material.map.image.src = event.target.result;
            material.map.needsUpdate = true;

        }, false );
        reader.readAsDataURL( event.dataTransfer.files[ 0 ] );

        document.body.style.opacity = 1;

    }, false );


    window.addEventListener( 'resize', onWindowResize, false );

}


function Hotspots(pano_id)
{
    var total = hotspots_angle[pano_id].length;
    for(i=0;i<total;i++)
    {
        add_Hotspot(hotspots_angle[pano_id][i][0],hotspots_angle[pano_id][i][1],hotspots_angle[pano_id][i][2]);
    }
    transition = false;
}


function add_Hotspot(pano_id,angle,dist)
{
    var geometry = new THREE.BoxGeometry( 2,2,2,1,1,1);
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    var cube = new THREE.Mesh( geometry, material );

    angle = angle - 90;
    rad_angle = THREE.Math.degToRad( angle );
    cube.position.x = dist*Math.cos(rad_angle);
    cube.position.y = -10;
    cube.position.z = dist*Math.sin(rad_angle);
    cube.pano_id = pano_id;
    cube.dist = dist;
    cube.angle = angle;
    cube.name = "current_hotspot";
    scene.add( cube );

}


function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}


function move_camera_lat (pano_id,dist,hotspot_angle) {

    lat = lat - cam_pos*2;
    if(Math.abs(lat) <  2)
    {
        removemesh(pano_id,dist,hotspot_angle);
        return;
    }
    var function_name = function(){move_camera_lat(pano_id,dist,hotspot_angle);}
    requestAnimationFrame(function_name); 
}
function move_camera(angle,pano_id,dist,hotspot_angle)
{
    if(cam_pos*angle<=0)
    {
        cam_pos = 1;
        if(lat < 0)
        {
            cam_pos = -1;
        }
        if(lat==0)
        {
            cam_pos = 0;
        }
        move_camera_lat(pano_id,dist,hotspot_angle);    
        return;
    }

    lon = (lon + cam_pos*2 + 360)%360;
    angle = angle - cam_pos*2;

    var function_name = function(){move_camera(angle,pano_id,dist,hotspot_angle);}
    requestAnimationFrame(function_name, 50); 
}


function onDocumentMouseDown( event ) {

    event.preventDefault();

    isUserInteracting = true;

    onPointerDownPointerX = event.clientX;
    onPointerDownPointerY = event.clientY;

    onPointerDownLon = lon;
    onPointerDownLat = lat;


    var vector = new THREE.Vector3();
    vector.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
    vector.unproject( camera );
    raycaster.set( camera.position, vector.sub( camera.position ).normalize() );


    var intersects = raycaster.intersectObjects( scene.children, true );

    if ( intersects.length > 0  && intersects[0].object.name=="current_hotspot") {

        var angle = intersects[0].object.angle - lon;
        if(angle > 180)
        {
            angle = angle - 360;
        }
        if(angle < -180)
        {
            angle = angle + 360;
        }
        if(angle > 0)
        {
            cam_pos = 1;
        }
        else
        {
            cam_pos = -1;
        }
        move_camera(angle,intersects[0].object.pano_id,intersects[0].object.dist,intersects[0].object.angle);
    }

}


function onDocumentMouseMove( event ) {

    if ( isUserInteracting === true ) {

        lon = ( onPointerDownPointerX - event.clientX ) * mouse_speed + onPointerDownLon;
        lon = (lon + 360)% 360;
        lat = ( event.clientY - onPointerDownPointerY ) * mouse_speed + onPointerDownLat;

    }

}


function onDocumentMouseUp( event ) {

    isUserInteracting = false;

}


var maxspeed = 7;
var current_speed = 2;
var done = false;


function onDocumentKeyDown( event ) {

    if (!event)
        event = window.event;
    var code = event.keyCode;

    if (code == 37)
    {
        lon-=current_speed;
        lon = (lon+360) % 360;
    }
    else if ( code ==39 )
    {
        lon += current_speed;
        lon = (lon+360) % 360;
    }
    else if (code == 38)
    {
        if(done == false && transition==false)
        {
            var total = hotspots_angle[current_pano].length;
            var near_angle,near_id;
            var flag = false;
            var temp;

            for(i=0;i<total;i++)
            {
                temp = hotspots_angle[current_pano][i][1] - 90;
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
                var angle = near_angle - lon;
                if(angle > 180)
                {
                    angle = angle - 360;
                }
                if(angle < -180)
                {
                    angle = angle + 360;
                }
                if(angle > 0)
                {
                    cam_pos = 1;
                }
                else
                {
                    cam_pos = -1;
                }
                transition = true;
                move_camera(angle,hotspots_angle[current_pano][near_id][0], hotspots_angle[current_pano][near_id][2], near_angle);
            }
            done = true;
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
    done = false;
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


function animate() {

    requestAnimationFrame( animate );
    update();

}


function update() {
    lat = Math.max( - 35, Math.min( 35, lat ) );
    phi = THREE.Math.degToRad( 90 - lat );
    theta = THREE.Math.degToRad( lon );

    camera.target.x = 500 * Math.sin( phi ) * Math.cos( theta );
    camera.target.y = 500 * Math.cos( phi );
    camera.target.z = 500 * Math.sin( phi ) * Math.sin( theta );

    camera.lookAt( camera.target );

    renderer.render( scene, camera );

}
