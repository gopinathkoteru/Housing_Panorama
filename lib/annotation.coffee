root = require("./hotspot.js")
object = undefined
class annotation
	constructor:(@annotation_angles,@content) ->
		@panoid = undefined
		@length = 0
		@destroy = false

	add_annotation:(annotation_id)->
		annotation_id = "annotation_" + annotation_id
		div = $("<div></div>",{id : annotation_id})
		div.prepend('<img src="../test/images/i-image.png" width=30 height=30/>')
		div.width(30).height(30)
		$("#" + DirectPano.pano_div_id).append(div)
		return
	
	add_annotations:(panoid)->
		@panoid = panoid
		try
			@length = @annotation_angles[panoid].length
			i = 0
			while i < @length
				if @destroy
					@remove_annotations()
					return
				@add_annotation(i)
				i++
		catch
			return
		return

	remove_annotations:->
		i = 0
		while i < @length
			$("#annotation_" + i).remove()
			i++
		return

	destroy_annotation:->
		@destroy = true
		@remove_annotations()
	
	update:()->
		i = 0
		panoid = @panoid
		while i < @length
			annotation_id = "#annotation_" + i
			text = $(annotation_id)
			angle = @annotation_angles[panoid][i][0]
			rad_angle =THREE.Math.degToRad(angle)
			vector = new (THREE.Vector3)(30*Math.cos(rad_angle), -10, 30*Math.sin(rad_angle))
			vector.x += 13*Math.cos(rad_angle)
			vector.z += 13*Math.sin(rad_angle)
			vector = vector.project(root.camera)
			container = $("#" + DirectPano.pano_div_id)
			pos =
				x: (vector.x + 1)/2 * container.width()
				y: -(vector.y - 1)/2 * container.height()
			if text
				if(vector.x > 1 or vector.x < -1 or vector.y > 1 or vector.y < -1 or vector.z > 1 or vector.z < -1)
					if( $(annotation_id).css('display') != 'none')
						$(annotation_id).removeAttr('style')
						$(annotation_id).css({
							'display': 'none'
						})
				else 
					$(annotation_id).css({
					'display': 'block',
					'left': '-10px',
					'top': '0px',
					'transform': 'translate3d(' + (pos.x) + 'px,' + (pos.y) + 'px,0px)',
					'position': 'absolute',
					})
			i++
		if not @destroy
			requestAnimationFrame @update.bind(this)
		return
root.annotation = annotation
module.exports = root
