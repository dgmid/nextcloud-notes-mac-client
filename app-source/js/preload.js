'use strict'

// https://gist.github.com/EtienneLem/7e3bc7af2ed75a15eae9006557ef790e#file-preload-js

const { remote } 	= require( 'electron' )
const os 			= require( 'os' ).release()
const parts 		= os.split( '.' )


if (process.platform == 'darwin') {
	
	const { systemPreferences } = remote

	const setOSTheme = () => {
		
		let theme = systemPreferences.isDarkMode() ? 'dark' : 'light'
		
		if( parts[0] <= 17 ) theme = 'light'
		
		window.localStorage.os_theme = theme

		if ('__setTheme' in window) {
			
			window.__setTheme()
		}
	}

	systemPreferences.subscribeNotification(
		
		'AppleInterfaceThemeChangedNotification',
		setOSTheme,
	)

	setOSTheme()
}
