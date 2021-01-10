'use strict'

const electron = require( 'electron' )
const {
	app,
	Menu,
	MenuItem,
	ipcMain
}	= require('electron')
const log		= require( 'electron-log' ) // <- delete this
const Store	= require( 'electron-store' )
const store	= new Store()


let itemAll = new MenuItem({type: 'radio'}),
	itemFav = new MenuItem({type: 'radio'}),
	itemNone = new MenuItem({type: 'radio'}),
	itemOpen = new MenuItem({type: 'normal'})


module.exports.createMenu = function ( win ) {
	
	const i18n = require( './i18n.min' )
	
	let selectedNote 	= store.get( 'appInterface.selected' ),
		selectedCat 	= store.get( 'categories.selected' )
	
	itemAll.label = i18n.t('dock:categories.all', 'All Notes')
	itemFav.label = i18n.t('dock:categories.favorite', 'Favorites')
	itemNone.label = i18n.t('dock:categories.none', 'Uncategorised')
	itemOpen.label = i18n.t('dock:open', 'Open in Nextcloud') + ' →'
	
	itemAll.checked = (selectedCat == '##all##') ? true : false
	itemFav.checked = (selectedCat == '##fav##') ? true : false
	itemNone.checked = (selectedCat == '##none##') ? true : false
	
	itemAll.click = () => {
		
		itemAll.checked = true
		win.webContents.send('dock-category', '##all##')
	}
	
	itemFav.click = () => {
		
		itemFav.checked = true
		win.webContents.send('dock-category', '##fav##')
	}
	
	itemNone.click = () => {
		
		itemNone.checked = true
		win.webContents.send('dock-category', '##none##')
	}
	
	itemOpen.enabled = false
	itemOpen.click = () => { win.webContents.send('note', 'open') }
	
	
	//if( selectedNote ) itemOpen.visible = true
	
	let dockMenu = new Menu()
	
	dockMenu.append( itemOpen )
	
	dockMenu.append( new MenuItem({type: 'separator'}) )
	
	dockMenu.append( itemAll )
	dockMenu.append( itemFav )
	dockMenu.append( itemNone )
	
	app.dock.setMenu( dockMenu )
}


ipcMain.on('dock-update-cats', (event, message) => {
	
	switch( message ) {
		
		case '##all##':
			itemAll.checked = true
		break
		
		case '##fav##':
			itemFav.checked = true
		break
		
		default:
			itemNone.checked = true
	}
})


ipcMain.on('dock-update-openitem', (event, message) => {
	
	log.info(message)
	log.info(typeof message)
	
	itemOpen.enabled = message
})
