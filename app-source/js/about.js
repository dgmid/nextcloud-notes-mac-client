'use strict'

const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const url = require('url')
const path = require('path')

let about = null



exports.createAbout = () => {
	
	if( about === null ) {
	
		about = new BrowserWindow({
			show: false,
			width: 340,
			height: 360,
			titleBarStyle: 'hidden',
			resizable: false,
			minimizable: false,
			maximizable: false,
			alwaysOnTop: true,
			backgroundColor: '#fff',
			webPreferences: {
				devTools: true,
				preload: path.join(__dirname, './preload.min.js'),
				devTools: true
			}
		})
		
		about.loadURL(url.format ({ 
			
			pathname: path.join(__dirname, '../html/about.html'),
			protocol: 'file:', 
			slashes: true 
		}))
		
		about.once('ready-to-show', () => {
			about.show()
		})
		
		about.on('close', () => {
			about = null
		})
	}
}
