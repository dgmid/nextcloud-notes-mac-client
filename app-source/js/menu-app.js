'use strict'

const electron = require('electron')
const {Menu, shell} = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipc = electron.ipcMain
const path = require('path')
const name = app.getName()
var about = require('./about.min')



const template = [
	{
		label: name,
		submenu: [
			{
				label: 'About ' + name,
				click() { about.createAbout() }
			},
			{
				type: 'separator'
			},
			{
				label: 'Log in/out to Nextcloud…',
				accelerator: 'Command+Ctrl+Alt+l',
				click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('open-login-modal', 'open-login-modal') }
			
			},
			{
				label: 'Preferences…',
				accelerator: 'Command+,',
				click () { app.emit('open-prefs') }
			
			},
			{
				type: 'separator'
			},
			{
				role: 'services',
				submenu: []
			},
			{
				type: 'separator'
			},
			{
				role: 'hide'
			},
			{
				role: 'hideothers'
			},
			{
				role: 'unhide'
			},
			{
				type: 'separator'
			},
			{
				role: 'quit'
			}
		]
	},
	{
		label: 'Note',
		submenu: [
			{
				label: 'New Note',
				accelerator: 'Cmd+n',
				click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('note', 'new') }
			},
			{
				label: 'Edit / Preview Selected Note',
				accelerator: 'Cmd+e',
				click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('note', 'edit') } 
			},
			{
				label: 'Save Selected Note',
				accelerator: 'Cmd+s',
				click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('note', 'save') } 
			},
			{
				type: 'separator'
			},
			{
				label: 'Toggle Favorite',
				accelerator: 'Cmd+f',
				click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('note', 'favorite') }
			},
			{
				label: 'Export Selected Note as…',
				accelerator: 'Cmd+Alt+e',
				click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('note', 'export') }
			},
			{
				type: 'separator'
			},
			{
				label: 'Delete Selected Note',
				accelerator: 'Cmd+d',
				click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('note', 'delete') }
			},
		]
	},
	{
		label: 'Edit',
		submenu: [
			{
				role: 'undo'
			},
			{
				role: 'redo'
			},
			{
				type: 'separator'
			},
			{
				role: 'cut'
			},
			{
				role: 'copy'
			},
			{
				role: 'paste'
			},
			{
				role: 'pasteandmatchstyle'
			},
			{
				role: 'delete'
			},
			{
				role: 'selectall'
			}
		]
	},
	{
		label: 'Insert Markdown',
		submenu: [
			{
				label: 'Heading 1',
				accelerator: 'Cmd+1',
				click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('markdown', 'h1') }
			},
			{
				label: 'Heading 2',
				accelerator: 'Cmd+2',
				click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('markdown', 'h2') }
			},
			{
				label: 'Heading 3',
				accelerator: 'Cmd+3',
				click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('markdown', 'h3') }
			},
			{
				label: 'Heading 4',
				accelerator: 'Cmd+4',
				click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('markdown', 'h4') }
			},
			{
				label: 'Heading 5',
				accelerator: 'Cmd+5',
				click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('markdown', 'h5') }
			},
			{
				label: 'Heading 6',
				accelerator: 'Cmd+6',
				click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('markdown', 'h6') }
			},
			{
				type: 'separator'
			},
			{
				label: 'Bold',
				accelerator: 'Cmd+b',
				click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('markdown', 'b') }
			},
			{
				label: 'Italic',
				accelerator: 'Cmd+i',
				click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('markdown', 'i') }
			},
			{
				label: 'Strikethrough',
				accelerator: 'Cmd+Alt+d',
				click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('markdown', 'del') }
			},
			{
				type: 'separator'
			},
			{
				label: 'Unordered List',
				accelerator: 'Cmd+l',
				click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('markdown', 'ul') }
			},
			{
				label: 'Ordered List',
				accelerator: 'Cmd+Alt+l',
				click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('markdown', 'ol') }
			},
			{
				type: 'separator'
			},
			{
				label: 'Create Link',
				accelerator: 'Cmd+k',
				click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('markdown', 'a') }
			},
			{
				label: 'Insert Image',
				accelerator: 'Cmd+Alt+i',
				click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('markdown', 'img') }
			},
			{
				type: 'separator'
			},
			{
				label: 'Code',
				accelerator: 'Cmd+Alt+c',
				click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('markdown', 'code') }
			},
			{
				label: 'Blockquote',
				accelerator: 'Cmd+\'',
				click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('markdown', 'blockquote') }
			},
			{
				label: 'Table',
				accelerator: 'Cmd+t',
				click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('markdown', 'table') }
			},
			{
				label: 'Horizontal Line',
				accelerator: 'Cmd+-',
				click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('markdown', 'hr') }
			},
			{
				label: 'Additional <html> Elements',
				submenu: [
					{
						label: '<small> Small',
						click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('html', 'small') }
					},
					{
						label: '<sup> Superscript',
						click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('html', 'sup') }
					},
					{
						label: '<sub> Subscript',
						click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('html', 'sub') }
					},
					{
						label: '<u> Underline',
						click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('html', 'u') }
					},
					{
						label: '<mark> Hilight',
						click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('html', 'mark') }
					},
					{
						type: 'separator'
					},
					{
						label: '<dl> Description List',
						click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('html', 'dl') }
					},
				]
			}
		]
	},
	{
		label: 'View',
		submenu:
		[
			{
				label: 'Zoom In',
				accelerator: 'Cmd+=',
				click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('set-zoom-level', 1) }	
			},
			{
				label: 'Zoom Out',
				accelerator: 'Cmd+-',
				click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('set-zoom-level', -1) }	
			},
			{
				label: 'Actual Size',
				accelerator: 'Cmd+0',
				click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('set-zoom-level', 0) }	
			},
			{
				type: 'separator'
			},
			{
				label: 'Reload',
				accelerator: 'CmdOrCtrl+R',
				click (item, focusedWindow) {
					if (focusedWindow) focusedWindow.reload()
				}
			},
			{
				label: 'Toggle Developer Tools',
				accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
				click (item, focusedWindow) {
					if (focusedWindow) focusedWindow.webContents.toggleDevTools()
				}
			},
			{
				type: 'separator'
			},
			{
				role: 'togglefullscreen'
			}
		]
	},
	{
		role: 'window',
		submenu:
		[
			{
				label: 'Close',
				accelerator: 'CmdOrCtrl+W',
				role: 'close'
			},
			{
				label: 'Minimize',
				accelerator: 'CmdOrCtrl+M',
				role: 'minimize'
			},
			{
				label: 'Zoom',
				role: 'zoom'
			},
			{
				type: 'separator'
			},
			{
				label: 'Bring All to Front',
				role: 'front'
			}
		]
	},
	{
		role: 'help',
		submenu:
		[
			{
				label: 'Nextcloud Notes Mac Client Homepage',
				click () { require('electron').shell.openExternal('https://www.midwinter-dg.com/mac-apps/nextcloud-notes-mac-client.html') }
			}
		]
	}
]
	

const menu = Menu.buildFromTemplate(template)

Menu.setApplicationMenu(menu)
