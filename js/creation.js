function Hotspots( pano_id )
{
    var num_hotspots = Transition.hotspotAngles[pano_id].length;
    for(var i = 0; i < num_hotspots; i++)
    {
        add_Hotspot(Transition.hotspotAngles[pano_id][i][0], Transition.hotspotAngles[pano_id][i][1], Transition.hotspotAngles[pano_id][i][2]);
    }
    Transition.moving = false;
}


function add_Hotspot( pano_id, angle, dist )
{
    var geometry = new THREE.BoxGeometry( 2,2,2,1,1,1);
    var material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
    var hotspot = new THREE.Mesh( geometry, material );

    angle = angle - 90;
    rad_angle = THREE.Math.degToRad( angle );

    hotspot.position.x = dist*Math.cos(rad_angle);
    hotspot.position.y = -10;
    hotspot.position.z = dist*Math.sin(rad_angle);
    hotspot.pano_id = pano_id;
    hotspot.dist = dist;
    hotspot.angle = angle;
    hotspot.name = "hotspot";
    scene.add( hotspot );

}


pano.prototype.createPano = function( path, opacity )
{
    var materials = [];
    for(i=0;i<6;i++)
    {
        materials.push(this.loadTexture(path+img_name[i]+".jpg"));
    }
    this.mesh = new THREE.Mesh( new THREE.BoxGeometry( 300, 300, 300, 7, 7, 7 ), new THREE.MeshFaceMaterial( materials ) );
    this.mesh.scale.x = -1;

    for(var i = 0; i < 6; i++)
    {
        this.mesh.material.materials[i].transparent = true;
        this.mesh.material.materials[i].opacity = opacity;
    }
    this.name = "panorama";
    scene.add(this.mesh);
};


pano.prototype.loadTexture = function( path ) {

    var texture = new THREE.Texture( texture_placeholder );
    var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 ,side:THREE.DoubleSide,blending: THREE.AdditiveBlending ,depthTest: false } );

    var image = new Image();
    image.onload = function () {

        texture.image = this;
        texture.needsUpdate = true;

    };
    image.src = path;

    return material;

};


function preload_images()
{
    for(var i = 0; i < Transition.hotspotAngles[Transition.currentPano].length; i++)
    {
        var source = Transition.hotspotAngles[Transition.currentPano][i][0];
        if(images[source])
        { 
            source  = source + 1;
            source = "panos1/blur_" + source + "/mobile_";  
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


pano.prototype.getTexture = function( path, dfrd, is_blur, image_index )
{
    var flag = false;
    var texture = new THREE.Texture( texture_placeholder );
    if(is_blur == true)
    {
        if(images[Transition.currentPano])
        {
                flag = true;
                var image = images[Transition.currentPano][image_index];
                texture.image = image;
                texture.needsUpdate = true;
                dfrd.resolve();
        }
    }
    if(flag == false || is_blur == false)
    {
        var image = new Image();
        image.onload = function () {

            texture.image = this;
            texture.needsUpdate = true;
            dfrd.resolve();

        };
        image.src = path;
    }

    return texture;
};
