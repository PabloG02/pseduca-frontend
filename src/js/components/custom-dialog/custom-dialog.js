export default class CustomDialog extends HTMLElement {
    connectedCallback() {
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
    }

    open(title, content, onConfirm, options = {}) {
        this.querySelector('#dialog-title').textContent = title;
        this.querySelector('#dialog-description').innerHTML = content;
        this.querySelector('.confirm-button').onclick = onConfirm;

        if (options.showFooter === false) {
            this.querySelector('.dialog-footer').style.display = 'none';
        } else {
            this.querySelector('.dialog-footer').style.display = 'flex';
        }

        this.dialog.showModal();
    }

    close() {
        this.dialog.close();
    }
}

customElements.define('custom-dialog', CustomDialog);