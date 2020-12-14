'use strict'

const { app, BrowserWindow, ipcMain, protocol} = require('electron')
const url		= require( 'url' )
const path		= require( 'path' )
const Store		= require( 'electron-store' )
const log		= require( 'electron-log' )

const menuApp			= require( './menu-app.min' )
const menuSidebar		= require( './menu-sidebar.min' )
const menuNotes			= require( './menu-notes.min' )
const menuDock			= require( './menu-dock.min' )
const ncLoginflow		= require( './window-nc-loginflow.min' )
const touchbar			= require( './touchbar.min' )

let win,
	willQuit = false

let store = new Store({
	name: 'config',
	defaults: {
		
		windowBounds: {
			
			width: 1000,
			height: 680,
			x: 0,
			y: 0
		},
		
		loginCredentials: {
			
			server: '',
			username: '',
			password: ''
		},
		
		appInterface: {
			
			sidebar: null,
			selected: null,
			categories: true,
			theme: 'default'
		},
		
		appSettings: {
			
			sortby: 'modified',
			orderby: 'desc',
			zoom: 10,
			cursor: 'start',
			spellcheck: true,
			showcats: true,
			ordercats: 'asc',
			catcount: false,
			nocertificate: false,
			stopwords: false,
			stemming: false,
			editing: false
		},
		
		categories: {
			
			selected: '##all##',
			list: null
		},
		
		exportPath: app.getPath('desktop')
	}
})


module.exports.openWindow = function() {
	
	let { x, y, width, height } = store.get('windowBounds')
	
	win = new BrowserWindow({
		show: false,
		x: x,
		y: y,
		width: width,
		height: height,
		minWidth: 800,
		minHeight: 372,
		title: '',
		titleBarStyle: 'hidden',
		trafficLightPosition: {
			x: 20,
			y: 35
		},
		vibrancy: 'sidebar',
		webPreferences: {
			devTools: true,
			nodeIntegration: true,
			enableRemoteModule: true,
			preload: path.join(__dirname, './preload.min.js'),
			spellcheck: true
		}
	})
	
	function saveWindowBounds() {
		
		store.set('windowBounds', win.getBounds())
	}
	
	win.loadURL(url.format ({ 
		
		pathname: path.join(__dirname, '../html/app.html'), 
		protocol: 'file:', 
		slashes: true
	}))
	
	win.once('ready-to-show', () => {
		
		win.show()
	})
	
	win.on('resize', saveWindowBounds)
	win.on('move', saveWindowBounds)

	win.on('blur', () => {
		
		win.setVibrancy( 'window' )
		win.webContents.send('window', 'blur')
	})
	
	win.on('focus', () => {
		
		win.setVibrancy( 'sidebar' )
		win.webContents.send('window', 'focus')
	})
	
	win.on('close', (e) => {
		
		if(willQuit === false) {
			e.preventDefault()
			win.webContents.send('before-quit', '')
			
			willQuit = true
		}
	})
	
	win.webContents.on('did-fail-load', () => {
		
		log.error( `main window did not load` )
	})
	
	win.webContents.on( 'crashed', ( event, killed ) => {
		
		log.info( `main window has crashed:` )
		log.error( event )
	})
	
	win.on( 'unresponsive', () => {
		
		log.info( `main window is not responding…` )
	})
	
	win.on( 'responsive', () => {
		
		log.info( `main window is responding` )
	})
	
	protocol.registerFileProtocol('nc', (request) => {
		
		if( request.url ) {
		
			const url = request.url.split( '&' )
			
			const 	user = url[1].replace('user:', ''),
					pass = url[2].replace('password:', '')
			
			store.set( 'loginCredentials.username', decodeURIComponent(user) )
			store.set( 'loginCredentials.password', pass )
			
			ncLoginflow.closeLoginflow()
			
			win.webContents.send('close-login-modal', 'close-login-modal')
			win.webContents.send('reload-sidebar', 'login')
			
		} else {
			
			log.error('Failed to register nc protocol')
		}
	})
	
	menuApp.createMenu()
	menuSidebar.createMenu()
	menuNotes.createMenu()
	menuDock.createMenu( win )
}


module.exports.windowWillQuit = function() {
	
	return willQuit
}


app.whenReady().then( () => {
	
	touchbar.createTouchbar( win, store.get( 'appSettings.editing' ) )
})


ipcMain.on('update-touchbar', (event, message) => {
	
	touchbar.switchTouchbar( win, message )
})


ipcMain.on('update-titlebar', (event, message) => {
	
	win.setTitle( message )
})


ipcMain.on('new-category', (event, message) => {
	
	win.webContents.send('context-category', message)
})


ipcMain.on('hyperlink', (event, message) => {
	
	win.webContents.send('add-hyperlink', message)
})


ipcMain.on('table', (event, message) => {
	
	win.webContents.send('add-table', message)
})


ipcMain.on('reload-sidebar', (event, message) => {
	
	win.webContents.send('reload-sidebar', message)
})


ipcMain.on('set-zoom-slider', (event, message) => {
	
	win.webContents.send('set-zoom-slider', message)
})
