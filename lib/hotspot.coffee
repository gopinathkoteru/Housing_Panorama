root = require("./pano.js")
class hotspot
	constructor: (hotspot_angles)->
		@panoid = undefined
		@hotspot_angles = hotspot_angles
		@destroy = false

	load_texture : () ->
		texture = new THREE.Texture window.texture_placeholder
		material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0 ,side:THREE.DoubleSide,blending: THREE.AdditiveBlending ,depthTest: false } )
		image = new Image();
		image.onload = ->
			image.onload = null
			texture.image = this
			texture.needsUpdate = true
		image.src = '../test/images/logo.png' 
		return material

	add_hotspot :(angle, dist, hotspotId, dfrd) ->
		geometry = new THREE.PlaneBufferGeometry( 10, 10, 10 )
		material = @load_texture()
		hotspot = new THREE.Mesh( geometry, material )
		rad_angle = THREE.Math.degToRad( angle )
		hotspot.position.x = dist*Math.cos(rad_angle)
		hotspot.position.y = -50
		hotspot.position.z = dist*Math.sin(rad_angle)
		v = new (THREE.Vector3)(-hotspot.position.x, 400, -hotspot.position.z)
		hotspot.lookAt(v)
		geometry = new THREE.PlaneBufferGeometry( 1, 1, 1 )
		panoid = @panoid

		text_to_show = DirectPano.hotspot_text[@hotspot_angles[panoid][hotspotId][0]]
		hotspot.panoid = @hotspot_angles[root.Transition.current_pano][hotspotId][0]
		hotspot.deg_angle = angle
		container = document.getElementById('container')
		text = document.createElement('div')
		text.setAttribute("id", ("hotspot_" + @hotspot_angles[root.Transition.current_pano][hotspotId][0]))
		text.innerHTML = text_to_show
		container.appendChild(text)

		hotspot.hotspot_id = hotspotId
		hotspot.name = "hotspot"
		root.scene.add( hotspot )
		dfrd.resolve()
		return

	add_hotspots :(panoid) ->
		@panoid = panoid
		num_hotspots = @hotspot_angles[panoid].length
		dfrd = []
		i = 0
		while i < num_hotspots
			dfrd[i] = $.Deferred()
			i++
		i = 0
		while i < num_hotspots
			if @destroy
				@remove_hotspots()
				return
			@add_hotspot @hotspot_angles[panoid][i][1] ,@hotspot_angles[panoid][i][2] ,i, dfrd[i]
			i++
		$.when.apply($, dfrd).done(->).promise()

	remove_hotspots :->
		len = root.scene.children.length
		p = 0
		i = 0
		while i < len
			object = root.scene.children[ p ]
			if object.name == "hotspot"
				object.geometry.dispose()
				object.material.dispose()
				root.scene.remove(object)
				$("#hotspot_" + object.panoid).remove()
			else
				p += 1
			i++
		return

	front_nearest_hotspot :(panoid)->	
		num_hotspots = @hotspot_angles[panoid].length
		near_id = -1
		near_angle = undefined
		flag = false
		i = 0
		while i < num_hotspots
			temp = @hotspot_angles[panoid][i][1]
			lon = (root.Config.lon + 360) % 360
			if temp < 0
				temp += 360
			if( ((lon>=45) &&(lon<=315) && (temp<=(lon+45)%360) &&(temp>=(lon-45+360)%360)) || ((lon<=45) && (temp>=0) && (temp<=lon+45)) || ((lon<=45)&&(temp>=(lon-45+360)%360) && (temp<=360)) ||  ((lon>=315) && (temp>=(lon-45)) && (temp<=360)) || ((lon>=315)&&(temp>=0) &&(temp<= (lon+45)%360)) )
				if flag == false || ((Math.abs temp - lon) < (Math.abs near_angle - lon))
					near_angle = temp
					near_id = i
					flag = true
			i++
		return near_id

	back_nearest_hotspot : (panoid) ->
		num_hotspots = @hotspot_angles[panoid].length
		near_id = -1
		near_angle = undefined
		flag = false
		i = 0
		while i < num_hotspots
			temp = @hotspot_angles[panoid][i][1]
			lon = (root.Config.lon + 360 + 180) % 360
			if temp < 0
				temp += 360
			if( ((lon>=45) &&(lon<=315) && (temp<=(lon+45)%360) &&(temp>=(lon-45+360)%360)) || ((lon<=45) && (temp>=0) && (temp<=lon+45)) || ((lon<=45)&&(temp>=(lon-45+360)%360) && (temp<=360)) ||  ((lon>=315) && (temp>=(lon-45)) && (temp<=360)) || ((lon>=315)&&(temp>=0) &&(temp<= (lon+45)%360)) )
				if flag == false || ((Math.abs temp - lon) < (Math.abs near_angle - lon))
					near_angle = temp
					near_id = i
					flag = true
			i++
		return near_id
	destroy_hotspot :->
		@destroy = true
		@remove_hotspots()
root.hotspot = hotspot
module.exports = root