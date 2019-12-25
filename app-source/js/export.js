'use strict'

const i18n				= require( './i18n.min' )

const { remote }		= require( 'electron' )
const Store				= require( 'electron-store' )
const store				= new Store()
const dialog			= remote.dialog
const marked			= require( 'marked' )
const removeMarkdown	= require( 'remove-markdown' )
const pretty			= require( 'pretty' )
const fs				= require( 'fs-extra' )
const log				= require( 'electron-log' )


module.exports.exportNote = function( note ) {
	
	const exportPath = store.get('exportPath')
	
	dialog.showSaveDialog(remote.getCurrentWindow(), {
			
		defaultPath: `${exportPath}/${note.title}`,
		buttonLabel: i18n.t('app:dialog.button.export', 'Export Note'),
		properties: [	'openDirectory',
						'createDirectory'
					],
		filters: [
				{	name:		i18n.t('app:dialog.format.html', 'html'),
					extensions:	['html']
				},
				{	name:		i18n.t('app:dialog.format.md', 'markdown'),
					extensions:	['md']
				},
				{	name:		i18n.t('app:dialog.format.txt', 'text'),
					extensions:	['txt']
				}
			]
		}
	).then((data) =>{
		
		if( data.canceled === false ) {
			
			runExportProcess( data.filePath )
		}
	})
	
	function runExportProcess( filename ) {
		
		let exported,
			filetype
		
		switch( filename.split('.').pop() ) {
			
			case 'html':
				
				let html = marked( note.content )
				
				exported = pretty( `<!doctype html><html lang="${i18n.language}"><head><meta charset="utf-8" /><title>${note.title}</title></head><body>${html}</body></html>`, {ocd: true} )
				
				filetype = 'html'
				
			break
			
			case 'txt':
				
				exported = removeMarkdown( note.content )
				filetype = 'text'
			
			break
			
			default:
				
				exported = note.content
				filetype = 'markdown'
		}
		
		fs.outputFile(filename, exported)
		.then(() => fs.readFile(filename, 'utf8'))
		.then((data) => {
			
			let exportNotification = new Notification('Nextcloud Notes Client', {
				
				body: i18n.t('app:notification.export.text', 'The note {{title}} has been exported as {{filetype}}', {title: note.title, filetype: filetype})
			})
		})
		
		.catch(err => {
			
			log.error( err )
		})
	}
}
