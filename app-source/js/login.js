'use strict'

const remote = require( 'electron' ).remote
const {ipcRenderer} = require( 'electron' )
const Store = require( 'electron-store' )
const store = new Store()

const $ = require( 'jquery' )



//note(@duncanmid): get login credentials

const 	server 		= store.get( 'loginCredentials.server' ),
		username 	= store.get( 'loginCredentials.username' ),
		password 	= store.get( 'loginCredentials.password' )

if( server ) { $('input[name="server"]').val( server ) }



//note(@duncanmid): close modal

function closeModal() {
	
	const modal = remote.getCurrentWindow()
	modal.close()
}



$(document).ready(function() {	
	
	//note(@duncanmid): set button states
	
	if( server ) {
		
		if( username && password ) {
			
			console.log('ALL THREE')
			
			$('#update').prop('disabled', true)
			$('#logout').prop('disabled', false)
		
		} else {
			
			console.log('ONLY SERVER')
			
			$('#update').prop('disabled', false)
			$('#logout').prop('disabled', true)
		}
		
	} else {
		
		console.log('NONE!')
		
		$('#update').prop('disabled', false)
		$('#logout').prop('disabled', true)
	}
	
	//note(@duncanmid): cancel modal
	
	$('#cancel').click( function() {
		
		closeModal()
	})
	
	
	//note(@duncanmid): update data
	
	$('#modal-form').submit( function( e ) {
		
		e.preventDefault()
		
		let theserver = $('input[name="server"]').val()
		
		store.set( 'loginCredentials.server', theserver )
		ipcRenderer.send( 'loginflow', theserver )
	})
	
	
	//note(@duncanmid): logout
	
	$('#logout').click( function() {
		
		store.set( 'loginCredentials', {
			
			server: '',
			username: '',
			password: ''
		} )
		
		ipcRenderer.send('reload', 'reload')
		
		closeModal()
	})
})
