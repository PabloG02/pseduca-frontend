import DataService from "./data-service.js";

export default class DbTextProvider {
    constructor() {
        this.dataService = new DataService('webpagetext');
    }

    async setDocumentDbTexts() {
        const dynamicElements = document.querySelectorAll('[data-db-text]');

        // Iterate over all elements that require dynamic text
        for (const element of dynamicElements) {
            const textKey = element.dataset.dbText;
            await this.setElementText(element, textKey);
        }
    }

    /**
     * Fetch and update content for a specific element based on its content key.
     * @param {HTMLElement} element - The DOM element that needs to be updated
     * @param {string} textKey - The key used to fetch the content (e.g., 'project.description')
     */
    async setElementText(element, textKey) {
        const textObject = await this.dataService.get({text_key: textKey});
        element.textContent = textObject.text || textKey;
        element.classList.add('loaded');
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const dbTextProvider = new DbTextProvider();
    await dbTextProvider.setDocumentDbTexts();
});