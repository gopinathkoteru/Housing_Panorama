root = require("./init.js")
class animation
	
	constructor: ->
		@destroy = false
	
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
