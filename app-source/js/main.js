'use strict'

const {app, ipcMain, webContents} = require('electron')
const url		= require( 'url' )
const path		= require( 'path' )
const dialog	= require( 'electron' ).dialog
const Store		= require( 'electron-store' )
const store		= new Store()
const log		= require( 'electron-log' )

const mainWindow	= require( './window-app.min' )
const preferences	= require( './window-prefs.min' )
const ncLoginflow	= require( './window-nc-loginflow.min' )



app.on('ready', mainWindow.openWindow)


app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
	
	if( store.get('appSettings.nocertificate') ) {
		
		log.info(`certificate ignored`)
		event.preventDefault()
		callback(true)
		
	} else {
		
		const i18n = require( './i18n.min' )
		
		log.error(error)
		callback(false)
		let server = store.get( 'loginCredentials.server' )
		
		dialog.showErrorBox(
			i18n.t('main:dialog.error.cert.title', 'Your connection is not private'),
			`${error}\n\n` +
			i18n.t('main:dialog.error.cert.text', {server: server})
		)
	}
})


process.on('uncaughtException', (err, origin) => {
	
	log.error(`caught exception: ${err}`)
	log.info(`exception origin: ${origin}`)
})


ipcMain.on('loginflow', (event, message) => {
	
	ncLoginflow.openLoginflow( message )
})


app.on('open-prefs', () => {
	
	preferences.openPrefs()
})


app.on('open-config', () => {
	
	store.openInEditor()
})


ipcMain.on('print-preview', (event, message) => {
	
	const print	= require( './print.min' )
	print.printNote( message )
})


ipcMain.on('quit-app', (event, message) => {
	
	if( mainWindow.windowWillQuit() ) app.quit()
})


ipcMain.on('update-theme', (event, message) => {
	
	webContents.getAllWebContents().forEach( wc => {
		
		wc.send('set-theme', message)
	})
})


ipcMain.on('error-in-render', function(event, message) {
	
	log.error(`exception in render process:`)
	log.info (message)
})
