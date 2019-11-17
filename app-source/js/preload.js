'use strict'

// based on: https://gist.github.com/EtienneLem/7e3bc7af2ed75a15eae9006557ef790e#file-preload-js

const { remote } 	= require( 'electron' )
const os 			= require( 'os' ).release()
const parts 		= os.split( '.' )
const color 		= require( 'color' )
const { systemPreferences } = remote
const { nativeTheme } = remote


const setOSTheme = () => {
	
	let theme 	= nativeTheme.shouldUseDarkColors ? 'dark' : 'light',
		accent 	= systemPreferences.getAccentColor().substr(0, 6)
	
	if( parts[0] <= 17 ) { 
		
		theme = 'light'
		accent = '0a5fff'
	}
	
	let light = color('#'+accent).lighten(.15).hex()
	let dark = color('#'+accent).darken(.175).hex()
	
	window.localStorage.os_theme = theme
	window.localStorage.accent = `#${accent}`
	window.localStorage.accent_light = light
	window.localStorage.accent_dark = dark

	if ('__setTheme' in window) {
		
		window.__setTheme()
	}
}


systemPreferences.subscribeNotification(
	
	'AppleInterfaceThemeChangedNotification',
	setOSTheme,
)


setOSTheme()
