import InputValidator from "../common/input-validator.js";

export default class TestingProgramsValidator {
    /**
     * Create a new TestingProgramsValidator instance
     */
    constructor() {
        // Validation configurations for testing and programs fields
        this.config = {
            id: [
                { name: 'required' },
            ],
            name: [
                { name: 'required' },
                { name: 'minLength', param: 2 },
                { name: 'maxLength', param: 255 }
            ],
            description: [
                { name: 'required' },
                { name: 'maxLength', param: 1000 }
            ],
            image_uri: [
                { name: 'required' },
                { name: 'urlPattern', param: /\.(jpg|jpeg|png|gif)$/, message: 'Invalid image URL format', custom: true }
            ],
            image_alt: [
                { name: 'required' },
                { name: 'maxLength', param: 100 }
            ],
            url: [
                { name: 'required' },
                { name: 'url', message: 'Invalid URL format' }
            ]
        };

        // Custom error messages for validation rules
        this.customErrorMessages = {
            id: {
                required: 'ID is required'
            },
            name: {
                required: 'Test and programs name is required',
                minLength: 'Test and programs name must be at least 2 characters long',
                maxLength: 'Test and programs name must not exceed 255 characters'
            },
            description: {
                required: 'Description is required',
                maxLength: 'Description must not exceed 1000 characters'
            },
            image_uri: {
                required: 'Image URL is required',
                urlPattern: 'Image URL must be a valid JPG, JPEG, PNG, or GIF file'
            },
            image_alt: {
                required: 'Alternative text is required',
                maxLength: 'Alternative text must not exceed 100 characters'
            },
            url: {
                required: 'URL is required',
                url: 'Invalid test and program URL format'
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
        console.log(value);
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
 * Validate a test and program object
 * @param {Object} testingPrograms - Test and program object to validate
 * @returns {Object} Comprehensive validation result
 */
    validateAll(testingPrograms) {
    const results = {};

    // Validación individual de cada campo
    for (const [field, value] of Object.entries(testingPrograms)) {
        if (this.config[field]) {
            results[field] = this.validateField(field, value);
        }
    }

    return results;
}

}
