window.__setTheme = () => {
	let userTheme = localStorage.user_theme
	let OSTheme = localStorage.os_theme
	let defaultTheme = 'light'
	document.documentElement.setAttribute(
		'data-theme',
		userTheme || OSTheme || defaultTheme,
	)
}
__setTheme()
