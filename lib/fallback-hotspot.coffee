root = require("./fallback-pano.js")
root.hotspot_angles = [[[1, 70, 110], [2, 340, 90]], [[0, 225, 110]], [[0, 140, 90], [3, 0, 90]], [[2, 190, 90], [4, 330, 90], [5, 53, 140]], [[3, 135, 90], [9, 332, 90]], [[3, 222, 140], [6, 315, 55], [11, 47, 50]], [[5, 120, 55], [7, 210, 50], [8, 295, 130]], [[6, 25, 50]], [[6, 123, 130], [9, 220, 90]], [[8, 70, 50], [4, 177, 100]], [[11, 340, 45]], [[12, 320, 60], [5, 230, 45], [10, 170, 45]], [[11, 135, 60], [13, 45, 50], [18, 313, 53]], [[12, 245, 50], [14, 130, 75], [16, 63, 100]], [[13, 305, 75], [15, 145, 50]], [[14, 305, 50]], [[13, 220, 100], [17, 75, 50]], [[16, 255, 55]], [[12, 130, 53], [19, 328, 130], [20, 10, 110]], [[18, 135, 130]], [[18, 182, 90], [21, 40, 80]], [[20, 215, 85]]]
root.hotspot_text = ["Exit", "Kitchen", "Hall Entrance", "Middle of Hall", "Sofa", "Somewhere", "1st Room Entrance", "Almirah", "Balcony 2" , "Balcony 1"]
class Hotspot
	constructor: (pano_id) ->
		@pano_id = pano_id
	
	add_hotspot: (left, top, i, div1, div2) ->
		old_id = @pano_id
		new_id = root.hotspot_angles[old_id][i][0]
		hotspot_div1 = $("<div></div>", {
			id: "hotspot_" + i + "_0",
			class: "hotspot"
		});
		hotspot =  $("<img  src='../test/images/logo.png' id='hotspot_" + i + "_0'/>")
		hotspot.css('height', '50')
		hotspot.css('width', '50')
		hotspot_annotation1 = $("<p>" + root.hotspot_text[new_id] + "</p>")
		hotspot_annotation1.css('color', 'Yellow')
		hotspot_div1.prepend(hotspot)
		hotspot_div1.append(hotspot_annotation1)
		hotspot_div1.on('click',->
			transition = new root.Transition(old_id,new_id)
			return)
		div1.append(hotspot_div1)
		
		hotspot_div2 = $("<div></div>", {
	        id: "hotspot_" + i + "_1",
	        class: "hotspot" 
	    });
		hotspot =  $("<img  src='../test/images/logo.png' id='hotspot_" + i + "_1'/>")
		hotspot.css('height', '50')
		hotspot.css('width', '50')
		hotspot_annotation2 = $("<p>" + root.hotspot_text[new_id] + "</p>")
		hotspot_annotation2.css('color', 'Yellow')
		hotspot_div2.append(hotspot)
		hotspot_div2.append(hotspot_annotation2)
		hotspot_div2.on('click',->
			transition = new root.Transition(old_id,new_id)
			return)
		div2.append(hotspot_div2)
		
		$("#hotspot_" + i + "_0").css('position', 'absolute')
		$("#hotspot_" + i + "_0").css('left', left)
		$("#hotspot_" + i + "_0").css('top', top)
		
		$("#hotspot_" + i + "_1").css('position', 'absolute')
		$("#hotspot_" + i + "_1").css('left', left)
		$("#hotspot_" + i + "_1").css('top', top)
		return

	add_hotspots: () ->
		console.log("hjkl")
		pano_id = @pano_id
		num_hotspots = root.hotspot_angles[pano_id].length
		img1 = $("#screen1")
		img2 = $("#screen2")
		i = 0
		while i < num_hotspots
			angle = (root.hotspot_angles[pano_id][i][1] + 80)%360
			left = ((angle/360)*1500) + 'px'
			top = "400px" 
			@add_hotspot(left, top, i, img1, img2)
			i++
		return

	remove_hotspots: () ->
		$(".hotspot").remove()
		i = 0
		pano_id = @pano_id
		num_hotspots = root.hotspot_angles[pano_id].length
		while i < num_hotspots
			$("#hotspot_" + i + "_0").off()
			$("#hotspot_" + i + "_1").off()
			i++
		return

root.Hotspot = Hotspot
module.exports = root
