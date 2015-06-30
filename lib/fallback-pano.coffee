root = {}
class Pano
	constructor:(pano_id)->
		@pano_id = pano_id

	load_pano:->
		pano_id = @pano_id
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
		
		img1.css("display","none")
		img2.css("display","none")
		
		path = "../test/images/" + (pano_id+1) + ".jpg"
		
		img1.attr("src",path)
		img2.attr("src",path)

		div1 = $("#screen1")
		div1.append(img1)

		div2 = $("#screen2")
		div2.append(img2)
		
		dfrd = []
		dfrd[0] = $.Deferred()
		dfrd[1] = $.Deferred()
		
		img1.on("load",->
			img1.off()
			dfrd[0].resolve()
			return)
		img2.on("load",->
			img2.off()
			dfrd[1].resolve()
			return)

		return $.when(dfrd[0],dfrd[1]).done(->).promise()
	remove_pano:->
		$("#image-screen1_" + @pano_id).remove()
		$("#image-screen2_" + @pano_id).remove()
root.Pano = Pano

module.exports = root 