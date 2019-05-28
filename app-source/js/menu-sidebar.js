'use strict'

let i18n = require('./i18n.min')
const electron = require( 'electron' )
const { app } = require( 'electron' )
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const MenuItem = electron.MenuItem
const ipc = electron.ipcMain

const Store = require( 'electron-store' )
const store = new Store()



ipc.on('show-sidebar-menu', ( event, message ) => {
	
	let sidebarMenuTemplate
	
	if( message) {
		
		let favorite = (message.favorite == 'true') ? true : false
		
		sidebarMenuTemplate = [
			{
				label: i18n.t('sidebarmenu:new', 'New Note'),
				click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('note', 'new') }
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
				label: i18n.t('sidebarmenu:delete', 'Delete'),
				click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('context-delete', message.id) }
			},
		]
		
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
	sidebarMenu.popup( win )
})
