root = exports ? this
Hotspot = 
	panoid: undefined
	hotspot_angles: undefined

Hotspot.init = (hotspot_angles) ->
	Hotspot.hotspot_angles = hotspot_angles

Hotspot.load_texture = () ->
	texture = new THREE.Texture window.texture_placeholder
	material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0 ,side:THREE.DoubleSide,blending: THREE.AdditiveBlending ,depthTest: false } )
	image = new Image();
	image.onload = ->
		texture.image = this
		texture.needsUpdate = true
	image.src = 'images/logo.png' 
	return material

Hotspot.add_hotspot = (angle, dist, hotspotId) ->
	geometry = new THREE.PlaneBufferGeometry( 10, 10, 10 )
	material = material ?  Hotspot.load_texture()
	hotspot = new THREE.Mesh( geometry, material );
	rad_angle = THREE.Math.degToRad( angle );
	hotspot.position.x = 60*Math.cos(rad_angle);
	hotspot.position.y = -10;
	hotspot.position.z = 60*Math.sin(rad_angle);
	v = new (THREE.Vector3)(0, 0, 0)
	hotspot.lookAt(v)
	hotspot.hotspot_id = hotspotId
	hotspot.name = "hotspot";
	root.scene.add( hotspot );
	return

Hotspot.add_hotspots = (panoid) ->
	Hotspot.panoid = panoid
	num_hotspots = Hotspot.hotspot_angles[panoid].length
	i = 0
	while i < num_hotspots
		Hotspot.add_hotspot Hotspot.hotspot_angles[panoid][i][1] ,Hotspot.hotspot_angles[panoid][i][2] ,i 
		i++
	root.Transition.moving = false;
	return

Hotspot.remove_hotspots = ->
	len = scene.children.length
	p = 0
	i = 0
	while i < len
		object = scene.children[ p ]
		if object.name == "hotspot"
			object.geometry.dispose()
			object.material.dispose()
			scene.remove(object)
		else
			p += 1
		i++
	return

Hotspot.front_nearest_hotspot = ->
	num_hotspots = Hotspot.hotspot_angles[root.Transition.current_pano].length
	near_id = -1
	near_angle = undefined
	flag = false
	i = 0
	while i < num_hotspots
		temp = Hotspot.hotspot_angles[root.Transition.current_pano][i][1]
		lon = (Config.lon + 360) % 360
		if temp < 0
			temp += 360
		if( ((lon>=45) &&(lon<=315) && (temp<=(lon+45)%360) &&(temp>=(lon-45+360)%360)) || ((lon<=45) && (temp>=0) && (temp<=lon+45)) || ((lon<=45)&&(temp>=(lon-45+360)%360) && (temp<=360)) ||  ((lon>=315) && (temp>=(lon-45)) && (temp<=360)) || ((lon>=315)&&(temp>=0) &&(temp<= (lon+45)%360)) )
			if flag == false || ((Math.abs temp - lon) < (Math.abs near_angle - lon))
				near_angle = temp
				near_id = i
				flag = true
		i++
	return near_id

Hotspot.back_nearest_hotspot = ->
	num_hotspots = Hotspot.hotspot_angles[root.Transition.current_pano].length
	near_id = -1
	near_angle = undefined
	flag = false
	i = 0
	while i < num_hotspots
		temp = Hotspot.hotspot_angles[root.Transition.current_pano][i][1]
		lon = (Config.lon + 360 + 180) % 360
		if temp < 0
			temp += 360
		if( ((lon>=45) &&(lon<=315) && (temp<=(lon+45)%360) &&(temp>=(lon-45+360)%360)) || ((lon<=45) && (temp>=0) && (temp<=lon+45)) || ((lon<=45)&&(temp>=(lon-45+360)%360) && (temp<=360)) ||  ((lon>=315) && (temp>=(lon-45)) && (temp<=360)) || ((lon>=315)&&(temp>=0) &&(temp<= (lon+45)%360)) )
			if flag == false || ((Math.abs temp - lon) < (Math.abs near_angle - lon))
				near_angle = temp
				near_id = i
				flag = true
		i++
	return near_id

root.Hotspot = Hotspot