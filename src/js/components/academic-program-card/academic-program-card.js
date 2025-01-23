import I18nManager from "../../common/i18n-manager.js";

class AcademicProgramCard extends HTMLElement {
    connectedCallback() {
        const name = this.getAttribute('name');
        const qualificationLevel = this.getAttribute('qualification-level');
        const description = this.getAttribute('description');
        const imageUri = this.getAttribute('image-uri');
        const imageAlt = this.getAttribute('image-alt');
        const availableSlots = this.getAttribute('available-slots');
        const teachingType = this.getAttribute('teaching-type');
        const offeringFrequency = this.getAttribute('offering-frequency');
        const durationEcts = this.getAttribute('duration-ects');
        const location = this.getAttribute('location');
        const url = this.getAttribute('url');

        this.innerHTML = `
          <div class="academic-program-card">
            <div class="img-container">
              <img src="${imageUri}" alt="${imageAlt}">
              <h4>${name}</h4>
            </div>
            <p class="description">${description}</p>
            <h5 data-i18n="academic-program.characteristics">Characteristics</h5>
            <ul class="characteristics">
              <li><span data-i18n="academic-program.available-slots">Available slots</span>: ${availableSlots}</li>
              <li>
                <span data-i18n="academic-program.teaching-type">Teaching type</span>:&nbsp;
                <span data-i18n="academic-program.teaching-type.${teachingType.toLowerCase()}">${teachingType}</span>
              </li>
              <li>
                <span data-i18n="academic-program.offering-frequency">Offering frequency</span>:&nbsp;
                <span data-i18n="academic-program.offering-frequency.${offeringFrequency.toLowerCase()}">${offeringFrequency}</span>
              </li>
              <li><span data-i18n="academic-program.duration-ects">Duration (ECTS)</span>: ${durationEcts}</li>
              <li><span data-i18n="academic-program.location">Location</span>: ${location}</li>
            </ul>  
            <a class="secondary-button" href="${url}" target="_blank" data-i18n="academic-program.degree-webpage">Degree webpage</a>
          </div>
        `;

        // TODO: Find a better way to do it
        I18nManager.getInstance().translateDocument();
    }
}

customElements.define('academic-program-card', AcademicProgramCard);
