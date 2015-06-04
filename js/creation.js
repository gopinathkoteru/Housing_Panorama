function Hotspots( pano_id )
{
    var num_hotspots = hotspots_angle[pano_id].length;
    for(var i = 0; i < num_hotspots; i++)
    {
        add_Hotspot(hotspots_angle[pano_id][i][0], hotspots_angle[pano_id][i][1], hotspots_angle[pano_id][i][2]);
    }
    transition = false;
}


function add_Hotspot( pano_id, angle, dist )
{
    var geometry = new THREE.BoxGeometry( 2,2,2,1,1,1);
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
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


function create_pano( path, opacity )
{

    var materials = [

        loadTexture(path+"r.jpg"), // right
        loadTexture(path+"l.jpg"), // left
        loadTexture(path+"u.jpg"), // top
        loadTexture(path+"d.jpg"), // bottom
        loadTexture(path+"f.jpg"), // front
        loadTexture(path+"b.jpg")  // back

    ];
    var pano = new THREE.Mesh( new THREE.BoxGeometry( 300, 300, 300, 7, 7, 7 ), new THREE.MeshFaceMaterial( materials ) );
    pano.scale.x = -1;

    for(var i = 0; i < 6; i++)
    {
        pano.material.materials[i].transparent = true;
        pano.material.materials[i].opacity = opacity;
        pano.material.materials[i].blending = THREE.AdditiveBlending;

        pano.material.materials[i].blendSrc = THREE.OneMinusDstColorFactor;
        pano.material.materials[i].blendDst = THREE.DstAlphaFactor;

    }
    pano.name = "panorama";
    scene.add(pano);

    return pano;

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


function preload_images()
{
    for(var i = 0; i < hotspots_angle[current_pano].length; i++)
    {
        var flag = false;
        for(var j = 0; j < images.length; j++)
        {
            if(hotspots_angle[current_pano][i][0] == images[j][0][0])
            {
                flag = true;
                break;
            }
        }
        if(flag == false)
        {   
            var temp = [];
            for(var j = 0; j < 6; j++)
            {
                var temp1 = [];
                temp1[0] = hotspots_angle[current_pano][i][0];
                temp1[1] = new Image();
                temp.push(temp1);
            }

            var source = hotspots_angle[current_pano][i][0] + 1;
            source = "panos/blur_" + source + "/blur_";
            for(var j = 0; j < 6; j++)
            {
                temp[j][1].src = source + img_name[j] + ".jpg";
            }

            images.push(temp);
        }
    }
    console.log("IMAGES: " + images.length);
}


function gettexture( path, dfrd, is_blur, image_index )
{

    var flag = false;
    var texture = new THREE.Texture( texture_placeholder );
    if(is_blur == true)
    {

        for(var i = 0; i < images.length; i++)
        {
            if(current_pano == images[i][image_index][0])
            {
                flag = true;
                image = images[i][image_index][1];
                console.log(images[i]);
                texture.image = image;
                texture.needsUpdate = true;
                dfrd.resolve();
                break;
            }
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
}