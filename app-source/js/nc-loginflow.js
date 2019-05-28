'use strict'

const i18n = require( './i18n.min' )
const Store = require( 'electron-store' )
const store = new Store()

const server = store.get( 'loginCredentials.server' )
const $ = require( 'jquery' )



$('html').attr('lang', i18n.language)

//note(@duncanmid): open loginflow webview

function loginFlow( theserver ) {
	
	const webview = document.createElement("webview")
	
	webview.setAttribute( 'src', '/' )
	document.body.appendChild(webview)
	
	const loadPage = () => {
		
		webview.loadURL(
	
			theserver + '/index.php/login/flow', {
	
				userAgent: 'Nextcloud Bookmark Manager - Macintosh',
				extraHeaders: 'OCS-APIRequest: true' 	
			}
		)
		
		webview.removeEventListener('dom-ready', loadPage)
	}
	
	webview.addEventListener('dom-ready', loadPage)
}



$(document).ready(function() {
	
	loginFlow( server )
})
