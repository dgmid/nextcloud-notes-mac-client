'use strict'

const electron = require( 'electron' )
const {
	app,
	Menu,
	MenuItem,
	ipcMain
}	= require('electron')

const Store	= require( 'electron-store' )
const store	= new Store()


let itemAll = new MenuItem({type: 'radio'}),
	itemFav = new MenuItem({type: 'radio'}),
	itemNone = new MenuItem({type: 'radio'})


module.exports.createMenu = function ( win ) {
	
	const i18n = require( './i18n.min' )
	
	let selected = store.get( 'categories.selected' )
	
	itemAll.label = 'All Notes'
	itemFav.label = 'Favorites'
	itemNone.label = 'Uncategorised'
	
	itemAll.checked = (selected == '##all##') ? true : false
	itemFav.checked = (selected == '##fav##') ? true : false
	itemNone.checked = (selected == '##none##') ? true : false
	
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
	
	let dockMenu = new Menu()
	
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
