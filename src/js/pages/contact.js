import DataService from "../common/data-service.js";

class ContactPage {
    #dataService;

    constructor() {
        this.#dataService = new DataService("contact");
    }

    async #fetchContactInfo() {
        const {data} = await this.#dataService.fetchData();
        return data;
    }

    async renderContactInfo() {
        const contactInfo = await this.#fetchContactInfo();
        const contactDetailsContainer = document.getElementsByClassName('contact-details-section')[0];

        contactInfo.forEach(set => {
            const contactDetails = document.createElement('contact-details');
            contactDetails.setAttribute('address', set.address);
            contactDetails.setAttribute('email', set.email);
            contactDetails.setAttribute('phone', set.phone);
            contactDetails.setAttribute('google-maps-embed-url', set.google_maps_embed_url);
            contactDetailsContainer.appendChild(contactDetails);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const contactPage = new ContactPage();
    contactPage.renderContactInfo();
});
