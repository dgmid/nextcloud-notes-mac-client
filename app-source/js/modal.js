'use strict'

const { remote } = require( 'electron' )
const path = require( 'path' )

let modal


exports.openModal = function( url, width, height, resize ) {
	
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
		frame: false,
		transparent: true,
		vibrancy: 'popover',
		webPreferences: {
		devTools: true,
			preload: path.join(__dirname, './preload.min.js'),
			nodeIntegration: true
		}	
	})
		
	modal.loadURL( url )
	
	modal.once('ready-to-show', () => {
		
		modal.show()
	})	
}



exports.closeModal = function() {
	
	modal.close()
}
