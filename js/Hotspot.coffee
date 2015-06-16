root = exports ? this
Hotspot = 
	panoid: undefined
	hotspotAngles: undefined

Hotspot.add_hotspot = (angle, dist, hotspotId) ->
	geometry = new THREE.BoxGeometry( 2, 2, 2, 1, 1, 1)
	material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
	hotspot = new THREE.Mesh( geometry, material );
	angle = angle - 90;
	rad_angle = THREE.Math.degToRad( angle );
	hotspot.position.x = dist*Math.cos(rad_angle);
	hotspot.position.y = -10;
	hotspot.position.z = dist*Math.sin(rad_angle);
	hotspot.hotspotId = hotspotId
	hotspot.name = "hotspot";
	scene.add( hotspot );

Hotspot.add_hotspots = (panoid) ->
	Hotspot.panoid = panoid
	num_hotspots = Hotspot.hotspotAngles[panoid].length
	for i in [0...num_hotspots]
		Hotspot.addHotspot Hotspot.hotspotAngles[panoid][i][1] Hotspot.hotspotAngles[panoid][i][2] i 
	Transition.moving = false;

Hotspot.remove_hotspots = ->
	len = scene.children.length
	p = 0
	for i in [0...len]
		object = scene.children[ p ]
		if object.name == "hotspot"
			object.geometry.dispose()
			object.material.dispose()
			scene.remove(object)
		else
			p += 1

Hotspot.front_nearest_hotspot = ->
	num_hotspots = Hotspot.hotspotAngles[Transition.currentPano].length
	near_id = -1
	near_angle = undefined
	flag = false
	for i in [0...num_hotspots]
		temp = Hotspot.hotspotAngles[Transition.currentPano][i][1] - 90
		lon = (Config.lon + 360) % 360
		if temp < 0
			temp += 360
		if( ((lon>=45) &&(lon<=315) && (temp<=(lon+45)%360) &&(temp>=(lon-45+360)%360)) || ((lon<=45) && (temp>=0) && (temp<=lon+45)) || ((lon<=45)&&(temp>=(lon-45+360)%360) && (temp<=360)) ||  ((lon>=315) && (temp>=(lon-45)) && (temp<=360)) || ((lon>=315)&&(temp>=0) &&(temp<= (lon+45)%360)) )
			if flag == false || ((Math.abs temp - lon) < (Math.abs near_angle - lon))
				near_angle = temp
				near_id = i
				flag = true
	near_id

Hotspot.back_nearest_hotspot = ->
	num_hotspots = Hotspot.hotspotAngles[Transition.currentPano].length
	near_id = -1
	near_angle = undefined
	flag = false
	for i in [0...num_hotspots]
		temp = Hotspot.hotspotAngles[Transition.currentPano][i][1] - 90
		lon = (Config.lon + 360) % 360
		if temp < 0
			temp += 360
		if( ((lon>=45) &&(lon<=315) && (temp<=(lon+45)%360) &&(temp>=(lon-45+360)%360)) || ((lon<=45) && (temp>=0) && (temp<=lon+45)) || ((lon<=45)&&(temp>=(lon-45+360)%360) && (temp<=360)) ||  ((lon>=315) && (temp>=(lon-45)) && (temp<=360)) || ((lon>=315)&&(temp>=0) &&(temp<= (lon+45)%360)) )
			if flag == false || ((Math.abs temp - lon) < (Math.abs near_angle - lon))
				near_angle = temp
				near_id = i
				flag = true
	near_id

unless root.Hotspot
	root.Hotspot = Hotspot
