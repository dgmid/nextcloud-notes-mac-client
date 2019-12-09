'use strict'

const i18n = require( './i18n.min' )

const {  remote }	= require( 'electron' )
const dialog		= remote.dialog
const Store			= require( 'electron-store' )
const store			= new Store()
const log			= require( 'electron-log' )

let server 		= store.get( 'loginCredentials.server' ),
	username 	= store.get( 'loginCredentials.username' ),
	password 	= store.get( 'loginCredentials.password' )


exports.apiCall = function ( call, id, body, callback ) {
	
	let method
	
	switch( call ) {
		
		case 'new':
			method = 'POST'
		break
		
		case 'save':
		case 'update':
		case 'category':
			method = 'PUT'
		break
		
		case 'delete':
			method = 'DELETE'
		break
		
		default: //all, single or export
			method = 'GET'
	}
	
	let url = '/index.php/apps/notes/api/v0.2/notes',
	init = {
		
		method: method,
		headers: {
			'Authorization': 'Basic ' + btoa( username + ':' + password ),
			'Content-Type': 'application/json',
		},
		mode: 'cors',
		cache: 'no-cache',
		credentials: 'omit'
	}
	
	if( id ) { url += `/${id}` }
	if( body ) { init.body = JSON.stringify( body ) }
	
	log.info( `URL: ${server}${url}` )
	
	fetch(server + url, init)
	.then(function(response) {
		
		if(!response.ok) {
			
			log.warn(`fetch error`)
			console.table(response)
			throw Error(response.status)
			
		} else {
		
			log.info( `response ok` )
			return response.text()
		}
	
	}).then(function(message) {
		
		let notes = JSON.parse(message)
		
		if (notes['status'] == 'error') {
			
			dialog.showErrorBox(
				i18n.t('app:dialog.error.json.title', 'JSON parsing error'),
				i18n.t('app:dialog.error.json.text', 'An error occured parsing the notes')
			)
			
			log.error( notes['message'] )
		
		} else {
			
			callback( call, id, body, notes )
		}
	
	}).catch( function( error ) {
		
		dialog.showErrorBox(
			i18n.t('app:dialog.error.server.title', 'Server error'),
			i18n.t('app:dialog.error.server.text', 'there was an error retrieving') + `:\n${url}\n\n${error}`
		)
		
		log.error( error )
	})
}
