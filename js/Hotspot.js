var Hotspot = {
    panoid : 0,
    hotspotAngles : []
};

Hotspot.init = function(hotspots_angle)
{
    Hotspot.hotspotAngles = hotspots_angle;
}

Hotspot.addHotspot =  function (angle, dist,hotspotId )
{

    var geometry = new THREE.BoxGeometry( 2, 2, 2, 1, 1, 1);
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    var hotspot = new THREE.Mesh( geometry, material );

    angle = angle - 90;
    rad_angle = THREE.Math.degToRad( angle );

    hotspot.position.x = dist*Math.cos(rad_angle);
    hotspot.position.y = -10;
    hotspot.position.z = dist*Math.sin(rad_angle);

    hotspot.hotspotId = hotspotId
        hotspot.name = "hotspot";
    scene.add( hotspot );

};


Hotspot.addHotspots = function (panoid)
{
    Hotspot.panoid = panoid;
    var num_hotspots = Hotspot.hotspotAngles[panoid].length;
    for(var i = 0; i < num_hotspots; i++)
    {
        Hotspot.addHotspot(Hotspot.hotspotAngles[panoid][i][1], Hotspot.hotspotAngles[panoid][i][2],i);
    }
    Transition.moving = false;

};

Hotspot.removeHotspots = function ()
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

Hotspot.findNearestHotspot = function ()
{
    var num_hotspots = Hotspot.hotspotAngles[Transition.currentPano].length;
    var near_angle,near_id=-1;
    var flag = false;
    var temp;

    for(var i = 0; i < num_hotspots; i++)
    {
        console.log(Hotspot.hotspotAngles[Transition.currentPano][i][1]);
        temp = Hotspot.hotspotAngles[Transition.currentPano][i][1] - 90;

        var lon = (Config.lon+360) % 360;
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
    return near_id;
    
};
