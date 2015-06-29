root = require("./fallback-pano.js")
root.hotspot_angles = [[[1, 7, 110], [3, 270, 80]], [[0, 185, 110], [2, 275, 80]], [[1, 100, 80], [3, 190, 110]], [[2, 3, 110], [0, 95, 85]]]
class hotspot
	constructor: () ->
		@panoid = undefined
	
	add_hotspot: (left, top, i, div1, div2) ->
		
		hotspot_div1 = $("<div></div>", {
			id: "hotspot_" + i + "_0",
			class: "hotspot"
		});
		hotspot =  $("<img  src='../test/images/logo.png' id='hotspot_" + i + "_0'/>")
		hotspot.css('height', '100')
		hotspot.css('width', '100')
		hotspot_div1.append(hotspot)
		div1.append(hotspot_div1)
		
		hotspot_div2 = $("<div></div>", {
	        id: "hotspot_" + i + "_1",
	        class: "hotspot" 
	    });
		hotspot =  $("<img  src='../test/images/logo.png' id='hotspot_" + i + "_1'/>")
		hotspot.css('height', '100')
		hotspot.css('width', '100')
		hotspot_div2.append(hotspot)
		div2.append(hotspot_div2)
		
		$("#hotspot_" + i + "_0").css('position', 'absolute')
		$("#hotspot_" + i + "_0").css('left', left)
		$("#hotspot_" + i + "_0").css('top', top)
		
		$("#hotspot_" + i + "_1").css('position', 'absolute')
		$("#hotspot_" + i + "_1").css('left', left)
		$("#hotspot_" + i + "_1").css('top', top)

	add_hotspots: (panoid) ->
		@panoid = panoid
		num_hotspots = root.hotspot_angles[panoid].length
		img1 = $("#screen1")
		img2 = $("#screen2")
		i = 0
		while i < num_hotspots
			angle = (root.hotspot_angles[panoid][i][1] + 45)%360
			left = ((angle/360)*1500) + 'px'
			top = "400px" 
			@add_hotspot(left, top, i, img1, img2)
			i++

	remove_hotspots: () ->
		$(".hotspot").remove()

root.hotspot = hotspot
module.exports = root
