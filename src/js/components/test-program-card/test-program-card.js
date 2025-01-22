import I18nManager from "../../common/i18n-manager.js";

class TestProgramCard extends HTMLElement {
    connectedCallback() {
        const name = this.getAttribute('name');
        const description = this.getAttribute('description');
        const imageUri = this.getAttribute('image-uri');
        const imageAlt = this.getAttribute('image-alt');
        const url = this.getAttribute('url');

        this.innerHTML = `
          <div class="card">
              <img src="${imageUri}" alt="${imageAlt}" class="card-image">
              <div class="card-content">
                  <div class="card-name">${name}</div>
                  <div id="description" class="card-description">${description}</div>
                  <button id="toggle-btn" class="toggle-description">Read More</button>
                  <a href="${url}" target="_blank" class="card-button">Access program</a>
              </div>
          </div>
        `;

        // Add event listener to the button
        const toggleBtn = this.querySelector('#toggle-btn');
        const descriptionElm = this.querySelector('#description');
        toggleBtn.addEventListener('click', () => {
            descriptionElm.classList.toggle('expanded');
            toggleBtn.textContent = descriptionElm.classList.contains('expanded') ? 'Read Less' : 'Read More';
        });

        // TODO: Find a better way to do it
        I18nManager.getInstance().translateDocument();
    }
}

customElements.define('test-program-card', TestProgramCard);
