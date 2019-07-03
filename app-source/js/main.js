'use strict'

const {app, BrowserWindow, ipcMain, protocol, systemPreferences} = require('electron')
const url = require('url') 
const path = require('path')
const dialog = require('electron').dialog
const Store = require('electron-store')

const marked = require( 'marked' )
const removeMarkdown = require( 'remove-markdown' )


let win,
	loginFlow,
	prefs = null



let store = new Store({
	name: 'config',
	defaults: {
		
		windowBounds: {
			width: 800,
			height: 600,
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
		},
		
		appSettings: {
			
			sortby: 'modified',
			orderby: 'desc',
			zoom: '10',
			cursor: 'start',
			spellcheck: true
			
		},
		
		exportPath: app.getPath('desktop')
	}
})



function createWindow() {
	
	
	let { x, y, width, height } = store.get('windowBounds'),
		theme = systemPreferences.isDarkMode() ? '#393837' : '#ededed'
	
	win = new BrowserWindow({
		show: false,
		x: x,
		y: y,
		width: width,
		height: height,
		titleBarStyle: 'hidden',
		minWidth: 500,
		minHeight: 372,
		backgroundColor: theme,
		webPreferences: {
			devTools: false,
			preload: path.join(__dirname, './preload.min.js'),
			nodeIntegration: true
		},
		icon: path.join(__dirname, '../assets/icon/Icon.icns')
	})
	
	win.setSheetOffset( 24 )
	
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
	
	win.on('closed', () => {
		
		app.quit()
	})
	
	require( './menu-app.min' )
	require( './menu-sidebar.min' )
	
	
	protocol.registerFileProtocol('nc', (request, callback) => {
		
		const url = request.url.split( '&' )
		
		const 	user = url[1].replace('user:', ''),
				pass = url[2].replace('password:', '')
		
		store.set( 'loginCredentials.username', user )
		store.set( 'loginCredentials.password', pass )
		
		loginFlow.close()
		
		win.webContents.send('close-login-modal', 'close-login-modal')
		win.reload()
	
	}, (error) => {
	
		if (error) console.error('Failed to register protocol')
	})
}

app.on('ready', createWindow) 



ipcMain.on('loginflow', (event, message) => {
	
	loginFlow = new BrowserWindow({
		
		width: 800,
		height: 600,
		resizable: false,
		minimizable: false,
		maximizable: false,
		show: false,
		titleBarStyle: 'hidden',
		backgroundColor: '#0082c9',
		webPreferences: {
			devTools: false,
			nodeIntegration: false
		}
	})
	
	
	loginFlow.loadURL( message + '/index.php/login/flow' , {
		
		userAgent: 'Nextcloud Notes Client - Macintosh',
		extraHeaders: 'OCS-APIRequest: true'
	})
	
	
	loginFlow.once('ready-to-show', () => {
		
		loginFlow.show()
	})
})



app.on('open-prefs', () => {
	
	if( prefs === null ) {
		
		let theme = systemPreferences.isDarkMode() ? '#393837' : '#ededed'
		
		prefs = new BrowserWindow({
			
			width: 548,
			height: 330,
			resizable: false,
			minimizable: false,
			maximizable: false,
			show: false,
			backgroundColor: theme,
			webPreferences: {
				devTools: false,
				preload: path.join(__dirname, './preload.min.js'),
				nodeIntegration: true
			},
		})
		
		
		prefs.loadURL(url.format ({ 
			
			pathname: path.join(__dirname, '../html/prefs.html'), 
			protocol: 'file:', 
			slashes: true 
		}))
		
		
		prefs.once('ready-to-show', () => {
			
			prefs.show()
		})
	
		prefs.on('close', () => {
			prefs = null
		})
	}
})



ipcMain.on('reload-sidebar', () => {
	
	win.webContents.send('reload-sidebar', null)	
})


ipcMain.on('set-zoom-slider', (event, message) => {
	
	win.webContents.send('set-zoom-slider', message)	
})


ipcMain.on('spellcheck', (event, message) => {
	
	win.webContents.send('spellcheck', message)	
})
