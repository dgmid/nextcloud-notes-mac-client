'use strict'

const i18n 				= require( './i18n.min' )
const remote 			= require( 'electron' ).remote
const {ipcRenderer} 	= require( 'electron' )
const Store 			= require( 'electron-store' )
const store 			= new Store()
const $ 				= require( 'jquery' )
const jqueryI18next 	= require( 'jquery-i18next' )

jqueryI18next.init(i18n, $)



//note(dgmid): log exceptions

window.onerror = function( error, url, line ) {
	
	ipcRenderer.send( 'error-in-render', {error, url, line} )
}



//note(dgmid): set lang & localize strings

$('html').attr('lang', i18n.language)
$('header').localize()
$('label').localize()
$('input').localize()
$('button').localize()



//note(dgmid): get login credentials

let 	server 		= store.get( 'loginCredentials.server' ),
		username 	= store.get( 'loginCredentials.username' ),
		password 	= store.get( 'loginCredentials.password' )

if( server ) { $('input[name="server"]').val( server ) }



//note(dgmid): close modal

function closeModal() {
	
	const modal = remote.getCurrentWindow()
	modal.close()
}



//note(dgmid): update-theme

ipcRenderer.on('set-theme', (event, message) => {
	
	__setTheme()
})



$(document).ready(function() {	
	
	//note(dgmid): set button states
	
	if( server ) {
		
		if( username && password ) {
			
			$('#update').prop('disabled', true)
			$('#logout').prop('disabled', false)
		
		} else {
			
			$('#update').prop('disabled', false)
			$('#logout').prop('disabled', true)
		}
		
	} else {
		
		$('#update').prop('disabled', false)
		$('#logout').prop('disabled', true)
	}
	
	//note(dgmid): cancel modal
	
	$('#cancel').click( function() {
		
		closeModal()
	})
	
	
	//note(dgmid): update data
	
	$('#modal-form').submit( function( e ) {
		
		e.preventDefault()
		
		let theserver = $('input[name="server"]').val()
		
		store.set( 'loginCredentials.server', theserver )
		ipcRenderer.send( 'loginflow', theserver )
	})
	
	
	//note(dgmid): logout
	
	$('#logout').click( function() {
		
		store.set( 'loginCredentials', {
			
			server: '',
			username: '',
			password: ''
		})
		
		ipcRenderer.send('reload-sidebar', 'logout')
		closeModal()
	})
})
