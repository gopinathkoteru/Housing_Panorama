function rotate_camera( angle, pano_id, hotspot_angle )
{
    var time = 0.5;
    var rotate_angle = camera.lon + angle;
    TweenLite.to(camera, time, {lon: rotate_angle, lat: 0, ease: Power1.easeOut, onComplete: remove_hotspots, onCompleteParams: [ pano_id, hotspot_angle ]});
}


function remove_hotspots( pano_id, angle )
{
    current_pano = pano_id;

    var len = scene.children.length;
    var p = 0;
    for (var i = 0; i < len; i ++ )
    {
        var object = scene.children[ p ];

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

    load_blurpano(pano_id,angle).done(function(){

        oldpano_to_blurpano(pano_id, angle);

    });
}


function load_blurpano( pano_id, angle )
{
    var path = "panos/blur_" + (pano_id + 1) + "/blur_";

    var dfrd = [];
    for(var i = 0; i < 6 ; i++)
        dfrd[i] = $.Deferred();

    for(var i = 0; i < 6; i++)
    {
        blur_pano.material.materials[i].map.dispose();
        blur_pano.material.materials[i].map = gettexture(path + img_name[i] + ".jpg", dfrd[i], true, i);
        blur_pano.material.materials[i].opacity = 0;
    }

    var dist = 50;

    blur_pano.position.x = dist*Math.cos(THREE.Math.degToRad(angle ));
    blur_pano.position.z = dist*Math.sin(THREE.Math.degToRad(angle ));

    return $.when(dfrd[0], dfrd[1], dfrd[2], dfrd[3], dfrd[4], dfrd[5]).done(function(){
        console.log('loadNewmesh is done');
    }).promise();
}


function load_clearpano( pano_id )
{

    var path = "panos/" + (pano_id + 1) + "/mobile_";

    var dfrd = [];
    for(var i = 0; i < 6; i++)
        dfrd[i] = $.Deferred();

    clear_pano[pano_num].visible = true;
    for(var i = 0; i < 6; i++)
    {
        clear_pano[pano_num].material.materials[i].map.dispose();
        clear_pano[pano_num].material.materials[i].map = gettexture(path + img_name[i] + ".jpg", dfrd[i], false, i);
        clear_pano[pano_num].material.materials[i].opacity = 0;
    } 
    return $.when(dfrd[0], dfrd[1], dfrd[2], dfrd[3], dfrd[4], dfrd[5]).done(function(){
    }).promise();

}


function oldpano_to_blurpano( pano_id, angle )
{
    var time = 2;
    TweenLite.to(blur_pano.position, time, {x: 0, z: 0, ease: Expo.easeOut, onComplete: check_newpanoload, onCompleteParams: [ pano_id ]});
    var dist = -10;
    //TweenLite.to(clear_pano[pano_num].position, time, {x:dist*Math.cos(THREE.Math.degToRad(angle )),z:dist*Math.sin(THREE.Math.degToRad(angle )),ease: Expo.easeOut});
    for(var i = 0; i < 6; i++)
    {
        TweenLite.to(clear_pano[pano_num].material.materials[i], time, {opacity: 0, ease: Expo.easeOut});
    }

    for(var i = 0; i < 6; i++)
    {
        TweenLite.to(blur_pano.material.materials[i], time, {opacity: 1, ease: Expo.easeOut});
    }

}


function check_newpanoload( pano_id )
{
    clear_pano[pano_num].position.x = 0;
    clear_pano[pano_num].position.z = 0;
    clear_pano[pano_num].visible = false;
    for(var i = 0; i < 6; i++)
    {

        clear_pano[pano_num].material.materials[i].opacity = 0;
        clear_pano[pano_num].material.materials[i].map.dispose();
        blur_pano.material.materials[i].opacity = 1;
    }

    pano_num = (pano_num + 1)%2;

    load_clearpano(pano_id).done(function(){

        blurpano_to_newpano(pano_id);
        preload_images();

    });
}


function blurpano_to_newpano( pano_id )
{
    var time = 0.5;
    for(var i = 0; i < 6; i++)
    {
        TweenLite.to(blur_pano.material.materials[i], time, {opacity: 0, ease: Expo.easeOut});
    }

    for(var i = 0; i < 6; i++)
    {
        if(i == 5)
        {
            TweenLite.to(clear_pano[pano_num].material.materials[i], time, {opacity: 1, ease: Expo.easeOut, onComplete: Hotspots, onCompleteParams:[ pano_id ]});
        }
        else
        {
            TweenLite.to(clear_pano[pano_num].material.materials[i], time, {opacity: 1, ease: Expo.easeOut});
        }
    }
}