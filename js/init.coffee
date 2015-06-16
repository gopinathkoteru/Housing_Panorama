root = exports ? this
camera = undefined
scene = undefined
renderer = undefined
texture_placeholder = undefined
raycaster = new (THREE.Raycaster)
images = {}
clear_images = {}
clear = {}
Config = 
	img_name: ['r'
		'l' 
		'u' 
		'd' 
		'f' 
		'b'
	]
	mouseSpeed: 0.3
	isUserInteracting: false
	phi: 0
	theta: 0
	lon: 0
	lat: 0
	keyMax: 7
	keySpeed: 2
	stop_time:undefined
	autoplay : true
	webgl: true

root.go_fullscreen = ->
	container = document.getElementById('container')
	container.style.width = window.innerWidth + 'px'
	container.style.height = window.innerHeight + 'px'
	renderer.setSize window.innerWidth, window.innerHeight
	image = document.getElementById('fullscreen-image')
	image.style.visibility = 'hidden'
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
	return

detect_webgl = ->
	try
		canvas = document.createElement('canvas')
		return ! !(window.WebGLRenderingContext and (canvas.getContext('webgl') or canvas.getContext('experimental-webgl')))
	catch e
		Config.webgl = false
		return false

init = ->
	container = document.getElementById('container')
	scene = new (THREE.Scene)
	texture_placeholder = document.createElement('canvas')
	texture_placeholder.width = 128
	texture_placeholder.height = 128
	renderer = if detect_webgl() then new (THREE.WebGLRenderer) else new (THREE.CanvasRenderer)
	renderer.setPixelRatio window.devicePixelRatio
	console.log Config.webgl
	container.appendChild renderer.domElement
	renderer.setSize container.offsetWidth, container.offsetHeight
	camera = new (THREE.PerspectiveCamera)(60, container.offsetWidth / container.offsetHeight, 1, 1100)
	camera.target = new (THREE.Vector3)(0, 0, 0)
	document.addEventListener 'mousedown', root.on_document_mouse_down, false
	document.addEventListener 'mousemove', root.on_document_mouse_move, false
	document.addEventListener 'mouseup', root.on_document_mouse_up, false
	document.addEventListener 'mousewheel', root.on_document_mouse_wheel, false
	document.addEventListener 'DOMMouseScroll', root.on_document_mouse_wheel, false
	document.addEventListener 'touchstart', root.touch_handler, false
	document.addEventListener 'touchmove', root.touch_handler, false
	document.addEventListener 'touchend', root.touch_handler, false
	document.addEventListener 'keydown', root.on_document_key_down, false
	document.addEventListener 'keyup', root.on_document_key_up, false
	window.addEventListener 'resize', root.on_window_resize, false
	return

animate = ->
	requestAnimationFrame animate
	update()
	return

Config.rotate_camera = (time, lat) ->
	if Config.isUserInteracting == true
		return
	duration = Date.now() - time
	if duration < 1000
		Config.lat = lat - (lat * duration / 1000)
		requestAnimationFrame ->
			Config.rotate_camera time, lat
		return
	else
		Config.lat = 0
		return


update = ->
	if Config.isUserInteracting == false and Config.autoplay == true
		Config.lon += 0.2
	else if Config.isUserInteracting == false
		duration = Date.now() - Config.stop_time
		if duration > 2000
			Config.autoplay = true
			Config.rotate_camera Date.now(), Config.lat
	Config.lon = (Config.lon + 360) % 360
	Config.lat = Math.max(-35, Math.min(35, Config.lat))
	Config.phi = THREE.Math.degToRad(90 - (Config.lat))
	Config.theta = THREE.Math.degToRad(Config.lon)
	camera.target.x = 500 * Math.sin(Config.phi) * Math.cos(Config.theta)
	camera.target.y = 500 * Math.cos(Config.phi)
	camera.target.z = 500 * Math.sin(Config.phi) * Math.sin(Config.theta)
	camera.lookAt camera.target
	renderer.render scene, camera
	return

init()
animate()

root.Config = Config
root.camera = camera
root.scene = scene
root.renderer = renderer
root.images = images
root.clear_images = clear_images
root.clear = clear
root.texture_placeholder = texture_placeholder
root.raycaster = raycaster
