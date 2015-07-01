root = require("./fallback-transition.js")
flag = false
offset = 1500 - window.innerWidth
(($) ->
	$.fn.dragabble = (opt) ->
		`var $el`
		opt = $.extend({
			handle: ''
			cursor: 'move'
			}, opt)
		if opt.handle == ''
			$el = this
		else
			$el = @find(opt.handle)
		set_x = undefined
		$el.css('cursor', opt.cursor).on('mousedown', (e) ->
			flag = true
			$drag = $el
			set_x = e.pageX
			e.preventDefault()
			return
		).on('mousemove', (e) ->
			if flag == true
				g = $(this).offset().left + (e.pageX - set_x) * 0.05
				g = Math.floor(g)
				keypress = undefined
				if e.pageX > set_x
					keypress = 1
				else
					keypress = 2
				$(this).offset left: g
				p = Math.floor($('#drag').offset().left)
				if keypress == 1
					if Math.abs(p) % 1500 <= 100
						if Math.abs(p) % 3000 <=100
							q = $('#screen1').offset().left - p
							$('#screen2').offset left: q - 1500 + p
						else
							q = $('#screen2').offset().left - p
							$('#screen1').offset left: q - 1500 + p
				else
					p = p + offset
					if Math.abs(p) % 1500 <= 100
						if Math.abs(p) % 3000 <=100
							p = p - offset
							q = $('#screen1').offset().left - p
							$('#screen2').offset left: q + 1500 + p
						else
							p = p - offset
							q = $('#screen2').offset().left - p
							$('#screen1').offset left: q + 1500 + p
			return
		).on('mouseup', ->
			flag = false
			return
		).on('keydown', (e) ->
			keypressed = e.keyCode
			p = $(this).offset().left
			if keypressed == 38
				hotspots = $(this).find(".hotspot")
				num_hotspots = hotspots.length
				i = 0
				while i < num_hotspots
					if $(hotspots[i]).offset().left > 200 && $(hotspots[i]).offset().left < 300 
						$(hotspots[i]).trigger('click')
						return
					i++
			if keypressed == 37
				$(this).offset left: p - 10
				p = $(this).offset().left
				p = p + offset
				if Math.abs(p) % 1500 <= 100
					if Math.abs(p) % 3000 <= 100 
						p = p - offset
						q = $('#screen1').offset().left - p
						$('#screen2').offset left: q + 1500 + p
					else
						p = p - offset
						q = $('#screen2').offset().left - p
						$('#screen1').offset left: q + 1500 + p
			else if keypressed == 39
				$(this).offset left: p + 10
				if Math.abs(p) % 1500 <= 100
					if Math.abs(p) % 3000 <= 100
						q = $('#screen1').offset().left - p
						$('#screen2').offset left: q - 1500 + p
					else
						q = $('#screen2').offset().left - p
						$('#screen1').offset left: q - 1500 + p
			return
		).on 'click', (e) ->
			$(this).focus()
			return
	return
) jQuery

container = $("#" + DirectPano.pano_div_id)
container.css("overflow","hidden")

container.css({
	'width' : '600px',
	'height' : '550px'
	})
div = $("<div></div>",{id : "drag",tabindex : 0})

div.width(window.innerWidth).height(window.innerHeight)

div1 = $("<div></div>",{id : "screen1"})
div2 = $("<div></div>",{id: "screen2"})

div1.css({
	"width" : "1500px",
	"height": "620px"
	})
div2.css({
	"width" : "1500px",
	"height": "620px",
	})

div.append(div1)
div.append(div2)


container.append(div)

root.pano = new root.Pano(0)
root.pano.load_pano().done ->
	$(document).ready(->
		$("#image-screen1_0").fadeTo(3000, 1)
		$("#image-screen2_0").fadeTo(3000 , 1, ->
			root.hotspot = new root.Hotspot(0)
			root.hotspot.add_hotspots()
			root.annotation = new root.Annotation(0)
			root.annotation.add_annotations()
			return)
		return)
	return

div2.offset({
	top:0,
	left:-1500
})

div.dragabble()
