'use strict'

const { TouchBar } = require('electron')
const log	= require( 'electron-log' )

const { TouchBarButton, TouchBarSpacer } = TouchBar
let previewTouchbar, editTouchbar



module.exports = {
	
	createTouchbar: function( window, state ) {
		
		previewTouchbar = new TouchBar({
			
			items: [
				
				new TouchBarButton({
					
					label: 'New',
					click: () => { window.webContents.send( 'note', 'new' ) }
				}),
				
				new TouchBarButton({
					
					label: 'Delete',
					click: () => { window.webContents.send( 'note', 'delete' ) }
				}),
				
				new TouchBarSpacer({ size: 'small' }),
				
				new TouchBarButton({
					
					label: 'Export',
					click: () => { window.webContents.send( 'note', 'export' ) }
				}),
				
				new TouchBarButton({
					
					label: 'Print',
					click: () => { window.webContents.send( 'note', 'print' ) }
				}),
				
				new TouchBarSpacer({ size: 'small' }),
				
				new TouchBarButton({
					
					label: 'Search',
					click: () => { window.webContents.send( 'note', 'find' ) }
				}),
				
				new TouchBarButton({
					
					label: 'Categories',
					click: () => { window.webContents.send( 'toggle-categories', '' ) }
				})
			]
		})
		
		editTouchbar = new TouchBar({
			
			items: [
			
				new TouchBarButton({
					
					label: 'Save',
					click: () => { window.webContents.send( 'note', 'save' ) }
				})
			]
		})
		
		previewTouchbar.escapeItem = new TouchBarButton({
			
			label: 'Edit',
			click: () => { window.webContents.send( 'note', 'edit' ) }
		}),
		
		editTouchbar.escapeItem = new TouchBarButton({
			
			label: 'Preview',
			click: () => { window.webContents.send( 'note', 'edit' ) }
		})
		
		module.exports.switchTouchbar( window, state )
	},
	
	switchTouchbar: function( window, state ) {
		
		if( state ) {
			
			window.setTouchBar( editTouchbar )
		
		} else {
			
			window.setTouchBar( previewTouchbar )
		}
	}
}
