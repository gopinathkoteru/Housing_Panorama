root = require("./init.js")
class animation
	
	constructor: ->
		@destroy = false
		@animate()
	
	animate : ->
		if not @destroy
			requestAnimationFrame @animate.bind(this)
			@update()
		return
	
	update : ->
		if root.Config.isUserInteracting == false and root.Config.autoplay == true
			root.Config.lon += 0.2
		else if root.Config.isUserInteracting == false
			duration = Date.now() - root.Config.stop_time
			if duration > 2000
				root.Config.autoplay = true
				rotate_camera = (time, lat) ->
					if root.Config.isUserInteracting == true
						return
					duration = Date.now() - time
					if duration < 1000
						root.Config.lat = lat - (lat * duration / 1000)
						requestAnimationFrame ->
							rotate_camera(time ,lat)
							return
					else
						root.Config.lat = 0
						return
				rotate_camera Date.now(), root.Config.lat
		len = root.scene.children.length
		p = 0
		i = 0
		while i < len
			object = root.scene.children[ i ]
			if object.name == "hotspot"
				text = document.getElementById("hotspot_" + object.panoid)
				vector = object.position.clone()
				rad_angle =THREE.Math.degToRad((object.deg_angle+5))
				vector.x += 13*Math.cos(rad_angle)
				vector.z += 13*Math.sin(rad_angle)
				vector = vector.project(root.camera)
				container = document.getElementById('container')
				pos =
					x: (vector.x + 1)/2 * container.offsetWidth
					y: -(vector.y - 1)/2 * container.offsetHeight
				if text
					if(vector.x > 1 or vector.x < -1 or vector.y > 1 or vector.y < -1 or vector.z > 1 or vector.z < -1)
						if( $("#hotspot_" + object.panoid).css('display') != 'none')
							$("#hotspot_" + object.panoid).removeAttr('style')
							$("#hotspot_" + object.panoid).css({
								'display': 'none'
							})
					else
						$("#hotspot_" + object.panoid).css({
							'display': 'block',
							'left': '-10px',
							'top': '0px',
							'transform': 'translate3d(' + (pos.x) + 'px,' + (pos.y) + 'px,0px)',
							'text-align': 'left',
							'color':  'Yellow',
							'position': 'absolute',
							'margin-left': '-20px'
						})
			i++
		root.Config.lon = (root.Config.lon + 360) % 360
		root.Config.lat = Math.max(-35, Math.min(35, root.Config.lat))
		phi = THREE.Math.degToRad(90 - (root.Config.lat))
		theta = THREE.Math.degToRad(root.Config.lon)
		root.camera.target.x = 500 * Math.sin(phi) * Math.cos(theta)
		root.camera.target.y = 500 * Math.cos(phi)
		root.camera.target.z = 500 * Math.sin(phi) * Math.sin(theta)
		root.camera.lookAt root.camera.target
		root.renderer.render root.scene, root.camera
		return

root.animation = animation
module.exports = root
