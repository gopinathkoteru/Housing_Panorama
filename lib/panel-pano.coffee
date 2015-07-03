root = {}
class Pano
	constructor: (@pano_id,@is_blur) ->
		@name = "panorama"
		@destroy = false

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
	destroy_pano: () ->
		@destroy = true
		root.scene.remove(@mesh)
		i = 0
		while i < 6
			@mesh.material.materials[i].map.dispose()
			@mesh.material.materials[i].dispose()
			i++
		@mesh.geometry.dispose()
		
	load_texture: (path,image_index) ->
		texture = new THREE.Texture root.texture_placeholder
		material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0 ,side:THREE.DoubleSide,blending: THREE.AdditiveBlending ,depthTest: false } )
		pano_id = @pano_id

		image = new Image();
		
		image.onload = ->
			image.onload = null
			texture.image = this
			texture.needsUpdate = true
			
			return

		image.src = path

		return material

	

root.Pano = Pano
module.exports = root



