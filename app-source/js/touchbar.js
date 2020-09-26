'use strict'


const { TouchBar }	= require('electron')
const path			= require( 'path' )
const nativeImage	= require('electron').nativeImage
const log			= require( 'electron-log' )

const { TouchBarButton, TouchBarSpacer } = TouchBar
let previewTouchbar, editTouchbar


module.exports = {
	
	createTouchbar: function( window, state ) {
		
		const i18n = require( './i18n.min' )
		
		previewTouchbar = new TouchBar({
			
			items: [
				
				new TouchBarButton({
					
					accessibilityLabel: i18n.t('touchbar:preview.new', 'New'),
					icon: nativeImage.createFromPath( path.join(__dirname, '../assets/png/new_2x.png') ),
					click: () => { window.webContents.send( 'note', 'new' ) }
				}),
				
				new TouchBarButton({
					
					accessibilityLabel: i18n.t('touchbar:preview.delete', 'Delete'),
					icon: nativeImage.createFromPath( path.join(__dirname, '../assets/png/delete_2x.png') ),
					click: () => { window.webContents.send( 'note', 'delete' ) }
				}),
				
				new TouchBarSpacer({ size: 'small' }),
				
				new TouchBarButton({
					
					accessibilityLabel: i18n.t('touchbar:preview.export', 'Export'),
					icon: nativeImage.createFromPath( path.join(__dirname, '../assets/png/export_2x.png') ),
					click: () => { window.webContents.send( 'note', 'export' ) }
				}),
				
				new TouchBarButton({
					
					accessibilityLabel: i18n.t('touchbar:preview.print', 'Print'),
					icon: nativeImage.createFromPath( path.join(__dirname, '../assets/png/print_2x.png') ),
					click: () => { window.webContents.send( 'note', 'print' ) }
				}),
				
				new TouchBarSpacer({ size: 'small' }),
				
				new TouchBarButton({
					
					accessibilityLabel: i18n.t('touchbar:preview.search', 'Search'),
					icon: nativeImage.createFromPath( path.join(__dirname, '../assets/png/search_2x.png') ),
					click: () => { window.webContents.send( 'note', 'find' ) }
				}),
				
				new TouchBarButton({
					
					accessibilityLabel: i18n.t('touchbar:preview.categories', 'Categories'),
					icon: nativeImage.createFromPath( path.join(__dirname, '../assets/png/categories_2x.png') ),
					click: () => { window.webContents.send( 'toggle-categories', '' ) }
				})
			]
		})
		
		editTouchbar = new TouchBar({
			
			items: [
			
				new TouchBarButton({
					
					accessibilityLabel: i18n.t('touchbar:edit.save', 'Save'),
					icon: nativeImage.createFromPath( path.join(__dirname, '../assets/png/save_2x.png') ),
					click: () => { window.webContents.send( 'note', 'save' ) }
				})
			]
		})
		
		previewTouchbar.escapeItem = new TouchBarButton({
			
			accessibilityLabel: i18n.t('touchbar:preview.edit', 'Edit'),
			icon: nativeImage.createFromPath( path.join(__dirname, '../assets/png/edit_2x.png') ),
			click: () => { window.webContents.send( 'note', 'edit' ) }
		}),
		
		editTouchbar.escapeItem = new TouchBarButton({
			
			accessibilityLabel: i18n.t('touchbar:edit.preview', 'Preview'),
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
