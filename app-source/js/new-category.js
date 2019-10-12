'use strict'

const i18n 				= require( './i18n.min' )
const remote 			= require( 'electron' ).remote
const {ipcRenderer} 	= require( 'electron' )
const Store				= require( 'electron-store' )
const store				= new Store()
const $ 				= require( 'jquery' )
const jqueryI18next 	= require( 'jquery-i18next' )

jqueryI18next.init(i18n, $)

let urlParams = new URLSearchParams( window.location.search )
let id = urlParams.get( 'id' )


//note(@duncanmid): set lang & localize strings

$('html').attr('lang', i18n.language)
$('header').localize()
$('label').localize()
$('input').localize()
$('button').localize()



//note(@duncanmid): close modal

function closeModal() {
	
	const modal = remote.getCurrentWindow()
	modal.close()
}



//note(@duncanmid): update-theme

ipcRenderer.on('set-theme', (event, message) => {
	
	__setTheme()
})



$(document).ready(function() {	
	
	//note(@duncanmid): cancel modal
	
	$('#cancel').click( function() {
		
		closeModal()
	})
	
	
	//note(@duncanmid): update data
	
	$('#modal-form').submit( function( e ) {
		
		e.preventDefault()
		
		let newcat = $('input[name="newcat"]').val()
		
		if( id ) ipcRenderer.send('new-category', {'id': id, 'category': newcat})
		
		closeModal()
	})
})
