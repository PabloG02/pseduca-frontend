import I18nManager from "../../common/i18n-manager.js";

import { Editor } from 'https://cdn.jsdelivr.net/npm/@tiptap/core@2.2.6/+esm'
import StarterKit from 'https://cdn.jsdelivr.net/npm/@tiptap/starter-kit@2.2.6/+esm'
import { Color } from 'https://cdn.jsdelivr.net/npm/@tiptap/extension-color@2.2.6/+esm'
import Link from 'https://cdn.jsdelivr.net/npm/@tiptap/extension-link@2.2.6/+esm'
import TextStyle from 'https://cdn.jsdelivr.net/npm/@tiptap/extension-text-style@2.2.6/+esm'

export class TiptapEditor {
    constructor(options = {}) {
        this.container = options.container || '.editor';
        this.content = options.content || '<p>Hello! This is a basic Tiptap editor.</p>';
        // this.onUpdate = options.onUpdate || (({ editor }) => console.log(editor.getHTML()));

        this.buttons = [
            { command: 'bold', label: 'Bold' },
            { command: 'italic', label: 'Italic' },
            { command: 'strike', label: 'Strike' },
            { command: 'code', label: 'Code' },
            { command: 'color', label: 'Color' },
            { command: 'h1', label: 'H1' },
            { command: 'h2', label: 'H2' },
            { command: 'h3', label: 'H3' },
            { command: 'h4', label: 'H4' },
            { command: 'h5', label: 'H5' },
            { command: 'h6', label: 'H6' },
            { command: 'bulletList', label: 'Bullet List' },
            { command: 'orderedList', label: 'Numbered List' },
            { command: 'link', label: 'Link' },
            { command: 'unlink', label: 'Unlink' },
            { command: 'blockquote', label: 'Blockquote' },
            { command: 'horizontalRule', label: 'Horizontal Rule' },
            { command: 'undo', label: 'Undo' },
            { command: 'redo', label: 'Redo' },
        ];

        this.init();
    }

    createDOM() {
        const container = document.querySelector(this.container);
        if (!container) throw new Error('Container element not found');

        container.innerHTML = `
            <nav class="menu-bar">
                ${this.buttons.map(btn => {
                    switch (btn.command) {
                        case 'color':
                            return `<input type="color" data-command="${btn.command}" title="${btn.label}" />`;
                        default:
                            return `<button data-command="${btn.command}" data-i18n="editor.command.${btn.command}">${btn.label}</button>`;
                    }
                }).join('')}
            </nav>
            <div class="content"></div>
        `;
    }

    initEditor() {
        const element = document.querySelector(`${this.container} .content`);

        this.editor = new Editor({
            element: element,
            extensions: [
                StarterKit,
                Color,
                Link.configure({
                    openOnClick: false,
                    HTMLAttributes: {
                        rel: 'noopener noreferrer nofollow',
                    },
                }),
                TextStyle,
            ],
            content: this.content,
            // onUpdate: this.onUpdate
        });
    }

    setLink() {
        const previousUrl = this.editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        // cancelled
        if (url === null) {
            return;
        }

        // empty
        if (url === '') {
            this.editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        // sanitize URL before setting
        let sanitizedUrl = url;
        try {
            sanitizedUrl = new URL(url).toString();
        } catch (e) {
            // If URL parsing fails, try adding https://
            try {
                sanitizedUrl = new URL(`https://${url}`).toString();
            } catch (e) {
                console.error('Invalid URL');
                return;
            }
        }

        // update link
        this.editor.chain().focus().extendMarkRange('link').setLink({ href: sanitizedUrl }).run();
    }

    handleCommand(command) {
        switch(command) {
            case 'bold':
                return this.editor.chain().focus().toggleBold().run();
            case 'italic':
                return this.editor.chain().focus().toggleItalic().run();
            case 'strike':
                return this.editor.chain().focus().toggleStrike().run();
            case 'code':
                return this.editor.chain().focus().toggleCode().run();
            case 'h1':
                return this.editor.chain().focus().toggleHeading({ level: 1 }).run();
            case 'h2':
                return this.editor.chain().focus().toggleHeading({ level: 2 }).run();
            case 'h3':
                return this.editor.chain().focus().toggleHeading({ level: 3 }).run();
            case 'h4':
                return this.editor.chain().focus().toggleHeading({ level: 4 }).run();
            case 'h5':
                return this.editor.chain().focus().toggleHeading({ level: 5 }).run();
            case 'h6':
                return this.editor.chain().focus().toggleHeading({ level: 6 }).run();
            case 'bulletList':
                return this.editor.chain().focus().toggleBulletList().run();
            case 'orderedList':
                return this.editor.chain().focus().toggleOrderedList().run();
            case 'link':
                return this.setLink();
            case 'unlink':
                return this.editor.chain().focus().unsetLink().run();
            case 'blockquote':
                return this.editor.chain().focus().toggleBlockquote().run();
            case 'horizontalRule':
                return this.editor.chain().focus().setHorizontalRule().run();
            case 'undo':
                return this.editor.chain().focus().undo().run();
            case 'redo':
                return this.editor.chain().focus().redo().run();
        }
    }

    updateButtonStates() {
        const buttons = document.querySelectorAll(`${this.container} .menu-bar button`);
        buttons.forEach(button => {
            const command = button.dataset.command;

            switch(command) {
                case 'bold':
                    button.classList.toggle('active', this.editor.isActive('bold'));
                    break;
                case 'italic':
                    button.classList.toggle('active', this.editor.isActive('italic'));
                    break;
                case 'strike':
                    button.classList.toggle('active', this.editor.isActive('strike'));
                    break;
                case 'code':
                    button.classList.toggle('active', this.editor.isActive('code'));
                    break;
                case 'h1':
                    button.classList.toggle('active', this.editor.isActive('heading', { level: 1 }));
                    break;
                case 'h2':
                    button.classList.toggle('active', this.editor.isActive('heading', { level: 2 }));
                    break;
                case 'h3':
                    button.classList.toggle('active', this.editor.isActive('heading', { level: 3 }));
                    break;
                case 'h4':
                    button.classList.toggle('active', this.editor.isActive('heading', { level: 4 }));
                    break;
                case 'h5':
                    button.classList.toggle('active', this.editor.isActive('heading', { level: 5 }));
                    break;
                case 'h6':
                    button.classList.toggle('active', this.editor.isActive('heading', { level: 6 }));
                    break;
                case 'bulletList':
                    button.classList.toggle('active', this.editor.isActive('bulletList'));
                    break;
                case 'orderedList':
                    button.classList.toggle('active', this.editor.isActive('orderedList'));
                    break;
                case 'link':
                    button.classList.toggle('active', this.editor.isActive('link'));
                    break;
                case 'blockquote':
                    button.classList.toggle('active', this.editor.isActive('blockquote'));
                    break;
            }
        });
    }

    setupEventListeners() {
        const buttons = document.querySelectorAll(`${this.container} .menu-bar button`);
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const command = button.dataset.command;
                this.handleCommand(command);
            });
        });

        const colorInput = document.querySelector(`${this.container} .menu-bar input[type="color"]`);
        colorInput.addEventListener('input', (event) => {
            this.editor.chain().focus().setColor(event.target.value).run();
        });

        this.editor.on('update', () => {
            this.updateButtonStates();
        });

        this.editor.on('selectionUpdate', () => {
            this.updateButtonStates();
        });
    }

    init() {
        this.createDOM();
        I18nManager.getInstance().translateDocument();
        this.initEditor();
        this.setupEventListeners();
    }

    destroy() {
        this.editor.destroy();
    }

    getHTML() {
        return this.editor.getHTML();
    }

    getText() {
        return this.editor.getText();
    }
}
