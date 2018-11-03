'use strict'

const Store = require( 'electron-store' )
const store = new Store()
const $ = require( 'jquery' )


let	min 	= 200,
	max 	= 500,
	main 	= 200



//note(@duncanmid): draggable sidebar

$('#divider').mousedown(function (e) {
	
	e.preventDefault()
	
	$(document).mousemove(function (e) {
		
		e.preventDefault()
			
		let x = e.pageX - $('aside').offset().left
		if (x > min && x < max && e.pageX < ($(window).width() - main)) {  
			
			setWidth( x )
			store.set('appInterface.sidebar', x)
		}
	})
})


function setWidth( width ) {
	
	$('aside').css("width", width)
	$('main').css("margin-left", width)
}



$(document).mouseup(function (e) {

	$(document).unbind('mousemove')
})



$(document).ready(function() {
		
	setWidth( store.get('appInterface.sidebar') )
})
