root = {}
class Pano
	constructor:()->
		@pano_id = undefined
	load_pano:(pano_id)->
		@pano_id = pano_id
		img1 = $("#screen1")
		img2 = $("#screen2")
		
		path = "../test/images/try.jpg"
		
		img1.attr("src",path)
		img2.attr("src",path)
root.Pano = Pano

module.exports = root 