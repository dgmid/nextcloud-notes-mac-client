'use strict'

const i18n 					= require( '../js/i18n.min' )
const Store					= require( 'electron-store' )
const store					= new Store()
window.$ = window.jQuery 	= require( 'jquery' )
const {shell, ipcRenderer} 	= require( 'electron' )
const jqueryI18next 		= require( 'jquery-i18next' )
jqueryI18next.init(i18n, $)


//note(dgmid): set lang & localize strings

$('html').attr('lang', i18n.language)
$('title').localize()
$('#description').localize()
$('dt').localize()
$('#info').localize()


//note(dgmid): get app data from package.json
	
$.getJSON('../../package.json', function(json) {
	
	let packageData = json
	
	$('#productName').html( packageData['productName'] )
	$('#version').html( packageData['version'] )
	$('#author').html( packageData['author']['name'] )
	$('#license').html( packageData['license'] )
	
	$('#info').click(function() {
		
		require('electron').shell.openExternal( packageData['homepage'] )
	})
})


//note(dgmid): update-theme

ipcRenderer.on('set-theme', (event, message) => {
	
	__setTheme()
})
