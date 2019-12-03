'use strict'

let i18n = require('./i18n.min')
const {
	app,
	BrowserWindow,
	Menu,
	MenuItem,
	ipcMain
} = require( 'electron' )
const log	= require( 'electron-log' )
const Store = require( 'electron-store' )
const store = new Store()


let sidebarcontextmenu,
	sidebarMenuTemplate

ipcMain.on('show-sidebar-menu', ( event, message ) => {
	
	if( message) {
		
		let categories = store.get( 'categories.list' ),
			favorite = (message.favorite == 'true') ? true : false,
			noCategory = (message.catID == '##none##') ? false : true
		
		sidebarMenuTemplate = [
			{
				label: i18n.t('sidebarmenu:delete', 'Delete'),
				click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('context-delete', message.id) }
			},
			{
				type: 'separator'
			},
			{
				label: i18n.t('sidebarmenu:favorite', 'Favorite'),
				type: 'checkbox',
				checked: favorite,
				click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('context-favorite', message) }
			},
			{
				label: i18n.t('sidebarmenu:export', 'Export as') + '…',
				click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('context-export', message.id) }
			},
			{
				type: 'separator'
			},
			{
				label: i18n.t('sidebarmenu:move', 'Move to'),
				submenu: []
			},
			{
				type: 'separator'
			},
			{
				label: i18n.t('sidebarmenu:new', 'New Note'),
				click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('note', 'new') }
			}
		]
		
		sidebarMenuTemplate[5].submenu.push({
			label: i18n.t('sidebarmenu:newcategory', 'New Category…'),
			click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('context-newcategory', message.id) }
		},
		{
			type: 'separator'
		})
		
		for( let category of categories ) {
			
			let status = (message.catID == category.catID) ? false : true
			
			sidebarMenuTemplate[5].submenu.push({
				label: category.item,
				click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('context-category', {'id': message.id, 'category': category.item}) },
				enabled: status,
				type: 'radio',
				checked: ( status  === false ) ? true : false
			})
		}
		
		sidebarMenuTemplate[5].submenu.push({
			type: 'separator'
		},
		{
			label: i18n.t('sidebarmenu:none', 'Uncategorised'),
			click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('context-category', {'id': message.id, 'category': ''}) },
			enabled: noCategory
		})
		
	} else {
		
		sidebarMenuTemplate = [
			{
				label: i18n.t('sidebarmenu:new', 'New Note'),
				click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('note', 'new') }
			}
		]
	}
		
	const sidebarMenu = Menu.buildFromTemplate( sidebarMenuTemplate )
	
	const win = BrowserWindow.fromWebContents( event.sender )
	sidebarcontextmenu = sidebarMenu.popup( win )
})
