root = require('./panel-hotspot.js')
front_pano = undefined
back_pano = undefined
path = "../test/Dataset/panos-house/"
root.full_dataset = {}
localStorage.setItem('full_dataset', JSON.stringify(root.full_dataset))
one_dataset = {
	"pano_path": undefined,
	"hotspot": {}
}
hotspot = {}

root.Config = 
	img_name: ['r'
		'l' 
		'u' 
		'd' 
		'f' 
		'b'
	]
	webgl : true
	lon : 0
	lat : 0
container = $("#container")
scene = new (THREE.Scene)
	
texture_placeholder = $('<canvas/>').width(128).height(128)

renderer = new (THREE.WebGLRenderer)
	
renderer.setPixelRatio window.devicePixelRatio

container.append(renderer.domElement)
renderer.setSize container.outerWidth(), container.outerHeight()
camera = new (THREE.PerspectiveCamera)(65, container.outerWidth() / container.outerHeight(), 1, 1100)
camera.target = new (THREE.Vector3)(0, 0, 0)

animate = ->
	requestAnimationFrame(animate)
	if(root.Config.target_lon != undefined and root.Config.current_lon != undefined and Math.abs(root.Config.target_lon - root.Config.current_lon) > 0.1)
		root.Config.current_lon = root.Config.current_lon + (root.Config.target_lon - root.Config.current_lon)*0.15
		root.Config.lon = (root.Config.current_lon + 360)%360
	if(root.Config.target_lat != undefined and root.Config.current_lat != undefined and Math.abs(root.Config.target_lat - root.Config.current_lat) > 0.1)
		root.Config.current_lat = root.Config.current_lat + (root.Config.target_lat - root.Config.current_lat)*0.15
		root.Config.lat = root.Config.current_lat
	update()
	return

update = ->
	root.Config.lon = (root.Config.lon + 360)%360
	phi = THREE.Math.degToRad(90 - (root.Config.lat))
	theta = THREE.Math.degToRad(root.Config.lon)
	camera.target.x = 500 * Math.sin(phi) * Math.cos(theta)
	camera.target.y = 500 * Math.cos(phi)
	camera.target.z = 500 * Math.sin(phi) * Math.sin(theta)
	camera.lookAt camera.target
	renderer.render scene, camera
	return

init = (scrollid,num_panos) ->
	test = ""
	i = 1
	while i<=num_panos
		test = test + "<option value='"+ i + "'>pano" +i + "</option>" 
		i++
	document.getElementById(scrollid).innerHTML = test;

change_pano = (id,value) ->
	opc = $("#opacity")[0].value
	if id == 1
		front_pano.destroy_pano()
		front_pano = new root.Pano(value-1,false)
		front_pano.create_pano(path + value + '/mobile_',opc)
	else
		back_pano.destroy_pano()
		back_pano = new root.Pano(value-1,false)
		back_pano.create_pano(path + value + '/mobile_',1-opc)
		error_value = $("#adjust")[0].value
		back_pano.mesh.rotation.y = THREE.Math.degToRad(error_value)

animate()

init("list1",22)
init("list2",22)

$("#house-list").on('change',->
	one_dataset = {
		"pano_path": undefined,
		"hotspot": {}
	}
	hotspot = {}
	house = $("#house-list")[0]
	house_path = house.options[house.selectedIndex].value
	path = '../test/Dataset/' + house_path + '/'
	count = 0
	if house_path=="panos-house"
		count = 22
	else if house_path =="panos"
		count = 5
	else 
		count = 4
	init("list1",count)
	init("list2",count)

	$("#list1").trigger('change')
	$("#list2").trigger('change')
	return)

$("#list1").on('change',->
	list = $("#list1")
	value = list[0].options[list[0].selectedIndex].value
	change_pano(1,value)
	return)

$("#list2").on('change',->
	list = $("#list2")
	value = list[0].options[list[0].selectedIndex].value
	change_pano(2,value)
	return)

$("#save-data-button").click ->
	root.save_annotation()
	root.save_hotspot()
	if root.full_dataset[$("#house-list").val()] == undefined
		one_dataset = {}
		root.full_dataset[$("#house-list").val()] = one_dataset
	else
		one_dataset = root.full_dataset[$("#house-list").val()]
	from_id = $("#list1").val() - 1
	pano_path = $("#pano-path").val()
	title = $("#pano-title").val()
	if one_dataset[from_id] == undefined
		one_dataset[from_id] = {
			"path": pano_path,   # The path of the folder where images are stored
			"title": title,    # Title of the scene e.g. Hall
			"hotspot": [],
			"annotation": [],
		}
	one_dataset["num_panos"] = $("#list1 option").size();
	one_dataset[from_id]["annotation"] = root.annotation_angles
	one_dataset[from_id]["hotspot"] = root.hotspots_angle
	localStorage.setItem('full_dataset', JSON.stringify(root.full_dataset))

$('#container').click (e) ->
	if $('#add-hotspot-image').css('display') == 'block'
		l = e.pageX - 25
		t = e.pageY - 15
		$('#add-hotspot-image').css
			width: '50px'
			height: '50px'
			left: l
			top: t
			position: 'absolute'
	return

root.camera = camera
root.scene = scene
root.renderer = renderer
root.texture_placeholder = texture_placeholder

front_pano = new root.Pano(0,false)
front_pano.create_pano('../test/Dataset/panos-house/1/mobile_',1)

back_pano = new root.Pano(0,false)
back_pano.create_pano('../test/Dataset/panos-house/1/mobile_',0)

slider = $("#opacity")
slider.on('change mousemove',->
	opacity = slider[0].value
	value = $("#display")
	value.html(opacity)
	i = 0
	while i < 6
		j = 0
		while j < 4
			front_pano.mesh.children[i].children[j].material.opacity = opacity
			back_pano.mesh.children[i].children[j].material.opacity = 1 - opacity
			j++
		i++
	return)

adjust = $("#adjust")
adjust.on('change mousemove',->
	error_value = adjust[0].value
	error = $("#error")
	error.html(error_value)
	back_pano.mesh.rotation.y = THREE.Math.degToRad(error_value)
	return)


root.add_listeners()

module.exports = root