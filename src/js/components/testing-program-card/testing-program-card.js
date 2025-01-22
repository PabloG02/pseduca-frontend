import I18nManager from "../../common/i18n-manager.js";

class TestingProgramCard extends HTMLElement {
    connectedCallback() {
        const name = this.getAttribute('name');
        const description = this.getAttribute('description');
        const imageUri = this.getAttribute('image-uri');
        const url = this.getAttribute('url');

        this.innerHTML = `
          <div class="testing-program-card">
            <div class="img-container">
              <img src="${imageUri}" alt="${imageAlt}">
              <h4>${name}</h4>
            </div>
            <p class="description">${description}</p>
            <h5 data-i18n="testing-program.characteristics">Characteristics</h5>
            <ul class="characteristics">
              <li><span data-i18n="testing-program.available-slots">Available slots</span>: ${availableSlots}</li>
              <li>
                <span data-i18n="testing-program.teaching-type">Teaching type</span>:&nbsp;
                <span data-i18n="testing-program.teaching-type.${teachingType.toLowerCase()}">${teachingType}</span>
              </li>
              <li>
                <span data-i18n="testing-program.offering-frequency">Offering frequency</span>:&nbsp;
                <span data-i18n="testing-program.offering-frequency.${offeringFrequency.toLowerCase()}">${offeringFrequency}</span>
              </li>
              <li><span data-i18n="testing-program.duration-ects">Duration (ECTS)</span>: ${durationEcts}</li>
              <li><span data-i18n="testing-program.location">Location</span>: ${location}</li>
            </ul>  
            <a class="secondary-button" href="${url}" target="_blank" data-i18n="testing-program.degree-webpage">Degree webpage</a>
          </div>
        `;

        // TODO: Find a better way to do it
        I18nManager.getInstance().translateDocument();
    }
}

customElements.define('testing-program-card', TestingProgramCard);
