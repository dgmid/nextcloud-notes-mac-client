'use strict'

const {app, BrowserWindow, systemPreferences} = require('electron')
const url = require('url')
const path = require('path')

let about = null



exports.createAbout = () => {
	
	if( about === null ) {
		
		let theme = 'appearance-based'
		//@exclude
		theme = systemPreferences.isDarkMode() ? 'dark' : 'light'
		//@end	
		
		about = new BrowserWindow({
			show: false,
			width: 340,
			height: 360,
			titleBarStyle: 'hidden',
			vibrancy: theme,
			resizable: false,
			minimizable: false,
			maximizable: false,
			alwaysOnTop: true,
			webPreferences: {
				devTools: true,
				preload: path.join(__dirname, './preload.min.js'),
				nodeIntegration: true
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
