import DataService from "./data-service.js";

export default class DbTextProvider {
    constructor() {
        this.dataService = new DataService('webpage-text');
    }

    async setDocumentDbTexts() {
        const dynamicTextElements = document.querySelectorAll('[data-db-text]');
        const dynamicSrcElements = document.querySelectorAll('[data-db-src]');
    
        for (const element of dynamicTextElements) {
            const textKey = element.dataset.dbText;
            await this.setElementText(element, textKey);
        }
    
        for (const element of dynamicSrcElements) {
            const srcKey = element.dataset.dbSrc;
            await this.setElementSrc(element, srcKey);
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

    async setElementSrc(element, srcKey) {
        try {
            const srcObject = await this.dataService.get({text_key: srcKey});
            element.src = srcObject.text || element.src || srcKey;  // Usa el valor por defecto si no se encuentra el dato.
        } catch (error) {
            console.error(`Error fetching src for key "${srcKey}":`, error);
            // Mantén el valor actual de `src` como fallback.
        }
        element.classList.add('loaded');
    }
    
}

document.addEventListener('DOMContentLoaded', async () => {
    const dbTextProvider = new DbTextProvider();
    await dbTextProvider.setDocumentDbTexts();
});