import I18nManager from "../../common/i18n-manager.js";

class ContactDetails extends HTMLElement {

    connectedCallback() {
        const address = this.getAttribute('address');
        const email = this.getAttribute('email');
        const phone = this.getAttribute('phone');
        const googleMapsEmbedUrl = this.getAttribute('google-maps-embed-url');

        this.innerHTML = `
            <div class="contact-details">
                <h2 data-i18n="contact.contact-us">Contact details</h2>

                <div class="contact-single">
                    <svg-icon src="/pseduca-frontend/assets/fluent-ui-icons/location-28-regular.svg" class="contact-icon"></svg-icon>
                    <div>
                        <h3 data-i18n="contact.address">Address</h3>
                        <p>${address}</p>
                    </div>
                </div>

                <div class="contact-single">
                    <svg-icon src="/pseduca-frontend/assets/fluent-ui-icons/mail-28-regular.svg" class="contact-icon"></svg-icon>
                    <div>
                        <h3 data-i18n="contact.email">Email</h3>
                        <p>${email}</p>
                    </div>
                </div>

                <div class="contact-single">
                    <svg-icon src="/pseduca-frontend/assets/fluent-ui-icons/call-28-regular.svg" class="contact-icon"></svg-icon>
                    <div>
                        <h3 data-i18n="contact.phone">Phone</h3>
                        <p>${phone}</p>
                    </div>
                </div>
            </div>

            <div class="map">
                <h2 data-i18n="contact.map">Map</h2>
                <iframe
                    src="${googleMapsEmbedUrl}"
                    style="border:0;" 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade">
                </iframe>
            </div>
        `;

        // TODO: Find a better way to do it
        I18nManager.getInstance().translateDocument();
    }
}

customElements.define('contact-details', ContactDetails);
