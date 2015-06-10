var Pano = function( panoid, is_blur ){
    this.panoid = panoid;
    this.name = "panorama";
    this.isBlur = is_blur;
};

Pano.prototype.createPano = function( path, opacity )
{
    var materials = [];
    for(i=0;i<6;i++)
    {
        materials.push(this.loadTexture(path+Config.imgName[i]+".jpg"));
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


Pano.prototype.loadTexture = function( path ) {

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


Pano.prototype.getTexture = function( path, dfrd, is_blur, image_index )
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
