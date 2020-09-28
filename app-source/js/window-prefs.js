'use strict'

const { app, BrowserWindow } = require('electron')
const url		= require( 'url' )
const path		= require( 'path' )
const log		= require( 'electron-log' )

const touchbar	= require( './touchbar.min' )

let prefs = null


module.exports.openPrefs = function() {
	
	if( prefs === null ) {
		
		prefs = new BrowserWindow({
			
			width: 548,
			height: 474,
			resizable: false,
			minimizable: false,
			maximizable: false,
			show: false,
			vibrancy: 'under-window',
			webPreferences: {
				devTools: true,
				nodeIntegration: true,
				enableRemoteModule: true,
				preload: path.join(__dirname, './preload.min.js')
			},
		})
		
		prefs.loadURL(url.format ({ 
			
			pathname: path.join(__dirname, '../html/prefs.html'), 
			protocol: 'file:', 
			slashes: true 
		}))
		
		prefs.once('ready-to-show', () => {
			
			prefs.show()
			touchbar.prefsTouchbar( prefs )
		})
		
		prefs.webContents.on('did-fail-load', () => {
			
			log.error( `prefs window did not load` )
		})
		
		prefs.webContents.on( 'crashed', ( event, killed ) => {
			
			log.info( `prefs window has crashed:` )
			log.error( event )
		})
		
		prefs.on( 'unresponsive', () => {
			
			log.info( `prefs window is not responding…` )
		})
		
		prefs.on( 'responsive', () => {
			
			log.info( `prefs window is responding` )
		})
		
		prefs.on('close', () => {
			prefs = null
		})
	
	} else {
		
		prefs.focus()
	}
}


app.on('close-prefs', () => {
	
	prefs.close()
})
