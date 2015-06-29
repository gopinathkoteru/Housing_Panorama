root = require("./fallback-pano.js")
flag = false
image = 1
keypress = 1
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
			###
			if flag == true
				g = $(this).offset().left + (e.pageX - set_x) * 0.05
				if e.pageX > set_x
					if keypress == 2
						image = image % 2 + 1
				else
					if keypress == 1
						image = image % 2 + 1
				$(this).offset left: g
				p = Math.floor($('#drag').offset().left)
				if keypress == 1
					if Math.abs(p) % 1500 == 0
						if image == 1
							image = 2
							q = $('#screen1').offset().left - p
							$('#screen2').offset left: q - 1500 + p
						else
							image = 1
							q = $('#screen2').offset().left - p
							$('#screen1').offset left: q - 1500 + p
				else
					p = p + 220
					if Math.abs(p) % 1500 == 0
						if image == 1
							image = 2
							q = $('#screen1').offset().left - p
							$('#screen2').offset left: q - 1500 + p
						else
							image = 1
							q = $('#screen2').offset().left - p
							$('#screen1').offset left: q - 1500 + p
			###
			return
		).on('mouseup', ->
			flag = false
			return
		).on('keydown', (e) ->
			keypressed = e.keyCode
			p = $(this).offset().left
			if keypressed == 37
				if keypress == 1
		  			image = image % 2 + 1
				keypress = 2
				$(this).offset left: p - 10
				p = $(this).offset().left
				p = p + 220
				if Math.abs(p) % 1500 == 0
					if image == 1
						image = 2
						p = p - 220
						q = $('#screen1').offset().left - p
						$('#screen2').offset left: q + 1500 + p
					else
						image = 1
						p = p - 220
						q = $('#screen2').offset().left - p
						$('#screen1').offset left: q + 1500 + p
			else if keypressed == 39
				if keypress == 2
					image = image % 2 + 1
				keypress = 1
				$(this).offset left: p + 10
				if Math.abs(p) % 1500 == 0
					if image == 1
						image = 2
						q = $('#screen1').offset().left - p
						$('#screen2').offset left: q - 1500 + p
					else
						image = 1
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

div = $("<div></div>",{id : "drag",tabindex : 0})

div.width(window.innerWidth).height(window.innerHeight)

img1 = $('<img id="screen1" />')
img2 = $('<img id="screen2" />')

img1.css({
	"width" : "1500px",
	"height": "620px"
	})
img2.css({
	"width" : "1500px",
	"height": "620px",
	})

div.append(img1)
div.append(img2)

container.append(div)
pano = new root.Pano()
pano.load_pano(0)
img2.offset({
	top:0,
	left:-1500
})
console.log($("#screen2"))
g = div.dragabble()
