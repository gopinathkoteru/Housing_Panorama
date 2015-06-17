root = exports ? this
camera = undefined
scene = undefined
renderer = undefined
texture_placeholder = undefined
raycaster = new (THREE.Raycaster)
blur_images = {}
clear_images = {}
Config = 
	img_name: ['r'
		'l' 
		'u' 
		'd' 
		'f' 
		'b'
	]
	isUserInteracting: false
	lon: 0
	lat: 0
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
	
	return

animate = ->
	requestAnimationFrame animate
	update()
	return

rotate_camera = (time, lat) ->
	if Config.isUserInteracting == true
		return
	duration = Date.now() - time
	if duration < 1000
		Config.lat = lat - (lat * duration / 1000)
		requestAnimationFrame ->
			rotate_camera time, lat
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
			rotate_camera Date.now(), Config.lat
	Config.lon = (Config.lon + 360) % 360
	Config.lat = Math.max(-35, Math.min(35, Config.lat))
	phi = THREE.Math.degToRad(90 - (Config.lat))
	theta = THREE.Math.degToRad(Config.lon)
	camera.target.x = 500 * Math.sin(phi) * Math.cos(theta)
	camera.target.y = 500 * Math.cos(phi)
	camera.target.z = 500 * Math.sin(phi) * Math.sin(theta)
	camera.lookAt camera.target
	renderer.render scene, camera
	return

init()
animate()

root.Config = Config
root.camera = camera
root.scene = scene
root.renderer = renderer
root.blur_images = blur_images
root.clear_images = clear_images
root.texture_placeholder = texture_placeholder
root.raycaster = raycaster
