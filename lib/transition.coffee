root = require("./hotspot.js")

Transition = 
	pano : ""
	current_pano : 0
	pano_num : 0
	moving : false

Transition.init = (path)->
	Transition.path = path
	root.clear_images[Transition.current_pano] = []

	path = path + (Transition.current_pano + 1) + "/mobile_"

	Transition.blur_pano = new root.Pano(0,true)
	clear_pano1 = new root.Pano(0, false)
	clear_pano2 = new root.Pano(0, false)

	Transition.blur_pano.create_pano( path, 0.0)
	clear_pano1.create_pano(path, 1.0)
	clear_pano2.create_pano(path,0.0)

	Transition.clear_pano = [clear_pano1,clear_pano2]

	Transition.preload_images()

	return

Transition.save_clear_images = ->
	if not root.clear_images[Transition.current_pano]
		path = Transition.path + (Transition.current_pano + 1) + "/mobile_"
		root.clear_images[Transition.current_pano] = []

		i = 0
		while i < 6
			do ->
				texture = new THREE.Texture( root.texture_placeholder )
				image_index = i
				
				image = new Image()
				image.onload = ->
					texture.image = this
					texture.needsUpdate = true
					if not root.clear_images[Transition.current_pano][image_index]
						root.clear_images[Transition.current_pano][image_index] = image
					return

				image.src = path + root.Config.img_name[i] + ".jpg"
				return
			i++
	return

Transition.preload_images = ->
	i = 0
	while i < root.Hotspot.hotspot_angles[Transition.current_pano].length
		do ->
			pano_id = root.Hotspot.hotspot_angles[Transition.current_pano][i][0]

			if not root.blur_images[pano_id]
				root.blur_images[pano_id] = []
				path = Transition.path + "blur_" + (pano_id + 1) + "/mobile_"
				j = 0
				while j < 6
					do ->
						texture = new THREE.Texture( root.texture_placeholder )
						image_index = j

						image = new Image()
						image.onload = ->
							texture.image = this
							texture.needsUpdate = true
							if not root.blur_images[pano_id][image_index]
								root.blur_images[pano_id][image_index] = image
							return
						image.src = path + root.Config.img_name[j] + ".jpg"
						return
					j++
			return
		i++
	return

Transition.start = (hotspot_id) ->

	pano_id = root.Hotspot.hotspot_angles[Transition.current_pano][hotspot_id][0]
	hotspot_angle = root.Hotspot.hotspot_angles[Transition.current_pano][hotspot_id][1]
	dist = root.Hotspot.hotspot_angles[Transition.current_pano][hotspot_id][2]

	find_rotation_angle = ->
	
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

	load_blur_pano = ->
		path = Transition.path + "blur_" + (pano_id + 1) + "/mobile_"
		dfrd = []
		i = 0
		while i < 6
			dfrd[i] = $.Deferred()
			i++

		Transition.blur_pano.pano_id = pano_id
		i = 0
		while i < 6
			Transition.blur_pano.mesh.material.materials[i].map.dispose()
			Transition.blur_pano.mesh.material.materials[i].map = Transition.blur_pano.get_texture(Transition.current_pano,path + root.Config.img_name[i] + ".jpg", dfrd[i], i)
			Transition.blur_pano.mesh.material.materials[i].opacity = 0
			i++

		Transition.blur_pano.mesh.position.x = dist*Math.cos(THREE.Math.degToRad(hotspot_angle ))
		Transition.blur_pano.mesh.position.z = dist*Math.sin(THREE.Math.degToRad(hotspot_angle ))

		$.when(dfrd[0], dfrd[1], dfrd[2], dfrd[3], dfrd[4], dfrd[5]).done(->).promise()

	load_clear_pano = ->
		path = Transition.path + (pano_id + 1) + "/mobile_"
		dfrd = []
		i = 0
		while i < 6
			dfrd[i] = $.Deferred()
			i++
		Transition.clear_pano[Transition.pano_num].pano_id = pano_id
		i = 0
		while i < 6
			Transition.clear_pano[Transition.pano_num].mesh.material.materials[i].map.dispose()
			Transition.clear_pano[Transition.pano_num].mesh.material.materials[i].map = Transition.clear_pano[Transition.pano_num].get_texture(Transition.current_pano,path + root.Config.img_name[i] + ".jpg", dfrd[i], i)
			Transition.clear_pano[Transition.pano_num].mesh.material.materials[i].opacity = 0
			i++
		$.when(dfrd[0], dfrd[1], dfrd[2], dfrd[3], dfrd[4], dfrd[5]).done(->).promise()

	old_pano_to_blur_pano = ->
		time1 = 0.4
		TweenLite.to(root.Config, time1, {lon: rotate_angle, lat: 0, ease: Power0.easeOut})

		time = 2
		del = 0.3
		TweenLite.to(Transition.blur_pano.mesh.position, time, {x: 0, z: 0, delay:del,ease: Expo.easeOut})

		i = 0
		while i < 6
			TweenLite.to(Transition.clear_pano[Transition.pano_num].mesh.material.materials[i], time, {opacity: 0,delay:del, ease: Expo.easeOut})
			TweenLite.to(Transition.blur_pano.mesh.material.materials[i], time, {opacity: 1, delay:del,ease: Expo.easeOut})
			i++

		TweenLite.to(Transition.clear_pano[Transition.pano_num].mesh.position, time, {x:-1*dist*Math.cos(THREE.Math.degToRad(hotspot_angle )),z:-1*dist*Math.sin(THREE.Math.degToRad(hotspot_angle )),delay:del,ease: Expo.easeOut,onComplete: check_new_pano_load})

		return

	check_new_pano_load = ->
		Transition.clear_pano[Transition.pano_num].mesh.position.x = 0
		Transition.clear_pano[Transition.pano_num].mesh.position.z = 0

		i = 0
		while i < 6
			Transition.clear_pano[Transition.pano_num].mesh.material.materials[i].opacity = 0
			Transition.clear_pano[Transition.pano_num].mesh.material.materials[i].map.dispose()
			Transition.blur_pano.mesh.material.materials[i].opacity = 1
			i++

		Transition.pano_num = (Transition.pano_num + 1)%2
		load_clear_pano().done ->
			blur_pano_to_new_pano()
			Transition.preload_images()
			Transition.moving = false
			return
		return

	blur_pano_to_new_pano = ->
		time = 0.5
		i = 0
		while i < 6
			TweenLite.to(Transition.blur_pano.mesh.material.materials[i], time, {opacity: 0, ease: Power0.easeOut})
			i++

		i = 0
		while i < 6
			if i is 5
				TweenLite.to(Transition.clear_pano[Transition.pano_num].mesh.material.materials[i], time, {opacity: 1, ease: Power0.easeOut, onComplete: root.Hotspot.add_hotspots, onCompleteParams:[ pano_id ]})
			else
				TweenLite.to(Transition.clear_pano[Transition.pano_num].mesh.material.materials[i], time, {opacity: 1, ease: Power0.easeOut})
			i++
		return

	Transition.moving = true
	Transition.current_pano = pano_id
	Transition.save_clear_images()

	rotate_angle = find_rotation_angle()

	root.Hotspot.remove_hotspots()
	load_blur_pano().done ->
		old_pano_to_blur_pano()
		return
	
	return

root.Transition = Transition
module.exports = root

			
			




