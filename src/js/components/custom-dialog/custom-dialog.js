import { TiptapEditor } from '../tiptap-editor/tiptap-editor.js';

export default class CustomDialog extends HTMLElement {
    #validator;
    #htmlEditor;

    static get observedAttributes() {
        return ['data-controller'];
    }

    async connectedCallback() {
        this.innerHTML = `
            <dialog>
                <header class="dialog-header">
                    <h2 id="dialog-title"></h2>
                    <button class="close-button" aria-label="Close dialog">×</button>
                </header>
                <div class="dialog-body" id="dialog-description"></div>
                <footer class="dialog-footer">
                    <button class="button cancel-button">Cancel</button>
                    <button class="button confirm-button">Confirm</button>
                </footer>
            </dialog>
        `;
        this.dialog = this.querySelector('dialog');
        this.querySelector('.close-button').onclick = () => this.close();
        this.querySelector('.cancel-button').onclick = () => this.close();

        const modulePath = `../../validators/${this.getAttribute('data-controller')}-validator.js`;
        const ValidatorClass = await import(modulePath);
        this.#validator = new ValidatorClass.default();
    }

    open(title, content, onConfirm, options = {}) {
        this.querySelector('#dialog-title').textContent = title;
        this.querySelector('#dialog-description').innerHTML = content;
        // Validate the form inputs when the confirm button is clicked
        this.querySelector('.confirm-button').onclick = () => {
            const inputs = this.querySelectorAll('.form-input');
            let allValid = true;

            inputs.forEach(input => {
                try {
                    const errors = this.#validator.validateField(input.dataset.column, input.value);
                    if (errors.length > 0) {
                        allValid = false;
                    }
                } catch (error) {
                    console.warn(error);
                }
            });

            const editor = this.querySelector('.editor');
            if (editor) {
                try {
                    const editorContent = this.#htmlEditor.getHTML();
                    const errors = this.#validator.validateField(editor.dataset.column, editorContent);
                    if (errors.length > 0) {
                        allValid = false;
                    }
                } catch (error) {
                    console.warn(error);
                }
            }

            if (allValid) {
                onConfirm();
            }
        };

        // Hide the footer if the showFooter option is set to false (VIEW)
        if (options.showFooter === false) {
            this.querySelector('.dialog-footer').style.display = 'none';
        } else {
            this.querySelector('.dialog-footer').style.display = 'flex';
        }

        // Validate the form inputs when the input value changes
        this.querySelectorAll('.form-input').forEach(input => {
            input.oninput = (event) => {
                const parentElement = input.parentElement;
                const previousError = parentElement.querySelector('.message');

                try {
                    // Validate the input value
                    const errors = this.#validator.validateField(input.dataset.column, input.value);

                    // Remove the error message and class if the input is valid
                    if (previousError && errors.length === 0) {
                        previousError.remove();
                        parentElement.classList.remove('error');
                    }

                    // If the input is invalid, add an error message and error class
                    if (errors.length > 0) {
                        let errorElement = document.createElement('p');
                        if (previousError) {
                            errorElement = previousError;
                        }
                        errorElement.innerHTML = '';
                        errors.forEach(error => {
                            errorElement.innerHTML += error.message + '<br>';
                        });
                        errorElement.className = 'message';

                        parentElement.classList.add('error');
                        parentElement.appendChild(errorElement);
                    }
                } catch (error) {
                    console.warn(error);
                }
            }
        });

        const editor = this.querySelector('.editor');
        if (editor) {
            this.#htmlEditor = new TiptapEditor({
                element: '.editor',
                content: editor.innerHTML,
            });
        }

        this.dialog.showModal();
    }

    close() {
        this.dialog.close();
    }
}

customElements.define('custom-dialog', CustomDialog);