root = undefined
anim = undefined
DirectPano.show_pano = ()->
	root = require("./listeners.js")

	root.Annotation = new root.annotation(DirectPano.annotation_angles)
	root.Annotation.add_annotations(0)
	root.Annotation.update()
	
	root.scene.children.length = 0
	
	anim = new root.animation()

	root.add_listeners()

	root.Hotspot = new root.hotspot(DirectPano.hotspots_angle)
	root.Transition = new root.transition(DirectPano.pano_path,DirectPano.hotspots_angle) 
	root.Hotspot.add_hotspots(0)
	root.Hotspot.update()
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