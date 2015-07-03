root = require("./panel-pano.js")
onPointerDownPointerX = undefined
onPointerDownPointerY = undefined
onPointerDownLon = undefined
onPointerDownLat =undefined

on_mouse_down = (event) ->
	event.preventDefault()
	root.Config.isUserInteracting = true
	onPointerDownPointerX = event.clientX
	onPointerDownPointerY = event.clientY
	onPointerDownLon = root.Config.lon
	onPointerDownLat = root.Config.lat
	return

on_mouse_move = (event) ->
	if root.Config.isUserInteracting == true
		mouseSpeed = 0.3
		root.Config.lon = (onPointerDownPointerX - (event.clientX)) * mouseSpeed + onPointerDownLon
		root.Config.lat = (event.clientY - onPointerDownPointerY) * mouseSpeed + onPointerDownLat
	return

on_mouse_up = (event) ->
	root.Config.isUserInteracting = false
	root.Config.stop_time = Date.now()
	root.Config.autoplay = false
	return

on_mouse_wheel = (event) ->
	if event.wheelDeltaY
		root.camera.fov -= event.wheelDeltaY * 0.05
	else if event.wheelDelta
		root.camera.fov -= event.wheelDelta * 0.05
	else if event.detail
		root.camera.fov += event.detail * 1.0
	root.camera.fov = Math.max(60, Math.min(90, root.camera.fov))
	root.camera.updateProjectionMatrix()
	return

on_key_down = (event) ->
	near_id = undefined
	if !event
		event = window.event
	root.Config.isUserInteracting = true
	keyPressed = event.keyCode
	if keyPressed == 37
		root.Config.current = root.Config.lon
		root.Config.target = root.Config.lon - 20
	else if keyPressed == 39
		root.Config.current = root.Config.lon
		root.Config.target = root.Config.lon + 20
	return

on_key_up = (event) ->
	root.Config.isUserInteracting = false
	root.Config.stop_time = Date.now()
	root.Config.autoplay = false
	return

add_listeners = ->
	$("#container").on
		click: (event) ->
			$("#container").focus();
			return
		mousedown: (event) -> 
			on_mouse_down(event) 
			return
		mousemove: (event) ->
			on_mouse_move(event)
			return
		mouseup: (event) ->
			on_mouse_up(event)
			return
		mousewheel: (event) ->
			on_mouse_wheel(event.originalEvent)	
			return
		DOMMouseScroll: (event) ->
			on_mouse_wheel(event.originalEvent)
			return
		keydown: (event) ->
			on_key_down(event)
			return
		keyup: (event) ->
			on_key_up(event)
			return

remove_listeners = ()->
	$("#container").off()
	return
root.add_listeners = add_listeners
root.remove_listeners = remove_listeners
module.exports = root


