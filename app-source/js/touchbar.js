'use strict'

const { TouchBar }	= require('electron')
const path			= require( 'path' )
const nativeImage	= require('electron').nativeImage
const log			= require( 'electron-log' )

const { TouchBarButton, TouchBarSpacer } = TouchBar
let previewTouchbar, editTouchbar



module.exports = {
	
	createTouchbar: function( window, state ) {
		
		previewTouchbar = new TouchBar({
			
			items: [
				
				new TouchBarButton({
					
					accessibilityLabel: 'New',
					icon: nativeImage.createFromPath( path.join(__dirname, '../assets/png/new_2x.png') ),
					click: () => { window.webContents.send( 'note', 'new' ) }
				}),
				
				new TouchBarButton({
					
					accessibilityLabel: 'Delete',
					icon: nativeImage.createFromPath( path.join(__dirname, '../assets/png/delete_2x.png') ),
					click: () => { window.webContents.send( 'note', 'delete' ) }
				}),
				
				new TouchBarSpacer({ size: 'small' }),
				
				new TouchBarButton({
					
					accessibilityLabel: 'Export',
					icon: nativeImage.createFromPath( path.join(__dirname, '../assets/png/export_2x.png') ),
					click: () => { window.webContents.send( 'note', 'export' ) }
				}),
				
				new TouchBarButton({
					
					accessibilityLabel: 'Print',
					icon: nativeImage.createFromPath( path.join(__dirname, '../assets/png/print_2x.png') ),
					click: () => { window.webContents.send( 'note', 'print' ) }
				}),
				
				new TouchBarSpacer({ size: 'small' }),
				
				new TouchBarButton({
					
					accessibilityLabel: 'Search',
					icon: nativeImage.createFromPath( path.join(__dirname, '../assets/png/search_2x.png') ),
					click: () => { window.webContents.send( 'note', 'find' ) }
				}),
				
				new TouchBarButton({
					
					accessibilityLabel: 'Categories',
					icon: nativeImage.createFromPath( path.join(__dirname, '../assets/png/categories_2x.png') ),
					click: () => { window.webContents.send( 'toggle-categories', '' ) }
				})
			]
		})
		
		editTouchbar = new TouchBar({
			
			items: [
			
				new TouchBarButton({
					
					accessibilityLabel: 'Save',
					icon: nativeImage.createFromPath( path.join(__dirname, '../assets/png/save_2x.png') ),
					click: () => { window.webContents.send( 'note', 'save' ) }
				})
			]
		})
		
		previewTouchbar.escapeItem = new TouchBarButton({
			
			accessibilityLabel: 'Edit',
			icon: nativeImage.createFromPath( path.join(__dirname, '../assets/png/edit_2x.png') ),
			click: () => { window.webContents.send( 'note', 'edit' ) }
		}),
		
		editTouchbar.escapeItem = new TouchBarButton({
			
			accessibilityLabel: 'Preview',
			icon: nativeImage.createFromPath( path.join(__dirname, '../assets/png/preview_2x.png') ),
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
