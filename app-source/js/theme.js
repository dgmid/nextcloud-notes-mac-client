window.__setTheme = () => {
	
	let userTheme 		= localStorage.user_theme
	let OSTheme 		= localStorage.os_theme
	let defaultTheme 	= 'light'
	
	document.documentElement.setAttribute(
		'data-theme',
		userTheme || OSTheme || defaultTheme,
	)
	
	if(userTheme) {
		
		document.documentElement.setAttribute( 'data-user', userTheme )
		
	} else {
		
		document.documentElement.removeAttribute( 'data-user' )
	}
}

__setTheme()
