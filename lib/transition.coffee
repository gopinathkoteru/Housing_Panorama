root = require("./annotation.js")
class transition
	constructor:(pano, hotspot_angles) ->
		@pano =  pano
		@current_pano = 0
		@moving = false
		@hotspot_angles = hotspot_angles
		@destroy = false 
		
		root.clear_images = {}
		root.blur_images = {}
	
		root.clear_images[@current_pano] = []

		path = @pano[@current_pano][1] + "mobile_"

		@blur_pano = new root.Pano(0,true)
		@clear_pano = new root.Pano(0, false)

		@blur_pano.create_pano( path, 0.0)
		@clear_pano.create_pano(path, 1.0)

		@preload_images()

		return

	save_clear_images: ->
		current_pano = @current_pano
		pano = @pano
		if not root.clear_images[current_pano]
			path = pano[current_pano][1] + "mobile_"
			root.clear_images[current_pano] = []	
			i = 0
			while i < 6
				do ->
					texture = new THREE.Texture( root.texture_placeholder )
					image_index = i
				
					image = new Image()
					image.onload = ->
						image.onload = null
						texture.image = this
						texture.needsUpdate = true
						root.clear_images[current_pano][image_index] = image
						return

					image.src = path + root.Config.img_name[i] + ".jpg"
					return
				i++
		return

	preload_images:->
		i = 0
		current_pano = @current_pano
		hotspot_angles = @hotspot_angles
		pano = @pano
		while i < hotspot_angles[current_pano].length
			do ->
				pano_id = hotspot_angles[current_pano][i][0]

				if not root.blur_images[pano_id]
					root.blur_images[pano_id] = []
					fpath = pano[pano_id][1] + "../blur_" + (pano_id + 1) + "/mobile_"
					j = 0
					while j < 6
						do ->
							texture = new THREE.Texture( root.texture_placeholder )
							image_index = j

							image = new Image()
							image.onload = ->
								image.onload = null
								texture.image = this
								texture.needsUpdate = true
								root.blur_images[pano_id][image_index] = image
								return
							image.src = fpath + root.Config.img_name[j] + ".jpg"
							return
						j++
				return
			i++
		return

	

	start : (hotspot_id) ->
		current_pano = @current_pano
		pano_id = @hotspot_angles[current_pano][hotspot_id][0]
		hotspot_angle = @hotspot_angles[current_pano][hotspot_id][1]
		error = @hotspot_angles[current_pano][hotspot_id][2]

		@moving = true
		@current_pano = pano_id
		@save_clear_images()

		rotate_angle = @find_rotation_angle(hotspot_angle)

		root.Hotspot.remove_hotspots()
		root.Annotation.remove_annotations()
		
		old_pano_to_blur_pano = @old_pano_to_blur_pano.bind(this)
		@preload_images()
		@load_blur_pano(error,hotspot_angle).done ->
			old_pano_to_blur_pano(error,hotspot_angle,rotate_angle)
			return
	
		return
		
	find_rotation_angle : (hotspot_angle)->
		
		rotate_angle = hotspot_angle - root.Config.lon

		while rotate_angle > 180
			rotate_angle = rotate_angle - 360

		while rotate_angle < -180
			rotate_angle = rotate_angle + 360

		if rotate_angle > 50
			rotate_angle = (rotate_angle - 180) % 360
		else if rotate_angle < -50
			rotate_angle = (rotate_angle + 180) % 360

		rotate_angle = rotate_angle + root.Config.lon
		return rotate_angle

	load_blur_pano : (error,hotspot_angle)->
		if @destroy
			return $.when().done(->).promise()
		path = @pano[@current_pano][1] + "../blur_" + (@current_pano + 1) + "/mobile_"
		dfrd = []
		dist = 60
		i = 0
		while i < 6
			dfrd[i] = $.Deferred()
			i++

		@blur_pano.pano_id = @current_pano
		i = 0
		while i < 6
			@blur_pano.mesh.material.materials[i].map.dispose()
			@blur_pano.mesh.material.materials[i].map = @blur_pano.get_texture(@pano_id,path + root.Config.img_name[i] + ".jpg", dfrd[i], i)
			@blur_pano.mesh.material.materials[i].opacity = 0
			i++
		
		@blur_pano.mesh.rotation.y = THREE.Math.degToRad(error)	
		@blur_pano.mesh.position.x = dist*Math.cos(THREE.Math.degToRad(hotspot_angle ))
		@blur_pano.mesh.position.z = dist*Math.sin(THREE.Math.degToRad(hotspot_angle ))

		$.when.apply($, dfrd).done(->).promise()

	load_clear_pano :(error) ->
		if @destroy
			return $.when().done(->).promise()
		path = @pano[@current_pano][1] + "mobile_"
		dfrd = []
		i = 0
		while i < 6
			dfrd[i] = $.Deferred()
			i++
		@clear_pano.pano_id = @current_pano
		@clear_pano.mesh.rotation.y = THREE.Math.degToRad(error)
		i = 0
		while i < 6
			@clear_pano.mesh.material.materials[i].map.dispose()
			@clear_pano.mesh.material.materials[i].map = @clear_pano.get_texture(@pano_id,path + root.Config.img_name[i] + ".jpg", dfrd[i], i)
			@clear_pano.mesh.material.materials[i].opacity = 0
			i++

		$.when.apply($, dfrd).done(->).promise()

	old_pano_to_blur_pano :(error,hotspot_angle,rotate_angle) ->
		if @destroy
			return
		time1 = 0.4
		TweenLite.to(root.Config, time1, {lon: rotate_angle, lat: 0, ease: Power0.easeOut})

		time = 2
		del = 0.3
		blur_pano = @blur_pano
		clear_pano = @clear_pano

		TweenLite.to(blur_pano.mesh.position, time, {x: 0, z: 0, delay:del,ease: Expo.easeOut})

		i = 0
		while i < 6
			TweenLite.to(clear_pano.mesh.material.materials[i], time, {opacity: 0,delay:del, ease: Expo.easeOut})
			TweenLite.to(blur_pano.mesh.material.materials[i], time, {opacity: 1, delay:del,ease: Expo.easeOut})
			i++
		dist = 60
		TweenLite.to(clear_pano.mesh.position, time, {x:-1*dist*Math.cos(THREE.Math.degToRad(hotspot_angle )),z:-1*dist*Math.sin(THREE.Math.degToRad(hotspot_angle )),delay:del,ease: Expo.easeOut,onComplete: @check_new_pano_load.bind(this),onCompleteParams : [error]})
		
		return

	check_new_pano_load : (error)->
		if @destroy
			return

		@clear_pano.mesh.position.x = 0
		@clear_pano.mesh.position.z = 0

		i = 0
		while i < 6
			@clear_pano.mesh.material.materials[i].opacity = 0
			@clear_pano.mesh.material.materials[i].map.dispose()
			@blur_pano.mesh.material.materials[i].opacity = 1
			i++

		blur_pano_to_new_pano = @blur_pano_to_new_pano.bind(this)
		@load_clear_pano(error).done ->
			blur_pano_to_new_pano(error)
			return
		return

	blur_pano_to_new_pano : (error)->
		if @destroy
			return
		blur_pano = @blur_pano
		clear_pano = @clear_pano
		time = 0.5
		i = 0
		while i < 6
			TweenLite.to(blur_pano.mesh.material.materials[i], time, {opacity: 0, ease: Power0.easeOut})
			i++
		i = 0

		while i < 6
			if i is 5
				TweenLite.to(clear_pano.mesh.material.materials[i], time, {opacity: 1, ease: Power0.easeOut, onComplete: @complete.bind(this),onCompleteParams : [error]})
			else
				TweenLite.to(clear_pano.mesh.material.materials[i], time, {opacity: 1, ease: Power0.easeOut})
			i++
		return
	
	alter_moving : ->
		@moving = false
	
	complete : (error)->
		if @destroy
			return
		
		@clear_pano.mesh.rotation.y = 0
		root.Config.lon += error
		pano_id = @current_pano
		alter_moving = @alter_moving.bind(this)
		root.Hotspot.add_hotspots(pano_id).done ->
			root.Annotation.add_annotations(pano_id)
			alter_moving()
			return
		return

	destroy_transition : ()->
		@destroy = true
		blur_pano = @blur_pano
		clear_pano = @clear_pano
		TweenLite.killTweensOf(blur_pano);
		TweenLite.killTweensOf(clear_pano);
		
		@blur_pano.destroy_pano()
		@clear_pano.destroy_pano()

		@blur_pano = null
		@clear_pano = null
		return

root.transition = transition
module.exports = root

			
			



