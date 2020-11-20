'use strict'

const {
	app,
	BrowserWindow,
	Menu,
	ipcMain
} = require( 'electron' )
const log	= require( 'electron-log' )
const Store = require( 'electron-store' )
const store = new Store()


module.exports.createMenu = function () {
	
	let i18n = require('./i18n.min')
	
	let notesMenuTemplate
	
	ipcMain.on('show-notes-menu', ( event, message ) => {
		
		if( message.preview ) {
			
			notesMenuTemplate = [
				
				{
					label: i18n.t('menu:edit.copy', 'Copy'),
					role: 'copy'
				},
				{
					label: i18n.t('menu:edit.selectall', 'Select All'),
					accelerator: 'Cmd+a',
					click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('note', 'selectall') }
				},
				{
					type: 'separator'
				},
				{
					label: i18n.t('menu:note.print', 'Print…'),
					accelerator: 'Cmd+p',
					click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('note', 'print') }
				},
				{
					type: 'separator'
				},
				{
					label: i18n.t('notecontextmenu:speech.speech', 'Speech'),
					submenu: [
						{
							label: i18n.t('notecontextmenu:speech.start', 'Start Speaking'),
							role: 'startSpeaking'
						},
						{
							label: i18n.t('notecontextmenu:speech.stop', 'Stop Speaking'),
							role: 'stopSpeaking'
						}
					]
				}
			]
			
		} else {
			
			let enable = (message.selection.length === 0 ) ? false : true
			
			notesMenuTemplate = [
				
				{
					label: i18n.t('menu:edit.cut', 'Cut'),
					role: 'cut'
				},
				{
					label: i18n.t('menu:edit.copy', 'Copy'),
					role: 'copy'
				},
				{
					label: i18n.t('menu:edit.paste', 'Paste'),
					role: 'paste'
				},
				{
					type: 'separator'
				},
				{
					label: i18n.t('menu:edit.delete', 'Delete'),
					role: 'delete'
				},
				{
					label: i18n.t('menu:edit.selectall', 'Select All'),
					accelerator: 'Cmd+a',
					click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('note', 'selectall') }
				},
				{
					type: 'separator'
				},
				{
					label: i18n.t('notecontextmenu:paragraph', 'Paragraph Styles'),
					submenu: [
						{
							label: i18n.t('menu:markdown.bold', 'Bold'),
							accelerator: 'Cmd+b',
							click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('markdown', 'b') }
						},
						{
							label: i18n.t('menu:markdown.italic', 'Italic'),
							accelerator: 'Cmd+i',
							click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('markdown', 'i') }
						},
						{
							label: i18n.t('menu:markdown.strike', 'Strikethrough'),
							accelerator: 'Cmd+Shift+d',
							click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('markdown', 'del') }
						},
						{
							type: 'separator'
						},
						{
							label: i18n.t('menu:markdown.ul', 'Unordered List'),
							accelerator: 'Cmd+l',
							click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('markdown', 'ul') }
						},
						{
							label: i18n.t('menu:markdown.ol', 'Ordered List'),
							accelerator: 'Cmd+Alt+l',
							click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('markdown', 'ol') }
						},
						{
							label: i18n.t('menu:markdown.cl', 'Checkbox List'),
							accelerator: 'Cmd+Alt+Shift+l',
							click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('markdown', 'cl') }
						},
					]
				},
				{
					type: 'separator'
				},
				{
					label: i18n.t('notecontextmenu:entities.entities', 'Encode / Decode Entites'),
					submenu: [
						{
							label: i18n.t('notecontextmenu:entities.encode', 'Encode Entities'),
							enabled: enable,
							click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('context-note-encode', message.selection) }
						},
						{
							label: i18n.t('notecontextmenu:entities.decode', 'Decode Entities'),
							enabled: enable,
							click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('context-note-decode', message.selection) }
						}
					]
				},
				{
					label: i18n.t('notecontextmenu:transformations.transformations', 'Transformations'),
					submenu: [
						{
							label: i18n.t('notecontextmenu:transformations.upper', 'Make Uppercase'),
							enabled: enable,
							click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('context-note-upper', message.selection) }
						},
						{
							label: i18n.t('notecontextmenu:transformations.lower', 'Make Lowercase'),
							enabled: enable,
							click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('context-note-lower', message.selection) }
						},
						{
							label: i18n.t('notecontextmenu:transformations.caps', 'Capitalize'),
							enabled: enable,
							click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('context-note-caps', message.selection) }
						}
					]
				}
			]
		}
		
		const notesMenu = Menu.buildFromTemplate( notesMenuTemplate )
		
		notesMenu.popup()
	})
}
