import InputValidator from "../common/input-validator.js";

export default class ArticleValidator {
    /**
     * Create a new ArticleValidator instance
     */
    constructor() {
            // Validation configurations for article fields
            this.config = {
                title: [
                    { name: 'required' },
                    { name: 'minLength', param: 2 },
                    { name: 'maxLength', param: 255 }
                ],
                subtitle: [
                    { name: 'required' },
                    { name: 'minLength', param: 2 },
                    { name: 'maxLength', param: 255 }
                ],
                body: [
                    { name: 'required' },
                    { name: 'minLength', param: 2 },
                    { name: 'maxLength', param: 255 }
                ],
                image_uri: [
                    { name: 'urlPattern', param: /\.(jpg|jpeg|png|gif)$/, message: 'Invalid image URL format', custom: true }
                ],
                author: [
                    { name: 'required' },
                    { name: 'minLength', param: 2 },
                    { name: 'maxLength', param: 100 }
                ]

            };
    
            // Custom error messages for validation rules
            this.customErrorMessages = {
                title: {
                    required: 'Title is required',
                    minLength: 'Title must be at least 2 characters long',
                    maxLength: 'Title must not exceed 255 characters'
                },
                subtitle: {
                    required: 'Subtitle is required',
                    minLength: 'Subtitle must be at least 2 characters long',
                    maxLength: 'Subtitle must not exceed 255 characters'
                },
                body: {
                    required: 'Body is required',
                    minLength: 'Body must be at least 2 characters long',
                    maxLength: 'Body must not exceed 255 characters'
                },
                image_uri: {
                    urlPattern: 'Image URL must be a valid JPG, JPEG, PNG, or GIF file'
                },
                author: {
                    required: 'Author is required',
                    minLength: 'Author must be at least 2 characters long',
                    maxLength: 'Author must not exceed 100 characters'
                }
            };
    
            // Initialize InputValidator
            this.validator = new InputValidator();
            // Dynamically register custom rules
            this.registerCustomRules();
        }

    /**
     * Registers custom validation rules based on the config.
     */
    registerCustomRules() {
        for (const field in this.config) {
            const rules = this.config[field];
            // Find rules with custom: true
            rules
                .filter(rule => rule.custom)
                .forEach(rule => {
                    // Add the rule to the validator
                    this.validator.addRule(rule.name, (value, param) => param.test(value), rule.message);
                });
        }
    }

    /**
     * Validate a specific field
     * @param {string} field - Field name to validate
     * @param {string} value - Value to validate
     * @returns {Object} Validation result
     */
    validateField(field, value) {
        if (!this.config[field]) {
            throw new Error(`No validation configuration found for field: ${field}`);
        }

        const validationResult = this.validator.validate(value, this.config[field]);

        // Add custom error messages
        if (!validationResult.isValid) {
            validationResult.errors = validationResult.errors.map(error => {
                const customMessage =
                    this.customErrorMessages[field]?.[error.rule] ||
                    error.message ||
                    'Invalid input';
                return { ...error, message: customMessage };
            });
        }

        return validationResult.errors;
    }

    /**
     * Validate a article object
     * @param {Object} article - Article object to validate
     * @returns {Object} Comprehensive validation result
     */
    validateAll(article) {
        const results = {};
        for (const [field, value] of Object.entries(article)) {
            if (this.config[field]) {
                results[field] = this.validateField(field, value);
            }
        }
        return results;
    }

}