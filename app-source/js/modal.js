'use strict'

const { remote } = require( 'electron' )
const path = require( 'path' )

let modal


module.exports = {
	
	openModal: function( url, width, height, resize ) {
		
		modal = new remote.BrowserWindow({
		
			parent: remote.getCurrentWindow(),
			modal: true,
			width: width,
			minWidth: width,
			maxWidth: width,
			height: height,
			minHeight: height,
			resizable: resize,
			show: false,
			transparent: true,
			vibrancy: 'window',
			webPreferences: {
				devTools: true,
				nodeIntegration: true,
				enableRemoteModule: true,
				preload: path.join(__dirname, './preload.min.js')
			}	
		})
			
		modal.loadURL( url )
		
		modal.once('ready-to-show', () => {
			
			modal.show()
		})	
	},
	
	closeModal: function() {
		
		modal.close()
	}
}
