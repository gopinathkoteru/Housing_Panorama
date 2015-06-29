root = {}
class Pano
	constructor:()->
		@pano_id = undefined
	
	load_pano:(pano_id)->
		@pano_id = pano_id 
		img1 = $('<img/>',{id : "image-screen1_" + pano_id})
		img2 = $('<img/>',{id : "image-screen2_" + pano_id})

		img1.css({
			"width" : "1500px",
			"height": "620px"
		})

		img2.css({
			"width" : "1500px",
			"height": "620px",
		})
		
		path = "../test/images/try.jpg"
		
		img1.attr("src",path)
		img2.attr("src",path)

		div1 = $("#screen1")
		div1.append(img1)

		div2 = $("#screen2")
		div2.append(img2)

	remove_pano:->
		$("#image-screen1_" + @pano_id).remove()
		$("#image-screen2_" + @pano_id).remove()
root.Pano = Pano

module.exports = root 