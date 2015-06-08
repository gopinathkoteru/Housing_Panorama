Transition.removeHotspots = function ()
{

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
};


Transition.preloadImages = function()
{
    for(var i = 0; i < Transition.hotspotAngles[Transition.currentPano].length; i++)
    {
        var source = Transition.hotspotAngles[Transition.currentPano][i][0];
        if(images[source])
        { 
            source = Transition.path + "blur_" + (source + 1) + "/mobile_";  
            var temp = [];
            for(var j = 0; j < 6; j++)
            {
                var image = new Image();
                image.src = source + img_name[j] + ".jpg";
                temp.push(image);
            }

            images[Transition.currentPano] = temp;
        }
    }
}


Transition.loadBlurPano = function(pano_id, hotspot_angle ,dist)
{
    var path = Transition.path+"blur_" + (pano_id + 1) + "/blur_";

    var dfrd = [];
    for(var i = 0; i < 6 ; i++)
        dfrd[i] = $.Deferred();

    for(var i = 0; i < 6; i++)
    {
        Transition.blurPano.mesh.material.materials[i].map.dispose();
        Transition.blurPano.mesh.material.materials[i].map = Transition.blurPano.getTexture(path + img_name[i] + ".jpg", dfrd[i], true, i);
        Transition.blurPano.mesh.material.materials[i].opacity = 0;
    }

    Transition.blurPano.mesh.position.x = dist*Math.cos(THREE.Math.degToRad(hotspot_angle ));
    Transition.blurPano.mesh.position.z = dist*Math.sin(THREE.Math.degToRad(hotspot_angle ));

    return $.when(dfrd[0], dfrd[1], dfrd[2], dfrd[3], dfrd[4], dfrd[5]).done(function(){
    }).promise();
};


Transition.loadClearPano = function( pano_id )
{

    var path = Transition.path + (pano_id + 1) + "/mobile_";

    var dfrd = [];
    for(var i = 0; i < 6; i++)
        dfrd[i] = $.Deferred();

    Transition.clearPano[Transition.panoNum].mesh.visible = true;
    for(var i = 0; i < 6; i++)
    {
        Transition.clearPano[Transition.panoNum].mesh.material.materials[i].map.dispose();
        Transition.clearPano[Transition.panoNum].mesh.material.materials[i].map = Transition.clearPano[Transition.panoNum].getTexture(path + img_name[i] + ".jpg", dfrd[i], false, i);
        Transition.clearPano[Transition.panoNum].mesh.material.materials[i].opacity = 0;
    } 
    return $.when(dfrd[0], dfrd[1], dfrd[2], dfrd[3], dfrd[4], dfrd[5]).done(function(){
    }).promise();

};


Transition.oldpanoToBlurpano = function( pano_id, hotspot_angle,dist,rotate_angle)
{
    var time1 = 0.4;
    var rotate_angle = camera.lon + rotate_angle;

   TweenLite.to(camera, time1, {lon: rotate_angle, lat: 0, ease: Power0.easeOut});
    
    var time = 3;
    var del = 0.2;
    TweenLite.to(Transition.blurPano.mesh.position, time, {x: 0, z: 0, delay:del,ease: Expo.easeOut});

    dist *= -1; 
    
    for(var i = 0; i < 6; i++)
    {
        TweenLite.to(Transition.clearPano[Transition.panoNum].mesh.material.materials[i], time, {opacity: 0,delay:del, ease: Expo.easeOut});
    }

    for(var i = 0; i < 6; i++)
    {
        TweenLite.to(Transition.blurPano.mesh.material.materials[i], time, {opacity: 1, delay:del,ease: Expo.easeOut});
    }

    TweenLite.to(Transition.clearPano[Transition.panoNum].mesh.position, time/2, {x:dist*Math.cos(THREE.Math.degToRad(hotspot_angle )),z:dist*Math.sin(THREE.Math.degToRad(hotspot_angle )),delay:del,ease: Expo.easeOut, onComplete: Transition.checkNewPanoLoad, onCompleteParams: [ pano_id ]});

};


Transition.checkNewPanoLoad = function( pano_id )
{
    Transition.clearPano[Transition.panoNum].mesh.position.x = 0;
    Transition.clearPano[Transition.panoNum].mesh.position.z = 0;
    Transition.clearPano[Transition.panoNum].mesh.visible = false;
    for(var i = 0; i < 6; i++)
    {

        Transition.clearPano[Transition.panoNum].mesh.material.materials[i].opacity = 0;
        Transition.clearPano[Transition.panoNum].mesh.material.materials[i].map.dispose();
        Transition.blurPano.mesh.material.materials[i].opacity = 1;
    }

    Transition.panoNum = (Transition.panoNum + 1)%2;

    Transition.loadClearPano(pano_id).done(function(){

        Transition.blurpanoToNewpano(pano_id);
        Transition.preloadImages();

    });
};

Transition.blurpanoToNewpano = function( pano_id )
{
    var time = 1;
    for(var i = 0; i < 6; i++)
    {
        TweenLite.to(Transition.blurPano.mesh.material.materials[i], time, {opacity: 0, ease: Power0.easeOut});
    }
    for(var i = 0; i < 6; i++)
    {
        if(i == 5)
        {
            hotspot = new Hotspot(pano_id);
            TweenLite.to(Transition.clearPano[Transition.panoNum].mesh.material.materials[i], time, {opacity: 1, ease: Power0.easeOut, onComplete: hotspot.addHotspots.bind(hotspot), onCompleteParams:[ pano_id ]});
        }
        else
        {
            TweenLite.to(Transition.clearPano[Transition.panoNum].mesh.material.materials[i], time, {opacity: 1, ease: Power0.easeOut});
        }
    }
};

Transition.start = function(pano_id,hotspot_angle,dist,rotate_angle)
{
    Transition.removeHotspots();
    Transition.currentPano = pano_id;
    Transition.loadBlurPano(pano_id,hotspot_angle,dist).done(function(){
        Transition.oldpanoToBlurpano(pano_id, hotspot_angle,dist,rotate_angle);

    });

};
