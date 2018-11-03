'use strict'

const {ipcRenderer, shell} = require( 'electron' )
const Store = require( 'electron-store' )
const store = new Store()
const { remote } = require( 'electron' )
const dialog = remote.dialog
const dateFormat = require( 'dateformat' )
const $ = require( 'jquery' )
const marked = require( 'marked' )
const removeMarkdown = require( 'remove-markdown' )
const pretty = require( 'pretty' )
const fs = require( 'fs-extra' )

const 	server 		= store.get( 'loginCredentials.server' ),
		username 	= store.get( 'loginCredentials.username' ),
		password 	= store.get( 'loginCredentials.password' )

let modal

const SimpleMDE = require( 'simplemde' )

let smeSetup = {
		
		element: $('#note')[0],
		autofocus: false,
		forceSync: true,
		status: false,
		spellChecker: true,
		toolbar: [	'heading',
					'|',
					'bold',
					'italic',
					'strikethrough',
					'|',
					'unordered-list',
					'ordered-list',
					'|',
					'link',
					'image',
					'|',
					'code',
					'quote',
					'table',
					'horizontal-rule'
				],
		shortcuts: {
			'toggleStrikethrough': 'Cmd-Alt-D',
			'toggleBlockquote': 'Cmd-\'',
			'drawTable': 'Cmd-T',
			'drawHorizontalRule': 'Cmd--',
			'cleanBlock': null,
			'toggleSideBySide': null,
			'toggleFullScreen': null,
			'togglePreview': null	
		}
	}

let simplemde = new SimpleMDE( smeSetup )



//note(@duncanmid): call notes api

function apiCall( call, id, body ) {
	
	let method
	
	switch( call ) {
		
		case 'new':
			method = 'post'
		break
		
		case 'save':
		case 'update':
			method = 'put'
		break
		
		case 'delete':
			method = 'delete'
		break
		
		default: //all, single or export
			method = 'get'
	}
	
	let url = '/index.php/apps/notes/api/v0.2/notes',
	init = {
		
		method: method,
		headers: {
			'Authorization': 'Basic ' + btoa( username + ':' + password ),
			'Content-Type': 'application/json'
		},
		mode: 'cors',
		cache: 'default'
	}
	
	if( id ) { url += `/${id}` }
	if( body ) { init.body = JSON.stringify( body ) }
	
	fetch(server + url, init).then(function(response) {
	
		if (response.ok) {
			
			console.log('response OK')
			return response.text()
		
		} else {
			
			dialog.showErrorBox(
				'Server connection error',
				`there was an error connecting to:\n${server}`
			)
			
			console.log( response.error() )
		}
	
	}).then(function(message) {
		
		
		let notes = JSON.parse(message)
		
		
		if (notes['status'] == 'error') {
			
			dialog.showErrorBox(
				'JSON parsing error',
				`An error occured parsing the notes`
			)
			
			console.log(notes['message'])	
		
		} else {
			
			switch( call ) {
				
			case 'new': // create new note
				
				store.set('appInterface.selected', notes.id)
				$('#sidebar').html('')
				apiCall('all')
				
			break
			
			case 'save': // save note
				
				$('#sidebar').html('')
				apiCall('sidebar')
				
			break
			
			case 'update': // modify existing note
				
				$(`button[data-id="${id}"]`).removeData('favorite')
				$(`button[data-id="${id}"]`).attr('data-favorite', body.favorite)
			
			break
			
			case 'delete': // delete note
				
				let selected = $('#sidebar li button.selected').attr('data-id')
				
				if( selected == id) {
					
					resetEditor()
					
					store.set( 'appInterface.selected', null )
					$('#note').attr('data-id', null)
					$('#time, #note').html('')
				}
				
				$('#sidebar').html('')
				apiCall('all')
			
			break
			
			case 'export':
				
				exportNote( notes )
				
			break
			
			case 'sidebar':
				
				listNotes( notes, 'sidebar' )
				
			break
			
			default: // get single note or all notes
				
				(id) ? displayNote( notes ) : listNotes( notes )
			}
		}
	
	}).catch(function(error) {
		
		dialog.showErrorBox(
				'Server connection error',
				`there was an error connecting to:\n${server}`
			)
		
		console.log(error)
	})
}



//note reset editor

function resetEditor() {
	
	simplemde.codemirror.setValue('')
	simplemde.value('')
	$('.editor-preview').html('')
}



//note(@duncanmid): codeMirror - insert / wrap text

function insertTextAtCursor( text ) {
	
	let note = simplemde.codemirror.getDoc()
	let cursor = note.getCursor()
	note.replaceRange(text, cursor)
}

function wrapTextToSelection( start, end ) {
	
	let note = simplemde.codemirror.getDoc()
	let selection = note.getSelection()
	note.replaceSelection( start + selection + end )
}



//note(@duncanmid): generate ordered sidebar entries

function listNotes( array, sidebar ) {
	
	const date = new Date()
	const now = date.getTime() / 1000
	
	let sortby 	= store.get( 'appSettings.sortby' ),
		orderby = store.get( 'appSettings.orderby' )
	
	if( array.length > 1 ) {
		
		array.sort(function(x, y) {
			
			var itemX = x[sortby]
			var itemY = y[sortby]
			
			if( orderby === 'asc' ) {
				
				return (itemX < itemY) ? -1 : (itemX > itemY) ? 1 : 0
			
			} else {
				
				return (itemX > itemY) ? -1 : (itemX < itemY) ? 1 : 0
			}
		})
	}
	
	for ( let item of array ) {
		
		let theDate = new Date( item.modified )
		let formattedDate = formatDate( now, theDate.getTime() )
		
		let plainTxt = removeMarkdown( item.content.replace(/(!\[.*\]\(.*\)|<[^>]*>|>|<)/g, ''))
		
		if( plainTxt ) {

			plainTxt = plainTxt.substr(0, 120).slice(item.title.length)
			
		} else {
			
			plainTxt = 'No additional text'
		}
		                                                                                     
		$('#sidebar').append(
		`<li>
			<button data-id="${item.id}" data-title="${item.title}" data-category="${item.category}" data-favorite="${item.favorite}">
				<span class="side-title">${item.title}</span>
				<span class="side-text">${formattedDate}&nbsp;&nbsp;${plainTxt}</span>
			</button>
		</li>
		`)
	}
	
	( sidebar ) ? getSelected( 'sidebar' ) : getSelected()
}



//note(@duncanmid): formatDate

function formatDate( now, timestamp ) {
	
	//todo(@duncanmid): add if the time (H:MM) is greater than current -> 'yesterday' 
	
	if( (now - 86400) < timestamp ) {
		
		//time
		return dateFormat( timestamp * 1000, 'H:MM' )
	
	} else if ( (now - 604800) < timestamp ) {
		
		//day
		return dateFormat( timestamp * 1000, 'dddd')
	
	} else {
		
		//date
		return dateFormat( timestamp * 1000, 'dd/mm/yy')
	}
}



//note(@duncanmid): display single note

function displayNote( note ) {
	
	$('.CodeMirror-code').addClass('hide')
	$('#edit').removeClass('editing')
	
	$('#time').html( dateFormat(note.modified * 1000, 'd mmmm, yyyy "at" HH:MM') )
	
	resetEditor()
	
	if( simplemde.isPreviewActive() ) simplemde.togglePreview()
	
	$('#note').attr('data-id', note.id)
	simplemde.value( note.content )
	simplemde.codemirror.clearHistory()
	simplemde.togglePreview()
	applyZoom( store.get( 'appSettings.zoom' ) )
	
	$('.CodeMirror-code').removeClass('hide')
}



//note(@duncanmid): get selected note

function getSelected( sidebar ) {
	
	let selected = store.get( 'appInterface.selected' )
	
	if( selected ) {
		
		$(`button[data-id="${selected}"]`).addClass('selected').parent().prev().children().addClass('above-selected')
		
		if( !sidebar ) apiCall( 'single', selected )
	}
}



//note(@duncanmid): edit note

function editNote() {
	
	let selected = store.get( 'appInterface.selected' )
		
	if( selected ) {
		
		if( simplemde.isPreviewActive() ) {
		
			$('#edit').addClass('editing')
			simplemde.togglePreview()
			simplemde.codemirror.focus()
			
			if( store.get('appSettings.cursor') == 'end' ) {
				
				simplemde.codemirror.setCursor(simplemde.codemirror.lineCount(), 0)
			}
		
		} else {
			
			if( simplemde.codemirror.historySize().undo > 0 ) {
			
				let response = dialog.showMessageBox(remote.getCurrentWindow(), {
								message: `You have made changes to this note`,
								detail: `Do you want to save them?`,
								buttons: ['Save changes','Cancel']
							})
				
				if( response === 0 ) {
					
					let content = simplemde.value()
					
					simplemde.codemirror.clearHistory()
					
					apiCall( 'save', selected, {"content": content, "modified": Math.floor(Date.now() / 1000) } )
				
				} else {
			
					while ( simplemde.codemirror.historySize().undo > 0) simplemde.codemirror.undo()
				}
			}
			
			simplemde.togglePreview()
			$('#edit').removeClass('editing').focus()
		}
	}
}



//note(@duncanmid): save note

function saveNote( id ) {
	
		if(	!simplemde.isPreviewActive() &&
			simplemde.codemirror.historySize().undo > 0 ) {
			
			console.log( 'SAVING!!' )
			
			let content = simplemde.value()
						
			//simplemde.codemirror.clearHistory()
						
			apiCall( 'save', id, {"content": content, "modified": Math.floor(Date.now() / 1000) } )
		}
}



//note(@duncanmid): export note

function exportNote( note ) {
	
	const exportPath = store.get('exportPath')
	
	dialog.showSaveDialog(remote.getCurrentWindow(), {
			
			defaultPath: `${exportPath}/${note.title}`,
			buttonLabel: 'Export Note',
			properties: [	'openDirectory',
							'createDirectory'
						],
			filters: [
				{	name:		'html',
					extensions:	['html']
				},
				{	name:		'markdown',
					extensions:	['md']
				},
				{	name:		'text',
					extensions:	['txt']
				}
			]
		},		
		
		runExportProcess
	)
	
	function runExportProcess( filename ) {
		
		let exported,
			filetype
		
		switch( filename.split('.').pop() ) {
			
			case 'html':
				
				let html = marked( note.content )
				
				exported = pretty( `<!doctype html><html lang="en"><head><meta charset="utf-8" /><title>${note.title}</title></head><body>${html}</body></html>`, {ocd: true} )
				
				filetype = 'html'
				
			break
			
			case 'txt':
				
				exported = removeMarkdown( note.content )
				filetype = 'text'
			
			break
			
			default: //markdown
				
				exported = note.content
				filetype = 'markdown'
		}
		
		fs.outputFile(filename, exported)
		.then(() => fs.readFile(filename, 'utf8'))
		.then(data => {
			
			let exportNotification = new Notification('Nextcloud Notes Client', {
			
				body: `The note ${note.title} has been exported as ${filetype}.`
			})
		})
		
		.catch(err => {
			
			console.error(err)
		})
	}
}



//note(@duncanmid): delete check

function deleteCheck( id ) {
	
	let response = dialog.showMessageBox(remote.getCurrentWindow(), {
							message: `Are you sure you want to delete this note?`,
							detail: `This operation is not reversable.`,
							buttons: ['Delete Note','Cancel']
						})
		
	if( response === 0 ) {
		
		apiCall( 'delete', id )
	}
}



//note(@duncanmid): apply zoom level

function applyZoom( level ) {
	
	$('.editor-preview').css({ "font-size": `${level/10}rem` })
}



//note(@duncanmid): toggle spellcheck

function toggleSpellcheck( state ) {
	
	( state ) ? $('.CodeMirror').addClass('spellcheck') : $('.CodeMirror').removeClass('spellcheck')
}



//note(@duncanmid): toggle cursor position

function toggleCursorPosition( state ) {
	
	alert(state)
}



//note(@duncanmid): set zoom slider

ipcRenderer.on('set-zoom-slider', (event, message) => {
	
	applyZoom( message )
})



//note(@duncanmid): reload sidebar

ipcRenderer.on('reload-sidebar', () => {
	
	$('#sidebar').html('')
	apiCall('all')
})



//note(@duncanmid): spellcheck

ipcRenderer.on('spellcheck', (event, message) => {
	
	toggleSpellcheck( message )
})



//note(@duncanmid): modal

function openModal( url, width, height, resize ) {
	
	modal = new remote.BrowserWindow({
		
			parent: remote.getCurrentWindow(),
			modal: true,
			width: width,
			minWidth: width,
			maxWidth: width,
			height: height,
			minHeight: height,
			resizable: resize,
			show: false,
			backgroundColor: '#ececec'
		})
		
	modal.loadURL( url )
	
	modal.once('ready-to-show', () => {
		
		modal.show()
	})
}



//note(@duncanmid): log in modal

ipcRenderer.on('open-login-modal', (event, message) => {
	
	openModal( 'file://' + __dirname + '/../html/login.html', 480, 180, false )
})



//note(@duncanmid): close login modal

ipcRenderer.on('close-login-modal', (event, message) => {
	
	modal.close()
})



//note(@duncanmid): note menu commands

ipcRenderer.on('note', (event, message) => {
	
	let selected = store.get( 'appInterface.selected' )
	
	switch( message ) {
		
		case 'new':
			apiCall( 'new', null, {"content": "# New note"} )
		break
		
		case 'edit':
			if( selected ) editNote( selected )
		break
		
		case 'save':
			if( selected ) saveNote( selected )
		break
		
		case 'favorite':
			if( selected ) {
			
				let favorite = ( $(`#sidebar li button[data-id="${selected}"]`).attr('data-favorite') == 'true' ) ? false : true
			
				apiCall( 'update', selected, {"favorite": favorite} )
			}
		break
		
		case 'export':
			if( selected ) apiCall( 'export', selected )
		break
		
		case 'delete':
			if( selected ) deleteCheck( selected )
		break
	}
})



//note(@duncanmid): markdown menu commands

ipcRenderer.on('markdown', (event, message) => {
	
	if( !simplemde.isPreviewActive() ) {
		
		switch( message ) {
			
			case 'h1':
				simplemde.toggleHeading1()
			break
			case 'h2':
				simplemde.toggleHeading2()
			break
			case 'h3':
				simplemde.toggleHeading3()
			break
			case 'h4':
				simplemde.toggleHeading4()
			break
			case 'h5':
				simplemde.toggleHeading5()
			break
			case 'h6':
				simplemde.toggleHeading6()
			break
			case 'b':
				simplemde.toggleBold()
			break
			case 'i':
				simplemde.toggleItalic()
			break
			case 'del':
				simplemde.toggleStrikethrough()
			break
			case 'ul':
				simplemde.toggleUnorderedList()
			break
			case 'ol':
				simplemde.toggleOrderedList()
			break
			case 'a':
				simplemde.drawLink()
			break
			case 'img':
				simplemde.drawImage()
			break
			case 'code':
				simplemde.toggleCodeBlock()
			break
			case 'blockquote':
				simplemde.toggleBlockquote()
			break
			case 'table':
				simplemde.drawTable()
			break
			case 'hr':
				simplemde.drawHorizontalRule()
			break
		}
	}
})



//note(@duncanmid): html submenu menu commands

ipcRenderer.on('html', (event, message) => {
	
	
	if( !simplemde.isPreviewActive() ) {
		
		switch( message ) {
			
			case 'small':
			case 'sup':
			case 'sub':
			case 'u':
			case 'mark':
				wrapTextToSelection( `<${message}>`, `</${message}>` )
			break
			case 'dl':
				insertTextAtCursor(
`<dl>
	<dt>title</dt>
	<dd>description</dd>
	<dt>title</dt>
	<dd>description</dd>
</dl>` )
			break
		}
	}
})


//note(@duncanmid): view menu - zoom levels

ipcRenderer.on('set-zoom-level', (event, message) => {
	
	let zoom = store.get( 'appSettings.zoom' )
	
	switch( message ) {
		
		case 1:
			zoom++
			if( zoom > 16 ) zoom = 16
		break
		
		case -1:
			zoom--
			if( zoom < 4 ) zoom = 4
		break
		
		default:
			zoom = 10
	}
	
	store.set( 'appSettings.zoom', zoom )
	applyZoom( zoom )
})



//note(@duncanmid): context menu commanda

ipcRenderer.on('context-favorite', (event, message) => {
	
	let favorite = ( message.favorite == 'true' ) ? false : true,
		id 		= message.id
	
	apiCall( 'update', id, {"favorite": favorite} )
})


ipcRenderer.on('context-export', (event, id) => {
	
	apiCall( 'export', id )
})


ipcRenderer.on('context-delete', (event, id) => {
	
	deleteCheck( id )
})



//note(@duncanmid): on click sidebar button

$('body').on('click', '#sidebar li button', function(event) {
	
	event.stopPropagation()
	
	let id = $(this).data('id')
	
	$('#time').html('')
	$('#note').html('<div class="loader"></div>')
	
	$('#sidebar li button').removeClass('selected').removeClass('above-selected')
	$(this).addClass('selected').parent().prev().children().addClass('above-selected')
	
	apiCall( 'single', id )
	
	store.set( 'appInterface.selected', id )
})



//note(@duncanmid): on right click sidebar button

$('body').on('mouseup', '#sidebar li button', function(event) {
	
	event.stopPropagation()
	
	let data = {
		'id': $(this).data('id'),
		'title': $(this).data('title'),
		'favorite': $(this).attr('data-favorite')
	}
	
	if( event.which === 3 ) {
		
		ipcRenderer.send('show-sidebar-menu', data )
		return
	}
})


$('body').on('focus', '#sidebar li button', function(event) {
	
	$(this).parent().prev().children().addClass('above-selected')
})


$('body').on('focusout', '#sidebar li button', function(event) {
	
	if( !$(this).hasClass('selected') ) {
		
		$(this).parent().prev().children().removeClass('above-selected')
	}
})



//note(@duncanmid): on click empty sidebar

$('body').on('mouseup', 'aside', function(event) {
	
	if( event.which === 3 ) {
	
		ipcRenderer.send('show-sidebar-menu', null )
	}
})



//note(@duncanmid): open links in browser

$('body').on('click', '.editor-preview a', (event) => {
	
	event.preventDefault()
	
	let link = event.target.href
	//todo(@duncanmid): scroll to #anchor links
	if( link.substr(0, 4) !== 'file' ) shell.openExternal(link)
})



//note(@duncanmid): docready

$(document).ready(function() {

	toggleSpellcheck( store.get('appSettings.spellcheck') )
	
	if( !server || !username || !password ) {
		
		openModal( 'file://' + __dirname + '/../html/login.html', 480, 180, false )
		
	} else {
		
		apiCall('all')	
	}
	
	
	$('#edit').click(function() {
		
		editNote()
	})
})
