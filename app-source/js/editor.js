'use strict'

const i18n 			= require( './i18n.min' )
const hljs			= require( 'highlight.js' )
const EasyMDE		= require( 'easymde' )

const modalWindow	= require( './modal.min' )

module.exports.easymdeSetup = {
	
	element: document.getElementById('note'),
	autoDownloadFontAwesome: false,
	autofocus: false,
	forceSync: true,
	status: false,
	spellChecker: false,
	inputStyle: "contenteditable",
	nativeSpellcheck: true,
	toolbar: [
				{
					name: "Heading",
					action: EasyMDE.toggleHeadingSmaller,
					className: "icon-heading",
					title: i18n.t('app:toolbar.heading', 'Heading'),
				},
				'|',
				{
					name: "bold",
					action: EasyMDE.toggleBold,
					className: "icon-b",
					title: i18n.t('app:toolbar.bold', 'Bold'),
				},
				{
					name: "italic",
					action: EasyMDE.toggleItalic,
					className: "icon-i",
					title: i18n.t('app:toolbar.italic', 'Italic'),
				},
				{
					name: "srtikethrough",
					action: EasyMDE.toggleStrikethrough,
					className: "icon-del",
					title: i18n.t('app:toolbar.strikethrough', 'Strikethrough'),
				},
				'|',
				{
					name: "unordered-list",
					action: EasyMDE.toggleUnorderedList,
					className: "icon-ul",
					title: i18n.t('app:toolbar.ul', 'Generic List'),
				},
				{
					name: "ordered-list",
					action: EasyMDE.toggleOrderedList,
					className: "icon-ol",
					title: i18n.t('app:toolbar.ol', 'Numbered List'),
				},
				{
					name: "checklist",
					action: (e) => {
						e.codemirror.replaceSelection('- [ ] ')
						e.codemirror.focus()
					},
					className: "icon-checklist",
					title: i18n.t('app:toolbar.checklist', 'Checkbox list (Shift-Cmd-Alt-L)'),
				},
				'|',
				{
					name: "link",
					action: () => {
						
						let editor = document.getElementById('edit')
						
						if( editor.classList.contains('editing') ) {
							
							modalWindow.openModal( `file://${__dirname}/../html/insert-hyperlink.html`, 480, 180, false )
						}	
					},
					className: "icon-a",
					title: i18n.t('app:toolbar.link', 'Create Link (Cmd-K)'),
				},
				{
					name: "image",
					action: EasyMDE.drawImage,
					className: "icon-img",
					title: i18n.t('app:toolbar.image', 'Insert Image'),
				},
				'|',
				{
					name: "code",
					action: EasyMDE.toggleCodeBlock,
					className: "icon-code",
					title: i18n.t('app:toolbar.code', 'Code'),
				},
				{
					name: "quote",
					action: EasyMDE.toggleBlockquote,
					className: "icon-blockquote",
					title: i18n.t('app:toolbar.quote', 'Quote'),
				},
				{
					name: "table",
					action: () => {
						
						let editor = document.getElementById('edit')
						
						if( editor.classList.contains('editing') ) {
							
							modalWindow.openModal( `file://${__dirname}/../html/insert-table.html`, 480, 220, false )
						}	
					},
					className: "icon-table",
					title: i18n.t('app:toolbar.table', 'Insert Table'),
				},
				{
					name: "horizontal-rule",
					action: EasyMDE.drawHorizontalRule,
					className: "icon-hr",
					title: i18n.t('app:toolbar.hr', 'Insert Horizontal Line'),
				},
			],
	shortcuts: {
		'drawLink': null,
		'toggleStrikethrough': 'Shift-Cmd-D',
		'toggleBlockquote': 'Cmd-\'',
		'drawTable': null,
		'drawHorizontalRule': 'Cmd--',
		'cleanBlock': null,
		'toggleSideBySide': null,
		'toggleFullScreen': null,
		'togglePreview': null
	},
	renderingConfig: {
		codeSyntaxHighlighting: true,
		hljs: hljs
	}
}
