root = require("./init.js")
class root.Pano
	constructor: (@pano_id,@is_blur) ->
		@name = "panorama"

	create_pano: (path,opacity) ->
		materials = []
		i = 0
		while i < 6
			materials.push @load_texture path + root.Config.img_name[i] + ".jpg" , i
			i++ 

		geometry = if root.Config.webgl then new THREE.BoxGeometry( 300, 300, 300, 7, 7, 7 ) else  new THREE.BoxGeometry( 300, 300, 300, 20, 20, 20 )

		@mesh = new THREE.Mesh geometry, new THREE.MeshFaceMaterial materials

		@mesh.scale.x = -1

		i=0
		while i < 6
			@mesh.material.materials[i].transparent = true;
			@mesh.material.materials[i].opacity = opacity
			i++

		root.scene.add @mesh

		return

	load_texture: (path,image_index) ->
		texture = new THREE.Texture root.texture_placeholder
		material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0 ,side:THREE.DoubleSide,blending: THREE.AdditiveBlending ,depthTest: false } )
		pano_id = @pano_id

		image = new Image();
		
		image.onload = ->
			texture.image = this
			texture.needsUpdate = true
			if not root.clear_images[pano_id][image_index]
				   root.clear_images[pano_id][image_index] = image;
			
			return

		image.src = path

		return material

	get_texture: (panoid,path, dfrd, image_index) ->
		flag = false
		texture = new THREE.Texture( root.texture_placeholder )
		pano_id = @pano_id
		if root.clear_images[panoid][image_index]
			flag = true
			texture.image = root.clear_images[panoid][image_index]
			texture.needsUpdate = true
			dfrd.resolve()
			return texture

		if @is_blur is true and root.blur_images[panoid][image_index]
			flag = true
			texture.image = root.blur_images[panoid][image_index]
			texture.needsUpdate = true
			dfrd.resolve()
			return texture

		image = new Image()

		image.onload = ->
			texture.image = this
			texture.needsUpdate = true
			dfrd.resolve()
			return

		image.src = path

		return texture
module.exports = root



