'use strict'

const { TouchBar } = require('electron')
const log	= require( 'electron-log' )

const { TouchBarButton, TouchBarSpacer } = TouchBar


module.exports.createTouchbar = function( window, state ) {
	
	const newNote = new TouchBarButton({
		
		label: 'New Note',
		click: () => { window.webContents.send( 'note', 'new' ) }
	})
	
	const previewTouchbar = new TouchBar({
		
		items: [
			
			new TouchBarButton({
				
				label: 'Edit Note',
				click: () => { window.webContents.send( 'note', 'edit' ) }
			}),
			
			new TouchBarSpacer({ size: 'small' }),
			
			new TouchBarButton({
				
				label: 'Export Note',
				click: () => { window.webContents.send( 'note', 'export' ) }
			}),
			
			new TouchBarButton({
				
				label: 'Print Note',
				click: () => { window.webContents.send( 'note', 'print' ) }
			}),
			
			new TouchBarSpacer({ size: 'large' }),
			
			new TouchBarButton({
				
				label: 'Search',
				click: () => { window.webContents.send( 'note', 'find' ) }
			}),
			
			new TouchBarButton({
				
				label: 'Sidebar',
				click: () => { window.webContents.send( 'toggle-categories', '' ) }
			})
		]
	})
	
	const editTouchbar = new TouchBar({})
	
	previewTouchbar.escapeItem = newNote
	editTouchbar.escapeItem = newNote
	
	if( state ) {
		
		window.setTouchBar( editTouchbar )
	
	} else {
		
		window.setTouchBar( previewTouchbar )
	}
}
