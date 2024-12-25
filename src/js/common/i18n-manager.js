export default class I18nManager {
    /** Singleton instance */
    static instance = null;

    /**
     * Get the singleton instance of I18nManager
     * @param {string} translationPath - Base path to translation JSON files
     * @param {string} [defaultLanguage='en'] - The default language code
     * @returns {I18nManager} The singleton instance
     */
    static getInstance(translationPath = '/assets/translations', defaultLanguage = 'en') {
        if (!I18nManager.instance) {
            I18nManager.instance = new I18nManager(translationPath, defaultLanguage);
        }
        return I18nManager.instance;
    }

    /**
     * Private constructor to prevent direct instantiation
     * @param {string} translationPath - Base path to translation JSON files
     * @param {string} [defaultLanguage='en'] - The default language code
     */
    constructor(translationPath, defaultLanguage = 'en') {
        if (I18nManager.instance) {
            throw new Error("Use I18nManager.getInstance() to get the singleton instance.");
        }

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
    const i18nManager = I18nManager.getInstance('/assets/translations');
    const browserLanguage = window.navigator.language.split('-')[0];
    switch (browserLanguage) {
        case 'es':
        case 'gl':
            await i18nManager.setLanguage(browserLanguage);
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
