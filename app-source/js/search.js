'use strict'

const Store				= require( 'electron-store' )
const JsSearch			= require( 'js-search' )
const stemmer			= require( 'stemmer' )
const sw				= require( 'stopword' )
const removeMarkdown	= require( 'remove-markdown' )
const $					= require( 'jquery' )
const log				= require( 'electron-log' )

const i18n				= require( './i18n.min' )
const sanitize			= require( './sanitize-category.min' )

const store				= new Store()
const database			= new Store({name: 'database'})



module.exports.searchNotes = function( term, callback ) {
	
	let termArr = term.split( ' ' ),
		data	= database.get( 'notes' ),
		cat 	= store.get('categories.selected'),
		lang	= i18n.language.substring(0, 2),
		notes	= [],
		result	= [],
		clean
	
	if( store.get( 'appSettings.stopwords' ) ) {
		
		let cleanArr 	= sw.removeStopwords( termArr, sw[checkStopwordLang( lang )] )
			clean 		= cleanArr.join( ' ' )
	
	} else {
	
		clean = term
	}
	
	for( let item of data ) {
		
		item.content = removeMarkdown( item.content )
		let catClass = sanitize.sanitizeCategory( item.category )
		
		notes.push({
			id: item.id,
			content: item.content,
			category: catClass,
			favorite: item.favorite
		})
	}
	
	let search = new JsSearch.Search( 'id' )
	
	if( store.get( 'appSettings.stemming' ) ) {
	
		search.tokenizer = new JsSearch.StemmingTokenizer( stemmer, new JsSearch.SimpleTokenizer() )
	}
	
	search.addIndex( 'content' )
	search.addDocuments( notes )
	let filtered = search.search( clean )
	
	for( let item of filtered ) {
		
		result.push( item.id )
	}
	
	callback( result, clean )
}



function checkStopwordLang( theLang ) {
	
	const langArr = ['af', 'ar', 'bn', 'br', 'da', 'de', 'es', 'fa', 'fi', 'fr', 'ha', 'he', 'hi', 'id', 'it', 'ja', 'nl', 'no', 'pl', 'pt', 'pa', 'ru', 'so', 'st', 'sv', 'sw', 'vi', 'yo', 'zh']
	
	if( langArr.includes( theLang ) ) {
		
		return theLang
		
	} else {
		
		return 'en'
	}
}
