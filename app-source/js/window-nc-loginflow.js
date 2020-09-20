'use strict'

const {BrowserWindow} = require('electron')
const url	= require( 'url' )
const path	= require( 'path' )
const log	= require( 'electron-log' )

let loginFlow = null


module.exports = {
	
	openLoginflow: function( message ) {
		
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
				devTools: true,
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
		
		loginFlow.webContents.on('did-fail-load', () => {
			
			log.error( `loginflow window did not load` )
		})
		
		loginFlow.webContents.on( 'crashed', ( event, killed ) => {
			
			log.info( `loginflow window has crashed:` )
			log.error( event )
		})
		
		loginFlow.on( 'unresponsive', () => {
			
			log.info( `loginflow window is not responding…` )
		})
		
		loginFlow.on( 'responsive', () => {
			
			log.info( `loginflow window is responding` )
		})
	},
	
	closeLoginflow: function() {
	
		if( loginFlow ) {
			
			loginFlow.close()
			loginFlow = null
		}
	}
}
