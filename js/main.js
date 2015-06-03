function rotate_camera(angle,pano_id,hotspot_angle)
{
    var function_name = function(){removemesh(pano_id,hotspot_angle);};
    var time = 0.5;
    var rotate_angle = camera.lon + angle;
    TweenLite.to(camera, time, {lon: rotate_angle, lat:0, ease: Power1.easeOut, onComplete:function_name}); 
}

function removemesh(pano_id,angle) {
    current_pano = pano_id;

    var len = scene.children.length;
    var p=0;
    for ( i = 0; i < len; i ++ ) {
        var object = scene.children[ p];

        if(object.name=="hotspot")
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

    loadblurpano(pano_id,angle).done(function(){

        updateOpacity(pano_id,angle);

    });
}


function loadblurpano(pano_id,angle)
{
    var par = pano_id + 1;
    var path = "panos/blur_"+par+"/blur_";

    var dfd = [];
    for(i=0;i<6;i++)
        dfd[i] = $.Deferred();

    for(i=0;i<6;i++)
    {
        blur_pano.material.materials[i].map.dispose();
        blur_pano.material.materials[i].map = gettexture(path + img_name[i]+".jpg", dfd[i]);
        blur_pano.material.materials[i].opacity = 0;
    }

    var dist = 50;

    blur_pano.position.x = dist*Math.cos(THREE.Math.degToRad(angle ));
    blur_pano.position.z = dist*Math.sin(THREE.Math.degToRad(angle ));

    return $.when(dfd[0], dfd[1], dfd[2], dfd[3], dfd[4], dfd[5]).done(function(){
        console.log('loadNewmesh is done');
    }).promise();
}


function loadclearpano(pano_id)
{
    pano_id += 1;

    var path = "panos/"+pano_id+"/mobile_";

    var dfd = [];
    for(i=0;i<6;i++)
        dfd[i] = $.Deferred();

    clear_pano[pano_num].visible = true;
    for(i=0;i<6;i++)
    {
        clear_pano[pano_num].material.materials[i].map.dispose();
        clear_pano[pano_num].material.materials[i].map = gettexture(path + img_name[i]+".jpg", dfd[i]);
        clear_pano[pano_num].material.materials[i].opacity = 0;
    } 
    return $.when(dfd[0], dfd[1], dfd[2], dfd[3], dfd[4], dfd[5]).done(function(){
    }).promise();

}

function updateOpacity(pano_id,angle)
{
    var time=3;
    var function_name = function(){updateOpacity1(pano_id)};
    TweenLite.to(blur_pano.position, time, {x:0,z:0,ease: Expo.easeOut,onComplete:function_name});
    var dist = -10;
    //TweenLite.to(clear_pano[pano_num].position, time, {x:dist*Math.cos(THREE.Math.degToRad(angle )),z:dist*Math.sin(THREE.Math.degToRad(angle )),ease: Expo.easeOut});
    for(i=0;i<6;i++)
    {
        TweenLite.to(clear_pano[pano_num].material.materials[i], time, {opacity:0,ease: Expo.easeOut});
    }

    for(i=0;i<6;i++)
    {
        TweenLite.to(blur_pano.material.materials[i], time, {opacity:1,ease: Expo.easeOut});
    }

}

function updateOpacity1(pano_id)
{
    clear_pano[pano_num].position.x = 0;
    clear_pano[pano_num].position.z = 0;
    clear_pano[pano_num].visible = false;
    for(i=0;i<6;i++)
    {

        clear_pano[pano_num].material.materials[i].opacity = 0;
        clear_pano[pano_num].material.materials[i].map.dispose();
        blur_pano.material.materials[i].opacity = 1;
    }

    pano_num = (pano_num + 1)%2;

    loadclearpano(pano_id).done(function(){

        updateOpacity2(pano_id);

    });
}

function updateOpacity2(pano_id)
{
    var time = 0.5;
    for(i=0;i<6;i++)
    {
        TweenLite.to(blur_pano.material.materials[i], time, {opacity:0,ease: Expo.easeOut});
    }
    var function_name = function(){Hotspots(pano_id);};
    for(i=0;i<6;i++)
    {
        if(i==5)
        {
            TweenLite.to(clear_pano[pano_num].material.materials[i], time, {opacity:1,ease: Expo.easeOut,onComplete:function_name});
        }
        else
        {
            TweenLite.to(clear_pano[pano_num].material.materials[i], time, {opacity:1,ease: Expo.easeOut});
        }
    }
}
