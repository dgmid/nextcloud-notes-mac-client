'use strict'

const Store				= require( 'electron-store' )
const JsSearch			= require( 'js-search' )
const Snowball			= require( 'snowball' )
const sw				= require( 'stopword' )
const removeMarkdown	= require( 'remove-markdown' )
const $					= require( 'jquery' )
const log				= require( 'electron-log' )

const i18n				= require( './i18n.min' )
const lang				= i18n.language.substring(0, 2)
const categories		= require( './categories.min' )

const store				= new Store()
const database			= new Store({name: 'database'})



module.exports.searchNotes = function( term ) {
	
	let termArr = term.split( ' ' ),
		data	= database.get( 'notes' ),
		cat 	= store.get('categories.selected'),
		notes	= [],
		result	= [],
		clean
	
	if( store.get( 'appSettings.stopwords' ) === true ) {
		
		let cleanArr 	= sw.removeStopwords( termArr, sw[checkStopwordLang( lang )] )
			clean 		= cleanArr.join( ' ' )
	
	} else {
	
		clean = term
	}
	
	for( let item of data ) {
		
		item.content = removeMarkdown( item.content )
		let catClass = categories.sanitizeCategory( item.category )
		
		notes.push({
			id: item.id,
			content: item.content,
			category: catClass,
			favorite: item.favorite
		})
	}
	
	let search = new JsSearch.Search( 'id' )
	
	if( store.get( 'appSettings.stemming' ) === true ) {
	
		search.tokenizer = new JsSearch.StemmingTokenizer( new Stem, new JsSearch.SimpleTokenizer() )
	}
	
	search.addIndex( 'content' )
	search.addDocuments( notes )
	let filtered = search.search( clean )
	
	for( let item of filtered ) {
		
		result.push( item.id )
	}
	
	searchResult( result, clean )
}



let Stem = function( word ) {
	
	let wordStemmer = new Snowball( checkStemmerLang( lang ) )
	
	return function( word ) {
		
		wordStemmer.setCurrent( word )
		wordStemmer.stem()
		
		return wordStemmer.getCurrent()
	}
}



function checkStopwordLang( theLang ) {
	
	const langArr = ['af', 'ar', 'bn', 'br', 'da', 'de', 'es', 'fa', 'fi', 'fr', 'ha', 'he', 'hi', 'id', 'it', 'ja', 'nl', 'no', 'pl', 'pt', 'pa', 'ru', 'so', 'st', 'sv', 'sw', 'vi', 'yo', 'zh']
	
	if( langArr.includes( theLang ) ) {
		
		return theLang
		
	} else {
		
		return 'en'
	}
}



function checkStemmerLang( theLang ) {
	
	let stemLang = 'english'
	
	switch( theLang ) {

		case 'da':
			stemLang = 'danish'
		break
		case 'nl':
			stemLang = 'dutch'
		break
		case 'fi':
			stemLang = 'finnish'
		break
		case 'fr':
			stemLang = 'french'
		break
		case 'de':
			stemLang = 'german'
		break
		case 'hu':
			stemLang = 'hungarian'
		break
		case 'it':
			stemLang = 'italian'
		break
		case 'no':
			stemLang = 'norwegian'
		break
		case 'pt':
			stemLang = 'portuguese'
		break
		case 'ru':
			stemLang = 'russian'
		break
		case 'es':
			stemLang = 'spanish'
		break
		case 'sv':
			stemLang = 'swedish'
		break
		case 'ro':
			stemLang = 'romanian'
		break
		case 'tr':
			stemLang = 'turkish'
		break
	}
	
	return stemLang
}



function searchResult( result, clean ) {
		
	$(`#sidebar li`).hide()
	$('#result').html( clean ).show()
	
	for( let id of result ) {
		
		$(`#sidebar li[data-id='${id}']`).show()
	}
}
