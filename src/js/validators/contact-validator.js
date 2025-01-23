import InputValidator from "../common/input-validator.js";

export default class ContactValidator {
    /**
     * Create a new ContactValidator instance
     */
    constructor() {
        // Validation configurations for contact fields
        this.config = {
            address: [
                { name: 'required' },
                { name: 'minLength', param: 2 },
                { name: 'maxLength', param: 255 }
            ],
            email: [
                { name: 'required' },
                { name: 'email' },
                { name: 'maxLength', param: 100 }
            ],
            phone: [
                { name: 'required' },
                { name: 'phone' },
                { name: 'maxLength', param: 20 }
            ],
            google_maps_embed_url: [
                { name: 'required' },
                { name: 'urlPattern', param: /^https:\/\/www\.google\.com\/maps\/embed\?.*/, message: 'Invalid Google Maps embed URL format', custom: true },
                { name: 'maxLength', param: 511 }
            ]
        };

        // Custom error messages for validation rules
        this.customErrorMessages = {
            address: {
                required: 'Address is required',
                minLength: 'Address must be at least 2 characters long',
                maxLength: 'Address must not exceed 255 characters'
            },
            email: {
                required: 'Email is required',
                email: 'Invalid email format',
                maxLength: 'Email must not exceed 100 characters'
            },
            phone: {
                required: 'Phone number is required',
                phonePattern: 'Invalid phone number format',
                maxLength: 'Phone number must not exceed 20 characters'
            },
            google_maps_embed_url: {
                required: 'Google Maps embed URL is required',
                urlPattern: 'Invalid Google Maps embed URL format',
                maxLength: 'Google Maps embed URL must not exceed 511 characters'
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
     * Validate a contact object
     * @param {Object} contact - Contact object to validate
     * @returns {Object} Comprehensive validation result
     */
    validateAll(contact) {
        const results = {};
        for (const [field, value] of Object.entries(contact)) {
            if (this.config[field]) {
                results[field] = this.validateField(field, value);
            }
        }
        return results;
    }
}
