root = exports ? this
camera = undefined
scene = undefined
renderer = undefined
raycaster = new (THREE.Raycaster)
images = {}
clearImages = {}
clear = {}
Config = 
	imgName: ['r'
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
	count: 100
	webgl: true

init()
animate()

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

root.init = ->
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
	document.addEventListener 'mousedown', on_document_mouse_down, false
	document.addEventListener 'mousemove', on_document_mouse_move, false
	document.addEventListener 'mouseup', on_document_mouse_up, false
	document.addEventListener 'mousewheel', on_document_mouse_wheel, false
	document.addEventListener 'DOMMouseScroll', on_document_mouse_wheel, false
	document.addEventListener 'touchstart', touch_handler, false
	document.addEventListener 'touchmove', touch_handler, false
	document.addEventListener 'touchend', touch_handler, false
	document.addEventListener 'keydown', on_document_key_down, false
	document.addEventListener 'keyup', on_document_key_up, false
	window.addEventListener 'resize', on_window_resize, false
	return

animate = ->
	requestAnimationFrame animate
	update()
	return

Config.rotate_camera = (time, lat) ->
	duration = Date.now() - time
	if duration < 1000
		if Config.isUserInteracting == true
			return
		Config.lon += 0.2
		Config.lat = lat - (lat * duration / 1000)
		requestAnimationFrame ->
			Config.rotate_camera time, lat
		return
	else
		Config.lon += 0.2
		Config.lat = 0
		return


update = ->
	if Config.isUserInteracting == false and Config.count == 100
		Config.lon += 0.2
	else if Config.isUserInteracting == false
		Config.count += 1
	if Config.count == 100
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

root.Config = Config
root.camera = camera
root.scene = scene
root.renderer = renderer
root.raycaster = raycaster
root.images = images
root.clearImages = clearImages
root.clear = clear
