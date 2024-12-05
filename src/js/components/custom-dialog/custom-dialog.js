export default class CustomDialog extends HTMLElement {
    #validator;

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
        this.querySelector('.confirm-button').onclick = () => {
            const inputs = this.querySelectorAll('.form-input');
            let allValid = true;

            inputs.forEach(input => {
                try {
                    const isValid = this.#validator.validate(input.dataset.column, input.value);
                    if (!isValid) {
                        allValid = false;
                    }
                } catch (error) {
                    console.warn(error);
                }
            });

            if (allValid) {
                onConfirm();
            }
        };

        if (options.showFooter === false) {
            this.querySelector('.dialog-footer').style.display = 'none';
        } else {
            this.querySelector('.dialog-footer').style.display = 'flex';
        }

        this.querySelectorAll('.form-input').forEach(input => {
            input.oninput = (event) => {
                try {
                    const isValid = this.#validator.validate(input.dataset.column, input.value);
                    console.log(isValid);
                } catch (error) {
                    console.warn(error);
                }
            }
        });

        this.dialog.showModal();
    }

    close() {
        this.dialog.close();
    }
}

customElements.define('custom-dialog', CustomDialog);