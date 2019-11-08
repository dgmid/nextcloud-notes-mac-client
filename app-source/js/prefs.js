'use strict'

const i18n 				= require( './i18n.min' )
const {ipcRenderer} 	= require( 'electron' )
const Store 			= require( 'electron-store' )
const store 			= new Store()
const $ 				= require( 'jquery' )
const jqueryI18next 	= require( 'jquery-i18next' )

jqueryI18next.init(i18n, $)



//note(dgmid): set lang & localize strings

$('html').attr('lang', i18n.language)
$('title').localize()
$('option').localize()
$('label').localize()



//note(dgmid): log exceptions

window.onerror = function( error, url, line ) {
	
	ipcRenderer.send( 'error-in-render', {error, url, line} )
}



$(document).ready(function() {
	
	$('#sortby').val( store.get('appSettings.sortby') )
	$('#orderby').val( store.get('appSettings.orderby') )
	$('#zoom').val( store.get('appSettings.zoom') )
	$(`#${store.get('appSettings.cursor')}`).prop('checked', true)
	
	
	if( localStorage.user_theme ) {
		
		$(`#${localStorage.user_theme}`).prop('checked', true)
		
	} else {
		
		$('#os-theme').prop('checked', true)
	}
	
	
	$('select, input').on('change', function() {
		
		let name = $(this).attr('name'),
			val = $(this).val()
			
		switch( name ) {
			
			case 'sortby':
			case 'orderby':
				store.set( `appSettings.${name}`, val )
				ipcRenderer.send('reload-sidebar', null )
			break
			
			case 'zoom':
				store.set( `appSettings.${name}`, val )
				ipcRenderer.send('set-zoom-slider', parseInt( val ) )
			break
			
			case 'cursor':
				store.set( `appSettings.${name}`, val )
			break
			
			case 'theme':
				
				let theme = $('[name$=theme]:checked').val()
				
				if( theme == 'default' ) {
					
					localStorage.removeItem('user_theme')
					ipcRenderer.send('update-theme', theme )
					__setTheme()
					
				} else {
					
					localStorage.user_theme = theme
					ipcRenderer.send('update-theme', theme )
					__setTheme()
				}
			break
		}
	})
})
