root = exports ? this
root.on_window_resize = ->
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize window.innerWidth, window.innerHeight
	return

root.touch_handler = (event) ->
	touches = event.changedTouches
	first = touches[0]
	type = ''
	switch event.type
		when 'touchstart'
			type = 'mousedown'
		when 'touchmove'
			type = 'mousemove'
		when 'touchend'
			type = 'mouseup'
		else
			return
	simulatedEvent = document.createEvent('MouseEvent')
	simulatedEvent.initMouseEvent type, true, true, window, 1, first.screenX, first.screenY, first.clientX, first.clientY, false, false, false, false, 0, null
	first.target.dispatchEvent simulatedEvent
	event.preventDefault()
	return

root.on_document_mouse_down = (event) ->
	event.preventDefault()
	Config.isUserInteracting = true
	Config.count = 0
	onPointerDownPointerX = event.clientX
	onPointerDownPointerY = event.clientY
	onPointerDownLon = Config.lon
	onPointerDownLat = Config.lat
	vector = new (THREE.Vector3)
	container = document.getElementById('container')
	vector.set event.clientX / container.offsetWidth * 2 - 1, -(event.clientY / container.offsetHeight) * 2 + 1, 0.5
	vector.unproject camera
	raycaster.set camera.position, vector.sub(camera.position).normalize()
	intersects = raycaster.intersectObjects(scene.children, true)
	if intersects.length > 0 and intersects[0].object.name == 'hotspot'
		Transition.start intersects[0].object.hotspotId
	return

root.on_document_mouse_move = (event) ->
	if Config.isUserInteracting == true
		Config.lon = (onPointerDownPointerX - (event.clientX)) * Config.mouseSpeed + onPointerDownLon
		Config.lat = (event.clientY - onPointerDownPointerY) * Config.mouseSpeed + onPointerDownLat
	return

root.on_document_mouse_up = (event) ->
	Config.isUserInteracting = false
	return

root.on_document_key_down = (event) ->
	near_id = undefined
	if !event
		event = window.event
	Config.isUserInteracting = true
	Config.count = 0
	keyPressed = event.keyCode
	if keyPressed == 37
		Config.lon -= Config.keySpeed
	else if keyPressed == 39
		Config.lon += Config.keySpeed
	else if keyPressed == 38
		if Transition.moving == false
			near_id = Hotspot.frontNearestHotspot()
			if near_id != -1
				Transition.start near_id
	else if keyPressed == 40
		if Transition.moving == false
			near_id = Hotspot.backNearestHotspot()
			if near_id != -1
				Transition.start near_id
	if Config.isUserInteracting == true
		if Config.keySpeed < Config.keyMax
			Config.keySpeed += 1
	return

root.on_document_key_up = (event) ->
	Config.isUserInteracting = false
	Config.keySpeed = 2
	return

root.on_document_mouse_wheel = (event) ->
	if event.wheelDeltaY
		camera.fov -= event.wheelDeltaY * 0.05
	else if event.wheelDelta
		camera.fov -= event.wheelDelta * 0.05
	else if event.detail
		camera.fov += event.detail * 1.0
	camera.fov = Math.max(60, Math.min(90, camera.fov))
	camera.updateProjectionMatrix()
	return
