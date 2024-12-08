export default class I18nManager {
    /**
     * Create a new I18nManager instance
     * @param {string} translationPath - Base path to translation JSON files
     * @param {string} [defaultLanguage='en'] - The default language code
     */
    constructor(translationPath, defaultLanguage = 'en') {
        this.translationPath = translationPath;
        this.currentLanguage = defaultLanguage;
        this.translations = {};
    }

    /**
     * Load translations for a specific language
     * @param {string} languageCode - The language code to load
     * @returns {Promise<Object>} A promise that resolves with the translations
     */
    async loadTranslations(languageCode) {
        try {
            const response = await fetch(`${this.translationPath}/${languageCode}.json`);

            if (!response.ok) {
                throw new Error(`Failed to load translations for ${languageCode}`);
            }

            this.translations[languageCode] = await response.json();
            return this.translations[languageCode];
        } catch (error) {
            console.error(`Error loading translations for ${languageCode}:`, error);
            throw error;
        }
    }

    /**
     * Set the current language for translations
     * @param {string} languageCode - The language code to switch to
     * @returns {Promise<void>}
     */
    async setLanguage(languageCode) {
        // Load translations if not already loaded
        if (!this.translations[languageCode]) {
            await this.loadTranslations(languageCode);
        }

        this.currentLanguage = languageCode;
        this.translateDocument();
    }

    /**
     * Get the current language
     * @returns {string} The current language code
     */
    getLanguage() {
        return this.currentLanguage;
    }

    /**
     * Translate the entire document based on data-i18n attributes
     */
    translateDocument() {
        const translatableElements = document.querySelectorAll('[data-i18n]');

        translatableElements.forEach(element => {
            const translationKey = element.dataset.i18n;
            this.translateElement(element, translationKey);
        });
    }

    /**
     * Translate a specific element
     * @param {HTMLElement} element - The element to translate
     * @param {string} translationKey - The translation key
     */
    translateElement(element, translationKey) {
        const translation = this.getTranslation(translationKey);

        if (translation) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.setAttribute('placeholder', translation);
            } else if (element.tagName === 'IMG') {
                element.setAttribute('alt', translation);
            } else if (element.hasAttribute('title')) {
                element.setAttribute('title', translation);
            } else {
                element.textContent = translation;
            }
        }

        element.classList.add('loaded');
    }

    /**
     * Get a translation for a specific key
     * @param {string} key - The translation key
     * @returns {string|null} The translated text or the key if not found
     */
    getTranslation(key) {
        const languageTranslations = this.translations[this.currentLanguage];
        return languageTranslations?.[key] || key;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const i18nManager = new I18nManager('/assets/translations');
    switch (window.navigator.language.split('-')[0]) {
        case 'es':
        case 'gl':
            await i18nManager.setLanguage(window.navigator.language);
            break;
        default:
            await i18nManager.setLanguage('es');
            break;
    }

    // Add event listener to language selector
    document.querySelectorAll('.language-list a').forEach(link => {
        link.addEventListener('click', async event => {
            event.preventDefault();
            const languageCode = event.target.lang;
            await i18nManager.setLanguage(languageCode);
            document.documentElement.lang = languageCode;
        });
    })
});
