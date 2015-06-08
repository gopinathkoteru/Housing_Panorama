function Hotspot(panoid)
{
    this.panoid = panoid;
}


Hotspot.prototype.addHotspot =  function ( panoid, angle, dist )
{

    var geometry = new THREE.BoxGeometry( 2, 2, 2, 1, 1, 1);
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    var hotspot = new THREE.Mesh( geometry, material );

    angle = angle - 90;
    rad_angle = THREE.Math.degToRad( angle );

    hotspot.position.x = dist*Math.cos(rad_angle);
    hotspot.position.y = -10;
    hotspot.position.z = dist*Math.sin(rad_angle);
    hotspot.panoid = panoid;
    hotspot.dist = dist;
    hotspot.angle = angle;
    hotspot.name = "hotspot";
    scene.add( hotspot );

};


Hotspot.prototype.addHotspots = function ()
{

    var num_hotspots = Transition.hotspotAngles[this.panoid].length;
    for(var i = 0; i < num_hotspots; i++)
    {
        this.addHotspot(Transition.hotspotAngles[this.panoid][i][0], Transition.hotspotAngles[this.panoid][i][1], Transition.hotspotAngles[this.panoid][i][2]);
    }
    Transition.moving = false;

};


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
