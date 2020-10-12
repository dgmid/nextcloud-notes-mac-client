'use strict'

const electron			= require( 'electron' )
const { Menu, shell }	= require( 'electron' )
const app				= electron.app
const name				= app.name
const Store				= require( 'electron-store' )
const store				= new Store()

const about				= require( './window-about.min' )


module.exports.createMenu = function () {

	const i18n = require( './i18n.min' )
	
	let ordercats = ( store.get( 'appSettings.ordercats' ) === 'asc' ) ? true : false
	
	const template = [
		{
			label: name,
			submenu: [
				{
					label: i18n.t('menu:app.about', 'About {{name}}', {name: name}),
					click() { about.openAbout() }
				},
				{
					type: 'separator'
				},
				{
					label: i18n.t('menu:app.login', 'Log in/out to Nextcloud') + '…',
					accelerator: 'Command+Ctrl+Alt+l',
					click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('open-login-modal', 'open-login-modal') }
				
				},
				{
					label: i18n.t('menu:app.prefs', 'Preferences') + '…',
					accelerator: 'Command+,',
					click () { app.emit('open-prefs') }
				
				},
				{
					type: 'separator'
				},
				{
					label: i18n.t('menu:app.services', 'Services'),
					role: 'services',
					submenu: []
				},
				{
					type: 'separator'
				},
				{
					label: i18n.t('menu:app.hide', 'Hide {{name}}', {name: name}),
					role: 'hide'
				},
				{
					label: i18n.t('menu:app.hideothers', 'Hide Others'),
					role: 'hideothers'
				},
				{
					label: i18n.t('menu:app.showall', 'Show All'),
					role: 'unhide'
				},
				{
					type: 'separator'
				},
				{
					label: i18n.t('menu:app.quit', 'Quit {{name}}', {name: name}),
					role: 'quit'
				}
			]
		},
		{
			label: i18n.t('menu:note.note', 'Note'),
			submenu: [
				{
					label: i18n.t('menu:note.new', 'New Note'),
					accelerator: 'Cmd+n',
					click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('note', 'new') }
				},
				{
					label: i18n.t('menu:note.edit', 'Edit / Preview Selected Note'),
					accelerator: 'Cmd+e',
					click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('note', 'edit') } 
				},
				{
					label: i18n.t('menu:note.save', 'Save Selected Note'),
					accelerator: 'Cmd+s',
					click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('note', 'save') } 
				},
				{
					type: 'separator'
				},
				{
					label: i18n.t('menu:note.open', 'Open in Nextcloud') + '  →',
					accelerator: 'Cmd+o',
					click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('note', 'open') }
				},
				{
					type: 'separator'
				},
				{
					label: i18n.t('menu:note.favorite', 'Toggle Favorite'),
					accelerator: 'Cmd+Alt+f',
					click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('note', 'favorite') }
				},
				{
					label: i18n.t('menu:note.move', 'Move Selected Note to'),
					submenu: [
						{
							label: i18n.t('menu:note.newcat', 'New Category…'),
							accelerator: 'Cmd+Alt+n',
							click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('note', 'newcat') }
						},
						{
							label: i18n.t('menu:note.nocat', 'Uncategorised'),
							accelerator: 'Cmd+u',
							click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('note', 'nocat') }
						}
					]
				},
				{
					type: 'separator'
				},
				{
					label: i18n.t('menu:note.import', 'Import') + '…',
					accelerator: 'Cmd+Alt+Ctrl+i',
					click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('note', 'import') }
				},
				{
					label: i18n.t('menu:note.export', 'Export Selected Note as') + '…',
					accelerator: 'Cmd+Alt+e',
					click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('note', 'export') }
				},
				{
					type: 'separator'
				},
				{
					label: i18n.t('menu:note.delete', 'Delete Selected Note'),
					accelerator: 'Cmd+d',
					click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('note', 'delete') }
				},
				{
					type: 'separator'
				},
				{
					label: i18n.t('menu:note.print', 'Print…'),
					accelerator: 'Cmd+p',
					click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('note', 'print') }
				}
			]
		},
		{
			label: i18n.t('menu:edit.edit', 'Edit'),
			submenu: [
				{
					label: i18n.t('menu:edit.undo', 'Undo'),
					role: 'undo'
				},
				{
					label: i18n.t('menu:edit.redo', 'Redo'),
					role: 'redo'
				},
				{
					type: 'separator'
				},
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
					label: i18n.t('menu:edit.match', 'Paste and Match Style'),
					role: 'pasteandmatchstyle'
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
					label: i18n.t('menu:edit.find', 'Find…'),
					accelerator: 'Cmd+f',
					click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('note', 'find') }
				},
				{
					label: i18n.t('menu:edit.spellcheck', 'Spellcheck'),
					accelerator: 'Cmd+:',
					type: 'checkbox',
					checked: store.get( 'appSettings.spellcheck' ),
					click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('spellcheck', store.get( 'appSettings.spellcheck' )) }
				},
				
			]
		},
		{
			label: i18n.t('menu:markdown.insert', 'Insert Markdown'),
			submenu: [
				{
					label: i18n.t('menu:markdown.h1', 'Heading 1'),
					accelerator: 'Cmd+1',
					click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('markdown', 'h1') }
				},
				{
					label: i18n.t('menu:markdown.h2', 'Heading 2'),
					accelerator: 'Cmd+2',
					click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('markdown', 'h2') }
				},
				{
					label: i18n.t('menu:markdown.h3', 'Heading 3'),
					accelerator: 'Cmd+3',
					click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('markdown', 'h3') }
				},
				{
					label: i18n.t('menu:markdown.h4', 'Heading 4'),
					accelerator: 'Cmd+4',
					click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('markdown', 'h4') }
				},
				{
					label: i18n.t('menu:markdown.h5', 'Heading 5'),
					accelerator: 'Cmd+5',
					click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('markdown', 'h5') }
				},
				{
					label: i18n.t('menu:markdown.h6', 'Heading 6'),
					accelerator: 'Cmd+6',
					click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('markdown', 'h6') }
				},
				{
					type: 'separator'
				},
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
				{
					type: 'separator'
				},
				{
					label: i18n.t('menu:markdown.link', 'Create Link…'),
					accelerator: 'Cmd+k',
					click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('markdown', 'a') }
				},
				{
					label: i18n.t('menu:markdown.image', 'Insert Image'),
					accelerator: 'Cmd+Alt+i',
					click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('markdown', 'img') }
				},
				{
					type: 'separator'
				},
				{
					label: i18n.t('menu:markdown.code', 'Code'),
						submenu: [
							{
								label: i18n.t('menu:markdown.codeblockinline', 'Block / Inline'),
								accelerator: 'Cmd+Alt+c',
								click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('markdown', 'code') }
							},
							{
								type: 'separator'
							},
							{
								label: i18n.t('menu:markdown.javascript', 'Block: Javascript'),
								click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('html', 'javascript') }
							},
							{
								label: i18n.t('menu:markdown.json', 'Block: Json'),
								click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('html', 'json') }
							},
							{
								label: i18n.t('menu:markdown.html', 'Block: HTML'),
								click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('html', 'html') }
							},
							{
								label: i18n.t('menu:markdown.css', 'Block: CSS'),
								click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('html', 'css') }
							},
							{
								label: i18n.t('menu:markdown.scss', 'Block: SCSS'),
								click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('html', 'scss') }
							},
							{
								label: i18n.t('menu:markdown.php', 'Block: PHP'),
								click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('html', 'php') }
							},
							{
								label: i18n.t('menu:markdown.objectivec', 'Block: Objective-C'),
								click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('html', 'objective-c') }
							},
							{
								label: i18n.t('menu:markdown.clike', 'Block: C Like'),
								click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('html', 'c-like') }
							},
							{
								label: i18n.t('menu:markdown.bash', 'Block: BASH'),
								click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('html', 'bash') }
							}
						]
				},
				{
					label: i18n.t('menu:markdown.blockquote', 'Blockquote'),
					accelerator: 'Cmd+\'',
					click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('markdown', 'blockquote') }
				},
				{
					label: i18n.t('menu:markdown.table', 'Table…'),
					accelerator: 'Cmd+t',
					click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('markdown', 'table') }
				},
				{
					label: i18n.t('menu:markdown.hr', 'Horizontal Line'),
					accelerator: 'Cmd+-',
					click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('markdown', 'hr') }
				},
				{
					label: i18n.t('menu:markdown.additional', 'Additional <html> Elements'),
					submenu: [
						{
							label: i18n.t('menu:markdown.small', '<small> Small'),
							click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('html', 'small') }
						},
						{
							label: i18n.t('menu:markdown.sup', '<sup> Superscript'),
							click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('html', 'sup') }
						},
						{
							label: i18n.t('menu:markdown.sub', '<sub> Subscript'),
							click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('html', 'sub') }
						},
						{
							label: i18n.t('menu:markdown.u', '<u> Underline'),
							click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('html', 'u') }
						},
						{
							label: i18n.t('menu:markdown.mark', '<mark> Highlight'),
							click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('html', 'mark') }
						},
						{
							type: 'separator'
						},
						{
							label: i18n.t('menu:markdown.dl', '<dl> Description List'),
							click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('html', 'dl') }
						},
					]
				}
			]
		},
		{
			label: i18n.t('menu:view.view', 'View'),
			submenu:
			[
				{
					label: i18n.t('menu:view.zoomin', 'Zoom In'),
					accelerator: 'Cmd+=',
					click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('set-zoom-level', 1) }	
				},
				{
					label: i18n.t('menu:view.zoomout', 'Zoom Out'),
					accelerator: 'Cmd+-',
					click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('set-zoom-level', -1) }	
				},
				{
					label: i18n.t('menu:view.actualsize', 'Actual Size'),
					accelerator: 'Cmd+0',
					click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('set-zoom-level', 0) }	
				},
				{
					type: 'separator'
				},
				{
					label: i18n.t('menu:view.categories', 'Show Categories'),
					accelerator: 'Cmd+Shift+C',
					type: 'checkbox',
					checked: store.get( 'appInterface.categories' ),
					click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('toggle-categories', '') }
				},
				 {
					 label: i18n.t('menu:view.caticons', 'Show Category Icons'),
					 accelerator: 'Cmd+Ctrl+Shift+C',
					 type: 'checkbox',
					 checked: store.get('appSettings.showcats'),
					 click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('toggle-caticons', '') }
				 },
				{
					label: i18n.t('menu:view.catcount', 'Show Category Count'),
					accelerator: 'Cmd+Alt+Shift+C',
					type: 'checkbox',
					checked: store.get('appSettings.catcount'),
					click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('toggle-catcount', '') }
				},
				{
					type: 'separator'
				},
				{
					label: i18n.t('menu:view.sortcategories', 'Sort Categories by'),
						submenu: [
							{
								label: i18n.t('menu:view.catasc', 'Ascending'),
								accelerator: 'Cmd+]',
								type: 'radio',
								'checked': ordercats,
								click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('category-order', 'asc') }
							},
							{
								label: i18n.t('menu:view.catdesc', 'Descending'),
								accelerator: 'Cmd+[',
								type: 'radio',
								'checked': (ordercats === true) ? false : true,
								click (item, focusedWindow) { if(focusedWindow) focusedWindow.webContents.send('category-order', 'desc') }
							}
						]
				},
				{
					type: 'separator'
				},
				{
					label: i18n.t('menu:view.reload', 'Reload'),
					accelerator: 'CmdOrCtrl+R',
					click (item, focusedWindow) { if (focusedWindow)
						focusedWindow.webContents.send('reload-sidebar', null)
					}
				},
				//@exclude
				{
					label: i18n.t('menu:view.devtools', 'Toggle Developer Tools'),
					accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
					click (item, focusedWindow) { if (focusedWindow) focusedWindow.webContents.toggleDevTools()
					}
				},
				//@end
				{
					type: 'separator'
				},
				{
					label: i18n.t('menu:view.fullscreen', 'Toggle Full Screen'),
					role: 'togglefullscreen'
				}
			]
		},
		{
			label: i18n.t('menu:window.window', 'Window'),
			role: 'window',
			submenu:
			[
				{
					label: i18n.t('menu:window.close', 'Close'),
					accelerator: 'CmdOrCtrl+W',
					role: 'close'
				},
				{
					label: i18n.t('menu:window.minimize', 'Minimize'),
					accelerator: 'CmdOrCtrl+M',
					role: 'minimize'
				},
				{
					label: i18n.t('menu:window.zoom', 'Zoom'),
					role: 'zoom'
				},
				{
					type: 'separator'
				},
				{
					label: i18n.t('menu:window.bringall', 'Bring All to Front'),
					role: 'front'
				}
			]
		},
		{
			label: i18n.t('menu:help.help', 'Help'),
			role: 'help',
			submenu:
			[
				{
					label: i18n.t('menu:help.homepage', 'Nextcloud Notes Mac Client Homepage'),
					click () { require('electron').shell.openExternal('https://www.midwinter-dg.com/mac-apps/nextcloud-notes-client.html') }
				}
			]
		}
	]
	
	
	const menu = Menu.buildFromTemplate(template)
	
	Menu.setApplicationMenu(menu)
}
