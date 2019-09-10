'use strict'

const i18n = require( './i18n.min' )

const { ipcRenderer, shell, remote } = require( 'electron' )

const path				= require('path')
const Store				= require( 'electron-store' )
const store				= new Store()
const dialog			= remote.dialog
const dateFormat		= require( 'dateformat' )
const $					= require( 'jquery' )
const marked			= require( 'marked' )
const removeMarkdown	= require( 'remove-markdown' )
const pretty			= require( 'pretty' )
const fs				= require( 'fs-extra' )
const EasyMDE			= require( 'easymde' )

const 	server 		= store.get( 'loginCredentials.server' ),
		username 	= store.get( 'loginCredentials.username' ),
		password 	= store.get( 'loginCredentials.password' )

let database = new Store({
	name: 'database',
	notes: {}
})


let modal

let easymdeSetup = {
		
		element: $('#note')[0],
		autofocus: false,
		forceSync: true,
		status: false,
		spellChecker: true,
		toolbar: [	
					{
						name: "Heading",
						action: EasyMDE.toggleHeadingSmaller,
						className: "fa fa-header",
						title: i18n.t('app:toolbar.heading', 'Heading'),
					},
					'|',
					{
						name: "bold",
						action: EasyMDE.toggleBold,
						className: "fa fa-bold",
						title: i18n.t('app:toolbar.bold', 'Bold'),
					},
					{
						name: "italic",
						action: EasyMDE.toggleItalic,
						className: "fa fa-italic",
						title: i18n.t('app:toolbar.italic', 'Italic'),
					},
					{
						name: "srtikethrough",
						action: EasyMDE.toggleStrikethrough,
						className: "fa fa-strikethrough",
						title: i18n.t('app:toolbar.strikethrough', 'Strikethrough'),
					},
					'|',
					{
						name: "unordered-list",
						action: EasyMDE.toggleUnorderedList,
						className: "fa fa-list-ul",
						title: i18n.t('app:toolbar.ul', 'Generic List'),
					},
					{
						name: "ordered-list",
						action: EasyMDE.toggleOrderedList,
						className: "fa fa-list-ol",
						title: i18n.t('app:toolbar.ol', 'Numbered List'),
					},
					'|',
					{
						name: "link",
						action: EasyMDE.drawLink,
						className: "fa fa-link",
						title: i18n.t('app:toolbar.link', 'Create Link'),
					},
					{
						name: "image",
						action: EasyMDE.drawImage,
						className: "fa fa-picture-o",
						title: i18n.t('app:toolbar.image', 'Insert Image'),
					},
					'|',
					{
						name: "code",
						action: EasyMDE.toggleCodeBlock,
						className: "fa fa-code",
						title: i18n.t('app:toolbar.code', 'Code'),
					},
					{
						name: "quote",
						action: EasyMDE.toggleBlockquote,
						className: "fa fa-quote-left",
						title: i18n.t('app:toolbar.quote', 'Quote'),
					},
					{
						name: "table",
						action: EasyMDE.drawTable,
						className: "fa fa-table",
						title: i18n.t('app:toolbar.table', 'Insert Table'),
					},
					{
						name: "horizontal-rule",
						action: EasyMDE.drawHorizontalRule,
						className: "fa fa-minus",
						title: i18n.t('app:toolbar.hr', 'Insert Horizontal Line'),
					},
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

let easymde = new EasyMDE( easymdeSetup )



//note(@duncanmid): dateFormat i18n setup

dateFormat.i18n = {
	dayNames: [
		i18n.t('date:sun', 'Sun'),
		i18n.t('date:mon', 'Mon'),
		i18n.t('date:tue', 'Tue'),
		i18n.t('date:wed', 'Wed'),
		i18n.t('date:thu', 'Thu'),
		i18n.t('date:fri', 'Fri'),
		i18n.t('date:sat', 'Sat'),
		i18n.t('date:sunday', 'Sunday'),
		i18n.t('date:monday', 'Monday'),
		i18n.t('date:tuesday', 'Tuesday'),
		i18n.t('date:wednesday', 'Wednesday'),
		i18n.t('date:thursday', 'Thursday'),
		i18n.t('date:friday', 'Friday'),
		i18n.t('date:saturday', 'Saturday')
	],
	monthNames: [
		i18n.t('date:jan', 'Jan'),
		i18n.t('date:feb', 'Feb'),
		i18n.t('date:mar', 'Mar'),
		i18n.t('date:apr', 'Apr'),
		i18n.t('date:_may', 'May'),
		i18n.t('date:jun', 'Jun'),
		i18n.t('date:jul', 'Jul'),
		i18n.t('date:aug', 'Aug'),
		i18n.t('date:sep', 'Sep'),
		i18n.t('date:oct', 'Oct'),
		i18n.t('date:nov', 'Nov'),
		i18n.t('date:dec', 'Dec'),
		i18n.t('date:january', 'January'),
		i18n.t('date:february', 'February'),
		i18n.t('date:march', 'March'),
		i18n.t('date:april', 'April'),
		i18n.t('date:may', 'May'),
		i18n.t('date:june', 'June'),
		i18n.t('date:july', 'July'),
		i18n.t('date:august', 'August'),
		i18n.t('date:september', 'September'),
		i18n.t('date:october', 'October'),
		i18n.t('date:november', 'November'),
		i18n.t('date:december', 'December')
	],
	timeNames: [
		i18n.t('date:a', 'a'),
		i18n.t('date:p', 'p'),
		i18n.t('date:am', 'am'),
		i18n.t('date:pm', 'pm'),
		i18n.t('date:_a', 'A'),
		i18n.t('date:_p', 'P'),
		i18n.t('date:_am', 'AM'),
		i18n.t('date:_pm', 'PM')
	]
}



//note(@duncanmid): call notes api

function apiCall( call, id, body ) {
	
	let method
	
	switch( call ) {
		
		case 'new':
			method = 'POST'
		break
		
		case 'save':
		case 'update':
		case 'category':
			method = 'PUT'
		break
		
		case 'delete':
			method = 'DELETE'
		break
		
		default: //all, single or export
			method = 'GET'
	}
	
	let url = '/index.php/apps/notes/api/v0.2/notes',
	init = {
		
		method: method,
		headers: {
			'Authorization': 'Basic ' + btoa( username + ':' + password ),
			'Content-Type': 'application/json',
		},
		mode: 'cors',
		cache: 'no-store'
	}
	
	if( id ) { url += `/${id}` }
	if( body ) { init.body = JSON.stringify( body ) }
	
	console.log( `URL: ${server}${url}` )
	
	fetch(server + url, init).then(function(response) {
	
		if (response.ok) {
			
			console.log('response OK')
			return response.text()
		
		} else {
			
			dialog.showErrorBox(
				i18n.t('app:dialog.error.server.title', 'Server connection error'),
				i18n.t('app:dialog.error.server.text', 'there was an error connecting to') + `:\n${server}`
			)
			
			console.log( response.error() )
		}
	
	}).then(function(message) {
		
		
		let notes = JSON.parse(message)
		
		
		if (notes['status'] == 'error') {
			
			dialog.showErrorBox(
				i18n.t('app:dialog.error.json.title', 'JSON parsing error'),
				i18n.t('app:dialog.error.json.text', 'An error occured parsing the notes')
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
			
			case 'category':
			
				$('#sidebar').html('')
				apiCall('sidebar')
				
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
			i18n.t('app:dialog.error.server.title', 'Server connection error'),
			i18n.t('app:dialog.error.server.text', 'there was an error connecting to') + `:\n${server}`
		)
		
		console.log(error)
	})
}



//note reset editor

function resetEditor() {
	
	easymde.codemirror.setValue('')
	easymde.value('')
	$('.editor-preview').html('')
}



//note(@duncanmid): codeMirror - insert / wrap text

function insertTextAtCursor( text ) {
	
	let note = easymde.codemirror.getDoc()
	let cursor = note.getCursor()
	note.replaceRange(text, cursor)
}

function wrapTextToSelection( start, end ) {
	
	let note = easymde.codemirror.getDoc()
	let selection = note.getSelection()
	note.replaceSelection( start + selection + end )
}



//note(@duncanmid): build category list

function saveCategories( array ) {
	
	$('#categories').empty()
	
	let compressed = [],
	copy = array.slice(0),
	results = []
	
	for (var i = 0; i < array.length; i++) {
	
		var theCount = 0
		
		for (var w = 0; w < copy.length; w++) {
			
			if (array[i] == copy[w]) {
				
				theCount++
				delete copy[w]
			}
		}
		
		if (theCount > 0) {
			
			var a = new Object()
			a.value = array[i]
			a.count = theCount
			compressed.push(a)
		}
	}
	
	for ( let item of compressed ) {
		
		let theItem		= item.value,
			theID 		= theItem.replace(' ', '_')
		
		if( theItem.length > 0 ) {
		
			results.push( { "item": theItem , "catID": theID } )
			
			$('#categories').append(`<li><button class="custom" data-catid="${theID}" data-category="${theItem}" title="${theItem}">${theItem}</button></li>`)
		}
	}
	
	$(`.categories button[data-catid="${store.get('categories.selected')}"]`).addClass( 'selected' )
	
	showHideCategoryIcons()
	store.set( 'categories.list', results )
}



//note(@duncanmid): hide category icons when a custom category is selected

function showHideCategoryIcons() {
	
	if( $('.categories button.selected').hasClass( 'custom' ) ) {
		
		$('#sidebar').addClass( 'hidecats' )
		
	} else {
		
		$('#sidebar').removeClass( 'hidecats' )
	}
}


//note(@duncanmid): generate ordered sidebar entries

function listNotes( array, sidebar ) {
	
	//issue(@duncanmid): invesitgate restructuring notes array
	
	if( sidebar !== null ) {
		
		database.set('notes', array)
	}
	
	const date = new Date()
	
	let sortby 	= store.get( 'appSettings.sortby' ),
		orderby = store.get( 'appSettings.orderby' ),
		allCats = []
	
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
		
		let theDate = new Date( item.modified ),
			formattedDate = formatDate( theDate.getTime() )
		
		let	catClass = ( item.category ) ? item.category.replace(' ', '_') : '##none##'
		
		let	theCat = ( item.category ) ? item.category : i18n.t('app:categories.none', 'Uncategorised')
		
		let plainTxt = removeMarkdown( item.content.replace(/(!\[.*\]\(.*\)|<[^>]*>|>|<)/g, ''))
		
		if( plainTxt ) {

			plainTxt = plainTxt.substr(0, 120).slice(item.title.length)
			
		} else {
			
			plainTxt = i18n.t('app:sidebar.notext', 'No additional text')
		}
		
		$('#sidebar').append(
		`<li>
			<button data-id="${item.id}" data-title="${item.title}" data-content="" data-catid="${catClass}" data-category="${item.category}" data-favorite="${item.favorite}">
				<span class="side-title">${item.title}</span>
				<span class="side-text">${formattedDate}&nbsp;&nbsp;<span class="excerpt">${plainTxt}</span></span>
				<span class="side-cat">${theCat}</span>
			</button>
		</li>
		`)
		
		allCats.push( item.category )
	}
	
	( sidebar ) ? getSelected( 'sidebar' ) : getSelected()
	
	saveCategories( allCats )
	selectCategory( store.get('categories.selected') )
}



//note(@duncanmid): formatDate

function formatDate( timestamp ) {
	
	let today		= new Date(),
		yesterday	= new Date(),
		week		= new Date()
	
	today.setHours( 0, 0, 0, 0 )
	yesterday.setHours( 0, 0, 0, 0 )
	yesterday.setDate( yesterday.getDate() - 1 )
	week.setHours( 0, 0, 0, 0 )
	week.setDate( week.getDate() - 7 )
	
	
	if( ( today.getTime() / 1000 ) < timestamp ) {
		
		//if today - show time
		return dateFormat( timestamp * 1000, 'H:MM' )
	
	} else if ( ( yesterday.getTime() / 1000 ) < timestamp ) {
		
		//if yesterday - show string
		return i18n.t('date:yesterday', 'yesterday')
	
	} else if ( ( week.getTime() / 1000 ) < timestamp ) {
		
		//if last week - show day
		return dateFormat( timestamp * 1000, 'dddd' )
	
	} else {
		
		//else - show date
		return dateFormat( timestamp * 1000, 'dd/mm/yy' )
	}
}



//note(@duncanmid): display single note

function displayNote( note ) {
	
	let prep = i18n.t('app:date.titlebar', 'at'),
		date = dateFormat(note.modified * 1000, "d mmmm, yyyy"),
		time = dateFormat(note.modified * 1000, "HH:MM")
	
	$('.CodeMirror-code').addClass('hide')
	$('#edit').removeClass('editing')
	
	$('#time').html( `${date} ${prep} ${time}` )
	
	resetEditor()
	
	if( easymde.isPreviewActive() ) easymde.togglePreview()
	
	$('#note').attr('data-id', note.id)
	easymde.value( note.content )
	easymde.codemirror.clearHistory()
	easymde.togglePreview()
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
		
		if( easymde.isPreviewActive() ) {
		
			$('#edit').attr('title', i18n.t('app:main.button.save', 'Save Note')).addClass('editing')
			easymde.togglePreview()
			easymde.codemirror.focus()
			
			if( store.get('appSettings.cursor') == 'end' ) {
				
				easymde.codemirror.setCursor(easymde.codemirror.lineCount(), 0)
			}
		
		} else {
			
			if( easymde.codemirror.historySize().undo > 0 ) {
			
				let response = dialog.showMessageBox(remote.getCurrentWindow(), {
								message: i18n.t('app:dialog.save.title', 'You have made changes to this note'),
								detail: i18n.t('app:dialog.save.text', 'Do you want to save them?'),
								buttons: [i18n.t('app:dialog.button.savechanges', 'Save changes'), i18n.t('app:dialog.button.cancel', 'Cancel')]
							})
				
				if( response === 0 ) {
					
					let content = easymde.value()
					
					easymde.codemirror.clearHistory()
					
					apiCall( 'save', selected, {"content": content, "modified": Math.floor(Date.now() / 1000) } )
				
				} else {
			
					while ( easymde.codemirror.historySize().undo > 0) easymde.codemirror.undo()
				}
			}
			
			easymde.togglePreview()
			$('#edit').attr('title', i18n.t('app:main.button.edit', 'Edit Note')).removeClass('editing').focus()
		}
	}
}



//note(@duncanmid): save note

function saveNote( id ) {
	
		if(	!easymde.isPreviewActive() &&
			easymde.codemirror.historySize().undo > 0 ) {
			
			let content = easymde.value()
						
			//easymde.codemirror.clearHistory()
						
			apiCall( 'save', id, {"content": content, "modified": Math.floor(Date.now() / 1000) } )
		}
}



//note(@duncanmid): export note

function exportNote( note ) {
	
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
				
				body: i18n.t('app:notification.export.text', 'The note {{title}} has been exported as {{filetype}}', {title: note.title, filetype: filetype})
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
							message: i18n.t('app:dialog.delete.title', 'Are you sure you want to delete this note?'),
							detail: i18n.t('app:dialog.delete.text', 'This operation is not reversable.'),
							buttons: [i18n.t('app:dialog.button.delete', 'Delete Note'), i18n.t('app:dialog.button.cancel', 'Cancel')]
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



//note(@duncanmid): show / hide categories

function toggleCategories( state ) {
	
	$('#sidebar').toggleClass( 'showcats' )
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



//note(@duncanmid): display categories

ipcRenderer.on('showcats', (event, message) => {
	
	toggleCategories( message )
})



//note(@duncanmid): update-theme

ipcRenderer.on('set-theme', (event, message) => {
	
	__setTheme()
})



//note(@duncanmid): toggle-sidebar

ipcRenderer.on('toggle-categories', (event, message) => {
	
	$('#frame, footer').toggleClass('slide')
	
	let cats = store.get( 'appInterface.categories' ) ? false : true
	store.set( 'appInterface.categories', cats )
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
			frame: false,
			transparent: true,
			webPreferences: {
				devTools: false,
				preload: path.join(__dirname, './preload.min.js'),
				nodeIntegration: true
			}	
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
			
			let body
			
			switch( store.get( 'categories.selected' ) ) {
			
				case '##all##':
				case '##none##':
					
					body = {
						"content": '# ' +  i18n.t('app:sidebar.new', 'New note')
					}
					
				break
				
				case '##fav##':
					
					body = {
						"content": '# ' +  i18n.t('app:sidebar.new', 'New note'),
						"favorite": true
					}
					
				break
				
				default:
					
					body = {
						"content": '# ' +  i18n.t('app:sidebar.new', 'New note'),
						"category": $('.categories li button.selected').data('category')
					}
			}
			
			apiCall( 'new', null, body )
			
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
	
	if( !easymde.isPreviewActive() ) {
		
		switch( message ) {
			
			case 'h1':
				easymde.toggleHeading1()
			break
			case 'h2':
				easymde.toggleHeading2()
			break
			case 'h3':
				easymde.toggleHeading3()
			break
			case 'h4':
				easymde.toggleHeading4()
			break
			case 'h5':
				easymde.toggleHeading5()
			break
			case 'h6':
				easymde.toggleHeading6()
			break
			case 'b':
				easymde.toggleBold()
			break
			case 'i':
				easymde.toggleItalic()
			break
			case 'del':
				easymde.toggleStrikethrough()
			break
			case 'ul':
				easymde.toggleUnorderedList()
			break
			case 'ol':
				easymde.toggleOrderedList()
			break
			case 'a':
				easymde.drawLink()
			break
			case 'img':
				easymde.drawImage()
			break
			case 'code':
				easymde.toggleCodeBlock()
			break
			case 'blockquote':
				easymde.toggleBlockquote()
			break
			case 'table':
				easymde.drawTable()
			break
			case 'hr':
				easymde.drawHorizontalRule()
			break
		}
	}
})



//note(@duncanmid): html submenu menu commands

ipcRenderer.on('html', (event, message) => {
	
	
	if( !easymde.isPreviewActive() ) {
		
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
	<dt>${i18n.t('app:main.title', 'title')}</dt>
	<dd>${i18n.t('app:main.description', 'description')}</dd>
	<dt>${i18n.t('app:main.title', 'title')}</dt>
	<dd>${i18n.t('app:main.description', 'description')}</dd>
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



//note(@duncanmid): context menu commands

ipcRenderer.on('context-favorite', (event, message) => {
	
	let favorite 	= ( message.favorite == 'true' ) ? false : true,
		id 			= message.id
	
	apiCall( 'update', id, {"favorite": favorite} )
})


ipcRenderer.on('context-export', (event, id) => {
	
	apiCall( 'export', id )
})


ipcRenderer.on('context-delete', (event, id) => {
	
	deleteCheck( id )
})


ipcRenderer.on('context-category', (event, message) => {
	
	let id 			= message.id,
		category	= message.category,
		notes		= database.get('notes')
	
	let note = notes.find( x => x.id === message.id )
	
	apiCall( 'category', id, {
		
		"modified": 	note.modified,
		"content": 		note.content,
		"category":		category
	})
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
		'id': 		$(this).data('id'),
		'title': 	$(this).data('title'),
		'favorite': $(this).attr('data-favorite'),
		'category': $(this).attr('data-category'),
		'catID': 	$(this).attr('data-catid')
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
	if( link.substr(0, 4) !== 'file' ) shell.openExternal(link)
})



//note(@duncanmid): change category

$('body').on('click', '.categories button', function(event) {
	
	let cat = $(this).attr( 'data-category' ),
		catid = $(this).attr( 'data-catid' )
	
	$('.categories button').removeClass('selected')
	$(this).addClass('selected')
	
	store.set( 'categories.selected', catid )
	
	selectCategory( catid )
	showHideCategoryIcons()
})



//issue(@duncanmid): find correct location for this

function selectCategory( catid ) {
	
	switch( catid ) {
		
		case '##all##':
			 
			$(`#sidebar button`).show()
			
		break
		
		case '##fav##':
			
			$(`#sidebar button`).hide()
			$(`#sidebar button[data-favorite='true']`).show()
			
		break
		
		default:
			
			$(`#sidebar button`).hide()
			$(`#sidebar button[data-catid='${catid}']`).show()	
		break
	}
}


//note(@duncanmid): docready

$(document).ready(function() {
	
	//note(@duncanmid): set lang
	
	$('html').attr('lang', i18n.language)
	
	//note(@duncanmid): display categories in sidebar 
	
	if( store.get( 'appSettings.showcats' ) ) {
		
		$('#sidebar').addClass( 'showcats' )
	}
	
	
	//note(@duncanmid): toggle categories sidebar
	
	if( store.get( 'appInterface.categories' ) ) {
		
		$('#frame, footer').addClass( 'slide' )
	}
	
	
	//note(@duncanmid): set spellcheck
	
	toggleSpellcheck( store.get('appSettings.spellcheck') )
	
	
	//note(@duncanmid): set edit button title
	
	$('#edit').attr('title', i18n.t('app:main.button.edit', 'Edit Note'))
	
	
	//note(@duncanmid): set categories strings
	
	$('#cat-title').html( i18n.t('app:categories.title', 'Categories'))
	$('#cat-all').html( i18n.t('app:categories.all', 'All notes'))
	$('#cat-all').attr('title', i18n.t('app:categories.all', 'All notes'))
	$('#cat-fav').html( i18n.t('app:categories.fav', 'Favorites'))
	$('#cat-fav').attr('title', i18n.t('app:categories.fav', 'Favorites'))
	$('#cat-none').html( i18n.t('app:categories.none', 'Uncategorised'))
	$('#cat-none').attr('title', i18n.t('app:categories.none', 'Uncategorised'))
	
	
	//note(@duncanmid): check login
	
	if( !server || !username || !password ) {
		
		openModal( 'file://' + __dirname + '/../html/login.html', 480, 180, false )
		
	} else {
		
		apiCall('all')
	}
	
	
	//note(@duncanmid): edit save
	
	$('#edit').click(function() {
		
		editNote()
	})
})
