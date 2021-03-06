'use strict'

const { BrowserWindow } = require('electron')
const path	= require( 'path' )
const Store	= require( 'electron-store' )
const store	= new Store()
const fs	= require( 'fs-extra' )
const log	= require( 'electron-log' )


module.exports.printNote = function( message ) {
	
	let printWindow
	
	printWindow = new BrowserWindow({
		
		show: false,
		webPreferences: {
			devTools: true,
			nodeIntegration: true,
			enableRemoteModule: true
		}
	})
	
	
	let css		= fs.readFileSync(path.join(__dirname, '../css/print.min.css') ,'utf8'),
		zoom 	= store.get( 'appSettings.zoom' )
	
	let head = `<html><head><meta charset="utf-8"><style>${css}</style></head><body style="--accent: ${message.colors[0]}; --accent-light: ${message.colors[1]}; --accent-dark: ${message.colors[2]};"><div class="editor-preview-active" style="padding: 22px; font-size: ${zoom/10}rem">`,
		foot = `</div></body>`
	
	printWindow.loadURL( `data:text/html;charset=UTF-8,${encodeURIComponent(head + message.note + foot)}` )
	
	
	printWindow.webContents.on('did-finish-load', () => {
		
		const printOptions = { printBackground: true }
		
		printWindow.webContents.print(printOptions, (success, error) => {
			
			if( !success ) {
				
				log.error( 'printing error:' )
				log.info( error )
			}
			
			printWindow.close()
		})
	})
}
