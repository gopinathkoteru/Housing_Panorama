function Hotspots(pano_id)
{
    var num_hotspots = hotspots_angle[pano_id].length;
    for(i=0;i<num_hotspots;i++)
    {
        add_Hotspot(hotspots_angle[pano_id][i][0],hotspots_angle[pano_id][i][1],hotspots_angle[pano_id][i][2]);
    }
    transition = false;
}


function add_Hotspot(pano_id,angle,dist)
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

function create_pano(path,opacity)
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

    for(i=0;i<6;i++)
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


function gettexture(path, dfd)
{
    var texture = new THREE.Texture( texture_placeholder );

    var image = new Image();
    image.onload = function () {

        texture.image = this;
        texture.needsUpdate = true;
        dfd.resolve();

    };
    image.src = path;

    return texture;
}

