
window.__setTheme = () => {
	
	let userTheme 		= localStorage.user_theme,
		OSTheme 		= localStorage.os_theme,
		defaultTheme 	= 'light',
		accent			= localStorage.accent,
		accent_light	= localStorage.accent_light,
		accent_dark		= localStorage.accent_dark
	
	
	document.documentElement.setAttribute(
		'data-theme',
		userTheme || OSTheme || defaultTheme,
	)
	
	if( userTheme ) {
		
		document.documentElement.setAttribute( 'data-user', userTheme )
		
	} else {
		
		document.documentElement.removeAttribute( 'data-user' )
	}
	
	
	document.documentElement.setAttribute( 'style', `--accent: ${accent}; --accent-light: ${accent_light}; --accent-dark: ${accent_dark};`)
	document.documentElement.setAttribute( 'data-colors', `["${accent}","${accent_light}","${accent_dark}"]` )
}

__setTheme()
