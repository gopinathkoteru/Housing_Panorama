root = undefined
anim = undefined
DirectPano.show_pano = ()->
	$("#" + DirectPano.start_image_div_id).attr("src","./Dataset/panos-house/start.jpg") 
	root = require("./listeners.js")

	image = $("#"+DirectPano.image_div_id)
	image.css({
		'visibility': 'visible'
		})

	root.Annotation = new root.annotation(DirectPano.annotation_angles)
	root.Annotation.add_annotations(0)
	
	root.scene.children.length = 0

	root.add_listeners()

	root.Hotspot = new root.hotspot(DirectPano.hotspots_angle)
	root.Transition = new root.transition(DirectPano.pano, DirectPano.hotspots_angle)
	root.Hotspot.add_hotspots(0)

	anim = new root.animation()
	root.Config.isUserInteracting = true
	return

DirectPano.remove_pano = ->
	anim.destroy = true
	anim = null
	root.remove_listeners()
	root.Hotspot.destroy_hotspot()
	root.Hotspot = null
	root.Transition.destroy_transition()
	root.Transition = null
	root.Annotation.destroy_annotation()
	root.Annotation = null
	root.destroy()
	return