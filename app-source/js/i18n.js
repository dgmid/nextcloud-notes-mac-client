'use strict'

const i18n = require( 'i18next' )
const i18nextBackend = require( 'i18next-sync-fs-backend' )
const LanguageDetector = require( 'i18next-electron-language-detector' )
const path = require( 'path' )


const i18nextOptions = {

	fallbackLng: 'en',
	debug: false,
	ns: [
		'main',
		'app',
		'touchbar',
		'date',
		'menu',
		'dock',
		'sidebarmenu',
		'notecontextmenu',
		'newcategory',
		'inserthyperlink',
		'inserttable',
		'prefs',
		'login',
		'about'
		],
	defaultNS: 'app',
	backend:{
		loadPath: path.join(__dirname, '../i18n/{{lng}}/{{ns}}.json'),
		addPath: path.join(__dirname, '../i18n/{{lng}}/{{ns}}.missing.json'),
	jsonIndent: 2,
	},
	saveMissing: true,
	initImmediate: false
}



i18n.use(LanguageDetector).use(i18nextBackend)



if (!i18n.isInitialized) {
	
	i18n.init(i18nextOptions)
}



module.exports = i18n
