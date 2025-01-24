import InputValidator from "../common/input-validator.js";

export default class CourseValidator {
    /**
     * Create a new CourseValidator instance
     */
    constructor() {
        // Validation configurations for course fields
        this.config = {
            name: [
                { name: 'required' },
                { name: 'minLength', param: 2 },
                { name: 'maxLength', param: 255 }
            ],
            description: [
                { name: 'required' },
                { name: 'maxLength', param: 1000 }
            ],
            start_date: [
                { name: 'required' },
                { name: 'date' }
            ],
            end_date: [
                { name: 'required' },
                { name: 'date' },
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
            name: {
                required: 'Course name is required',
                minLength: 'Course name must be at least 2 characters long',
                maxLength: 'Course name must not exceed 255 characters'
            },
            description: {
                required: 'Description is required',
                maxLength: 'Description must not exceed 1000 characters'
            },
            start_date: {
                required: 'Start date is required',
                date: 'Invalid start date format'
            },
            end_date: {
                required: 'End date is required',
                date: 'Invalid end date format',
            },
            image_uri: {
                required: 'Image URL is required',
                urlPattern: 'Image URL must be a valid JPG, JPEG, PNG, or GIF file'
            },
            image_alt: { 
                required: 'Aternative text is required',
                maxLength: 'Alternative text must not exceed 100 characters'
            },
            url: {
                required: 'URL is required',
                url: 'Invalid course URL format'
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
 * Validate a course object
 * @param {Object} course - Course object to validate
 * @returns {Object} Comprehensive validation result
 */
validateAll(course) {
    const results = {};

    // Validación individual de cada campo
    for (const [field, value] of Object.entries(course)) {
        if (this.config[field]) {
            results[field] = this.validateField(field, value);
        }
    }

    return results;
}

}
