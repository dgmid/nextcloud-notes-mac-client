'use strict'

const i18n				= require( './i18n.min' )
const version 			= require('electron').remote.app.getVersion()
const compareVersions	= require('compare-versions')
const $					= require( 'jquery' )
const log				= require( 'electron-log' )


module.exports = {
	
	appVersion: function() {
	
		$.getJSON( 'https://api.github.com/repos/dgmid/nextcloud-notes-mac-client/releases/latest', function( release ) {
			
			let latest = release.name
			
			log.info( `this version: ${version}` )
			log.info( `latest version: ${latest}` )
			
			if( compareVersions.compare( version, latest, '<' ) ) {
				
				module.exports.displayVersion( `<button id="update" class="version" type="button" tabindex="-1" data-url="https://github.com/dgmid/nextcloud-notes-mac-client/releases/latest"><span id="update-version">${latest}</span> <span id="update-label">${i18n.t('app:titlebar.update', 'Update Available')}</span> &rarr;</button>` )
			}
			
			if( compareVersions.compare( version, latest, '>' ) ) {
					
				if( version.includes('-a') ) {
					
					module.exports.displayVersion( `<span id="dev" class="version α">DEV: v${version}</span>` )
					
				} else if ( version.includes('-b') ) {
					
					module.exports.displayVersion( `<span id="dev" class="version β">DEV: v${version}</span>` )
					
				} else {
					
					module.exports.displayVersion( `<span id="dev" class="version">DEV: v${version}</span>` )
				}
			}
		})
		.done( function() {
			
			log.info( `check release succeeded` )
		})
		.fail( function( jqXHR, textStatus, errorThrown ) {
			
			log.error( `check release failed ${textStatus}` )
		})
		.always( function() {
			
			log.info( `check release ended` )
		})
	},
	
	displayVersion: function( details ) {
		
		$('main').append( details )
		$('.version').delay(500).queue(function(){
    		$(this).addClass( 'slidedown' ).dequeue();
		})
	}
}
