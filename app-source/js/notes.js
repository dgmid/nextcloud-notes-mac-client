'use strict'

const i18n = require( './i18n.min' )

const { ipcRenderer }	= require( 'electron' )
const Store				= require( 'electron-store' )
const store				= new Store()
const $					= require( 'jquery' )
const removeMarkdown	= require( 'remove-markdown' )

const fetch				= require( './fetch.min' )
const dates				= require( './dates.min' )
const categories		= require( './categories.min' )



module.exports = {
	
	listNotes: function( array, sidebar ) {
		
		if( sidebar !== null ) database.set('notes', array)
		
		let sortby 	= store.get( 'appSettings.sortby' ),
			orderby = store.get( 'appSettings.orderby' ),
			noteList = '',
			allCats = []
		
		if( array.length > 1 ) {
			
			array.sort(function(x, y) {
				
				var itemX = x[sortby]
				var itemY = y[sortby]
				
				if( orderby === 'asc' ) {
					
					return (itemX < itemY) ? -1 : (itemX > itemY) ? 1 : 0
				
				} else {
					
					return (itemX > itemY) ? -1 : (itemX < itemY) ? 1 : 0
				}
			})
		}
		
		for ( let item of array ) {
			
			noteList += module.exports.addSidebarEntry( item )
			allCats.push( item.category )
		}
		
		$('#sidebar').html( noteList )
		
		if( sidebar ) {
			
			module.exports.getSelected( 'sidebar' )
		
		} else {
			
			module.exports.getSelected()
		}
		
		categories.categoryList( allCats )
		categories.selectCategory( store.get('categories.selected') )
	},
	
	addSidebarEntry: function( item ) {
		
		let theDate = new Date( item.modified ),
			formattedDate = dates.sidebarDate( theDate.getTime() )
		
		let	catClass = ( item.category ) ? categories.sanitizeCategory( item.category ) : '##none##'
		
		let	theCat = ( item.category ) ? item.category : i18n.t('app:categories.none', 'Uncategorised')
		
		let plainTxt = removeMarkdown( item.content.replace(/(!\[.*\]\(.*\)|<[^>]*>|>|<)/g, ''))
		
		if( plainTxt ) {
	
			plainTxt = plainTxt.substr(0, 120).slice(item.title.length)
			
		} else {
			
			plainTxt = i18n.t('app:sidebar.notext', 'No additional text')
		}
		
		let entry = `<li data-id="${item.id}">
						<button data-id="${item.id}" data-title="${item.title}" data-content="" data-catid="${catClass}" data-category="${item.category}" data-favorite="${item.favorite}">
							<span class="side-title">${item.title}</span>
							<span class="side-text">${formattedDate}&nbsp;&nbsp;<span class="excerpt">${plainTxt}</span></span>
							<span class="side-cat">${theCat}</span>
						</button>
					</li>`
		
		return entry
	},
	
	getSelected: function( sidebar ) {
		
		let selected = store.get( 'appInterface.selected' )
		
		if( selected ) {
			
			$(`button[data-id="${selected}"]`).addClass('selected').parent().prev().children().addClass('above-selected')
			
			if( !sidebar ) {
				
				fetch.apiCall( 'single', selected, null, function( call, id, body, notes ) {
					
					fetchResult( call, id, body, notes )
				})
			}
		}
	},
	
	displayNote: function( note ) {
		
	}
}


function displayNote( note ) {
	
	$('#edit').removeClass('editing')
	
	$('#time').html( dates.titlebarDate( note.modified ) )
	
	if( easymde ) {
		
		easymde.toTextArea()
		easymde = null
	}
	
	easymde = new EasyMDE( editor.easymdeSetup )
	
	toggleSpellcheck( store.get('appSettings.spellcheck') )	
	
	// register right click for notes menu
	
	easymde.codemirror.on( 'mousedown', function( instance, event ) {
		
		if( event.which === 3 ) {
			
			let selection = easymde.codemirror.doc.getSelection()
			
			ipcRenderer.send('show-notes-menu',
				{
					selection: selection,
					preview: false
				}
			)
			return
		}
	})
	
	$('#note').attr('data-id', note.id)
	easymde.value( note.content )
	easymde.codemirror.clearHistory()
	easymde.togglePreview()
	setCheckLists()
	
	$('time').fadeIn('fast')
	$('.loader').fadeOut(400, function() { $(this).remove() } )
	
	if( firstLoad === true ) {
		
		const check = require( './version.min' )
		firstLoad = 1
		check.appVersion()
	}
}
