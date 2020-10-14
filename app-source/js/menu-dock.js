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
	
	let selectedNote 	= store.get( 'appInterface.selected' ),
		selectedCat 	= store.get( 'categories.selected' )
	
	itemAll.label = i18n.t('dock:categories.all', 'All Notes')
	itemFav.label = i18n.t('dock:categories.favorite', 'Favorites')
	itemNone.label = i18n.t('dock:categories.none', 'Uncategorised')
	
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
	
	let dockMenu = new Menu()
	
	if( selectedNote ) {
		
		dockMenu.append( new MenuItem({
				
				label: i18n.t('dock:open', 'Open in Nextcloud') + ' →',
				click () { win.webContents.send('note', 'open') }
			})
		)
		
		dockMenu.append( new MenuItem({type: 'separator'}) )
	}
	
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
