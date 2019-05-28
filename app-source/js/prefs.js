'use strict'

const i18n = require( './i18n.min' )
const {ipcRenderer} = require( 'electron' )
const Store = require( 'electron-store' )
const store = new Store()
const $ = require( 'jquery' )
const jqueryI18next = require( 'jquery-i18next' )

jqueryI18next.init(i18n, $)



//note(@duncanmid): set lang & localize strings

$('html').attr('lang', i18n.language)
$('title').localize()
$('option').localize()
$('label').localize()



$(document).ready(function() {
	
	$('#sortby').val( store.get('appSettings.sortby') )
	$('#orderby').val( store.get('appSettings.orderby') )
	$('#zoom').val( store.get('appSettings.zoom') )
	$('#spellcheck').prop('checked', store.get('appSettings.spellcheck') )
	$(`#${store.get('appSettings.cursor')}`).prop('checked', true)
	
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
			
			case 'spellcheck':
				let checked = $('#spellcheck').is(':checked')
				store.set( `appSettings.${name}`, checked )
				ipcRenderer.send('spellcheck', checked )
			break
			
			case 'cursor':
				store.set( `appSettings.${name}`, val )
			break
		}
	})
})
