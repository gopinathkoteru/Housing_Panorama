root = require('./fallback-hotspot.js')
pano = undefined
class Transition
	constructor:(old_id , new_id) ->

		@old_id = old_id
		@new_id = new_id
		root.hotspot.remove_hotspots()
		root.hotspot = null
		
		pano = new root.Pano(new_id)
		
		change_opacity = @change_opacity.bind(this)
		pano.load_pano().done ->
			change_opacity()
			return
		return

	change_opacity:() ->
		time = 3000
		new_id = @new_id
		$("#image-screen1_" + @old_id).fadeTo(time, 0)
		$("#image-screen2_" + @old_id).fadeTo(time, 0)

		$("#image-screen1_" + @new_id).fadeTo(time, 1)
		$("#image-screen2_" + @new_id).fadeTo(time, 1, ->
			root.pano.remove_pano()
			root.pano = null
			root.pano = pano
			root.hotspot = new root.Hotspot(new_id)
			root.hotspot.add_hotspots()
			return)
		return

root.Transition = Transition
module.exports = root


