'use strict'

const Store		= require( 'electron-store' )
const store		= new Store()
const $			= require( 'jquery' )



module.exports = {
	
	sanitizeCategory: function( category ) {
		
		category = category.toLowerCase()
		category = category.replace( 'ß', 'ss' )
		category = category.normalize( 'NFD' ).replace( /[\u0300-\u036f]/g, '' )
		category = category.replace( /[^0-9a-z ]/gi, '' )
		category = category.replace( /\s+/g, '_' )
		
		return category
	
	},
	
	categoryList: function( array ) {
		
		let compressed = [],
		copy = array.slice(0),
		orderby = store.get( 'appSettings.ordercats' ),
		results = []		
		if( orderby == null ) orderby = 'asc'
		
		$('#categories').empty().addClass( orderby )
		
		for (var i = 0; i < array.length; i++) {
		
			var theCount = 0
			
			for (var w = 0; w < copy.length; w++) {
				
				if (array[i] == copy[w]) {
					
					theCount++
					delete copy[w]
				}
			}
			
			if (theCount > 0) {
				
				var a = new Object()
				a.id 	= module.exports.sanitizeCategory( array[i] )
				a.value = array[i]
				a.count = theCount
				compressed.push(a)
			}
		}
		
		if( compressed.length > 1 ) {
			
			compressed.sort(function(x, y) {
				
				var itemX = x['id']
				var itemY = y['id']
				
				return (itemX < itemY) ? -1 : (itemX > itemY) ? 1 : 0
			})
		}
		
		for ( let item of compressed ) {
			
			let theItem		= item.value,
				theCount	= item.count,
				theID 		= item.id,
				showcount	= (store.get( 'appSettings.catcount' )) ? ' show' : ''
			
			if( theItem.length > 0 ) {
			
				results.push( {
					"item": theItem ,
					"catID": theID,
					"count": theCount
				} )
				
				$('#categories').append(`<li><button class="custom" data-catid="${theID}" data-category="${theItem}" title="${theItem}"><span class="cat-name">${theItem}</span><span class="cat-count${showcount}">${theCount}</span></button></li>`)
			}
		}
		
		$(`.categories button[data-catid="${store.get('categories.selected')}"]`).addClass( 'selected' )
		
		module.exports.showHideCategoryIcons()
		store.set( 'categories.list', results )
	
	},
	
	showHideCategoryIcons: function () {
		
		if( $('.categories button.selected').hasClass( 'custom' ) ) {
			
			$('#sidebar').addClass( 'hidecats' )
			
		} else {
			
			$('#sidebar').removeClass( 'hidecats' )
		}
	},
	
	selectCategory: function( catid ) {
		
		$('#search').val( '' )
		$('#clear').hide()
		$('#result').empty().hide()
		
		switch( catid ) {
			
			case '##all##':
				 
				$(`#sidebar li`).show()
				
			break
			
			case '##fav##':
				
				$(`#sidebar li`).hide()
				$(`#sidebar button[data-favorite='true']`).parent('li').show()
				
			break
			
			default:
				
				$(`#sidebar li`).hide()
				$(`#sidebar button[data-catid='${catid}']`).parent('li').show()	
			break
		}
	},
	
	toggleCategories: function( state ) {
		
		$('#sidebar').toggleClass( 'showcats' )
	}
}
