'use strict'


const { TouchBar, app, ipcMain } = require('electron')
const path				= require( 'path' )
const nativeImage		= require('electron').nativeImage
const Store				= require( 'electron-store' )
const store				= new Store()
const log				= require( 'electron-log' )

const {
	
	TouchBarButton,
	TouchBarSpacer,
	TouchBarPopover,
	TouchBarSlider,
	TouchBarLabel,
	TouchBarSegmentedControl

} = TouchBar

let previewBar,
	editBar,
	formatBar,
	prefsBar,
	textSlider,
	themeSelect

const themeVals	= ['default', 'light', 'dark']

module.exports = {
	
	createTouchbar: function( window, state ) {
		
		const i18n = require( './i18n.min' )
		
		previewBar = new TouchBar({
			
			escapeItem: new TouchBarButton({
				
				accessibilityLabel: i18n.t('touchbar:preview.edit', 'Edit'),
				icon: nativeImage.createFromPath( path.join(__dirname, '../assets/png/edit_2x.png') ),
				click: () => { window.webContents.send( 'note', 'edit' ) }
			}),
			
			items: [
				
				new TouchBarButton({
					
					accessibilityLabel: i18n.t('touchbar:preview.new', 'New'),
					icon: nativeImage.createFromPath( path.join(__dirname, '../assets/png/new_2x.png') ),
					click: () => { window.webContents.send( 'note', 'new' ) }
				}),
				
				new TouchBarButton({
					
					accessibilityLabel: i18n.t('touchbar:preview.favorite', 'Favorite'),
					icon: nativeImage.createFromPath( path.join(__dirname, '../assets/png/favorite_2x.png') ),
					click: () => { window.webContents.send( 'note', 'favorite' ) }
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
				}),
				
				new TouchBarSpacer({ size: 'small' }),
				
				new TouchBarButton({
					
					accessibilityLabel: i18n.t('touchbar:preview.prefercences', 'Preferences'),
					icon: nativeImage.createFromPath( path.join(__dirname, '../assets/png/preferences_2x.png') ),
					click: () => { app.emit('open-prefs') }
				})
			]
		})
		
		formatBar = new TouchBar({
			
			items: [
				
				new TouchBarButton({
					
					accessibilityLabel: i18n.t('touchbar:format.heading', 'Heading'),
					icon: nativeImage.createFromPath( path.join(__dirname, '../assets/png/heading_2x.png') ),
					click: () => { window.webContents.send('markdown', 'heading') }
				}),
				
				new TouchBarButton({
					
					accessibilityLabel: i18n.t('touchbar:format.bold', 'Bold'),
					icon: nativeImage.createFromPath( path.join(__dirname, '../assets/png/bold_2x.png') ),
					click: () => { window.webContents.send('markdown', 'b') }
				}),
				
				new TouchBarButton({
					
					accessibilityLabel: i18n.t('touchbar:format.italic', 'Italic'),
					icon: nativeImage.createFromPath( path.join(__dirname, '../assets/png/italic_2x.png') ),
					click: () => { window.webContents.send('markdown', 'i') }
				}),
				
				new TouchBarButton({
					
					accessibilityLabel: i18n.t('touchbar:format.ul', 'List'),
					icon: nativeImage.createFromPath( path.join(__dirname, '../assets/png/ul_2x.png') ),
					click: () => { window.webContents.send('markdown', 'ul') }
				}),
				
				new TouchBarButton({
					
					accessibilityLabel: i18n.t('touchbar:format.check', 'Checkbox List'),
					icon: nativeImage.createFromPath( path.join(__dirname, '../assets/png/checkbox_2x.png') ),
					click: () => { window.webContents.send('markdown', 'cl') }
				}),
				
				new TouchBarButton({
					
					accessibilityLabel: i18n.t('touchbar:format.link', 'Link'),
					icon: nativeImage.createFromPath( path.join(__dirname, '../assets/png/link_2x.png') ),
					click: () => { window.webContents.send('markdown', 'a') }
				}),
				
				new TouchBarButton({
					
					accessibilityLabel: i18n.t('touchbar:format.image', 'Image'),
					icon: nativeImage.createFromPath( path.join(__dirname, '../assets/png/image_2x.png') ),
					click: () => { window.webContents.send('markdown', 'img') }
				}),
				
				new TouchBarButton({
					
					accessibilityLabel: i18n.t('touchbar:format.code', 'Code'),
					icon: nativeImage.createFromPath( path.join(__dirname, '../assets/png/code_2x.png') ),
					click: () => { window.webContents.send('markdown', 'code') }
				}),
				
				new TouchBarButton({
					
					accessibilityLabel: i18n.t('touchbar:format.table', 'Table'),
					icon: nativeImage.createFromPath( path.join(__dirname, '../assets/png/table_2x.png') ),
					click: () => { window.webContents.send('markdown', 'table') }
				})
			]
		})
		
		editBar = new TouchBar({
			
			escapeItem: new TouchBarButton({
				
				accessibilityLabel: i18n.t('touchbar:edit.preview', 'Preview'),
				icon: nativeImage.createFromPath( path.join(__dirname, '../assets/png/preview_2x.png') ),
				click: () => { window.webContents.send( 'note', 'edit' ) }
			}),
			
			items: [
			
				new TouchBarButton({
					
					accessibilityLabel: i18n.t('touchbar:edit.save', 'Save'),
					icon: nativeImage.createFromPath( path.join(__dirname, '../assets/png/save_2x.png') ),
					click: () => { window.webContents.send( 'note', 'save' ) }
				}),
				
				new TouchBarPopover({
					
					icon: nativeImage.createFromPath( path.join(__dirname, '../assets/png/format_2x.png') ),
					showCloseButton: true,
					items: formatBar
				})
			]
		})
		
		module.exports.switchTouchbar( window, state )
	},
	
	switchTouchbar: function( window, state ) {
		
		if( state ) {
			
			window.setTouchBar( editBar )
		
		} else {
			
			window.setTouchBar( previewBar )
		}
	},
	
	prefsTouchbar: function( window ) {
		
		const i18n		= require( './i18n.min' )
		const theme		= store.get( 'appInterface.theme' )
		let currentTheme = themeVals.indexOf( theme )
		
		textSlider = new TouchBarSlider({
			
			label: 'Text size',
			value: store.get( 'appSettings.zoom' ),
			minValue: 4,
			maxValue: 16,
			change: ( newValue ) => {
				
				window.webContents.send( 'touchbar-zoom', newValue )
			}
		})
		
		themeSelect = new TouchBarSegmentedControl({
			
			segments: [
				{ label: 'OS Default' },
				{ label: 'Light' },
				{ label: 'Dark' }
			],
			selectedIndex: currentTheme,
			change: ( selectedIndex ) => {
				
				window.webContents.send( 'touchbar-theme', themeVals[selectedIndex] )
			}
		})
		
		prefsBar = new TouchBar({
			
			items: [
				
				textSlider,
				
				new TouchBarSpacer({ size: 'small' }),
				
				new TouchBarLabel({
					
					label: 'Theme'
				}),
				
				themeSelect,
				
				new TouchBarSpacer({ size: 'small' }),
				
				new TouchBarButton({
					
					label: 'Close',
					backgroundColor: '#3479F6',
					click: () => { app.emit( 'close-prefs' ) }
				})
			]
		})
		
		window.setTouchBar( prefsBar )
	}
}


ipcMain.on('update-theme-touchbar', (event, message) => {
	
	let index = themeVals.indexOf( message )
	themeSelect.selectedIndex = index
})
