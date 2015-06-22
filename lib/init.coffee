root = {}
camera = undefined
scene = undefined
renderer = undefined
texture_placeholder = undefined
raycaster = new (THREE.Raycaster)
blur_images = {}
clear_images = {}
active = undefined
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
go_fullscreen = ->
	container = document.getElementById(DirectPano.pano_div_id)
	container.style.width = window.innerWidth + 'px'
	container.style.height = window.innerHeight + 'px'
	renderer.setSize window.innerWidth, window.innerHeight
	image = document.getElementById(DirectPano.image_div_id)
	image.style.visibility = 'hidden'
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
	return

escape_fullscreen = ->
	container = document.getElementById(DirectPano.pano_div_id)
	container.style.width = DirectPano.initial_width + 'px'
	container.style.height = DirectPano.initial_height + 'px'
	renderer.setSize container.offsetWidth, container.offsetHeight
	image = document.getElementById(DirectPano.image_div_id)
	image.style.visibility = 'visible'
	camera.aspect = container.offsetWidth / container.offsetHeight
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
	container = document.getElementById(DirectPano.pano_div_id)
	scene = new (THREE.Scene)
	texture_placeholder = document.createElement('canvas')
	texture_placeholder.width = 128
	texture_placeholder.height = 128
	renderer = if detect_webgl() then new (THREE.WebGLRenderer) else new (THREE.CanvasRenderer)
	renderer.setPixelRatio window.devicePixelRatio

	container.appendChild renderer.domElement
	renderer.setSize container.offsetWidth, container.offsetHeight
	camera = new (THREE.PerspectiveCamera)(65, container.offsetWidth / container.offsetHeight, 1, 1100)
	camera.target = new (THREE.Vector3)(0, 0, 0)
	$('#'+ DirectPano.image_div_id).click(->
		go_fullscreen()
		return)
	return

destroy = (dfrd)->
	root.Hotspot = undefined
	
	for prop in clear_images
		clear_images[prop] = null
	
	for prop in blur_images
		blur_images[prop] = null
	
	clear_images= {}
	blur_images = {}
	
	Config.lon = 0
	Config.lat = 0
	Config.stop_time = undefined
	Config.autoplay  = true
	return

init()

root.destroy = destroy
root.Config = Config
root.camera = camera
root.scene = scene
root.renderer = renderer
root.blur_images = blur_images
root.clear_images = clear_images
root.texture_placeholder = texture_placeholder
root.raycaster = raycaster
root.escape_fullscreen = escape_fullscreen
module.exports = root
