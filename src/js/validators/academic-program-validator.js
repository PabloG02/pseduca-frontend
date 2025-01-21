import InputValidator from "../common/input-validator.js";

export default class AcademicProgramValidator {
    /**
     * Create a new AcademicProgramValidator instance
     */
 constructor() {
        // Validation configurations for academic program fields
        this.config = {
            name: [
                { name: 'required' },
                { name: 'minLength', param: 2 },
                { name: 'maxLength', param: 50 }
            ],
            qualification_level: [
                { name: 'required' }
            ],
            description: [
                { name: 'maxLength', param: 1000 }
            ],
            image_uri: [
                { name: 'urlPattern', param: /\.(jpg|jpeg|png|gif)$/, message: 'Invalid image URL format', custom: true }
            ],
            available_slots: [
                { name: 'required' },
                { name: 'integer' }
            ],
            teaching_type: [
                { name: 'required' }
            ],
            offering_frequency: [
                { name: 'required' },
            ],
            duration_ects: [
                { name: 'required' },
                { name: 'integer' }
            ],
            location: [
                { name: 'required' },
                { name: 'minLength', param: 2 },
                { name: 'maxLength', param: 50 },
            ],
            url: [
                { name: 'url', message: 'Invalid URL format' }
            ]
        };

        //Custom error messages for validation rules
        this.customErrorMessages = {
            name: {
                required: 'Academic program name is required',
                minLength: 'Academic program name must be at least 2 characters long',
                maxLength: 'Academic program name must not exceed 255 characters'
            },
            qualification_level: {
                required: 'Qualification level is required',
            },
            description: {
                maxLength: 'Description must not exceed 1000 characters'
            },
            image_uri: {
                urlPattern: 'Image URL must be a valid JPG, JPEG, PNG, or GIF file'
            },
            available_slots: {
                required: 'Available slots is required',
                integer: 'Available slots must be an integer'
            },
            teaching_type: {
                required: 'Teaching type is required',
            },
            offering_frequency: {
                required: 'Offering frequency is required',
            },
            duration_ects: {
                required: 'Duration is required',
                integer: 'Duration must be an integer'
            },
            location: {
                required: 'Location is required',
                minLength: `Location must be at least 2 characters long`,
                maxLength: `Location must not exceed 50 characters`,
            },
            url: {
                url: 'Invalid academic program URL format'
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
     * @param {Object} academicprogram - Course object to validate
     * @returns {Object} Comprehensive validation result
     */
    validateAll(academicprogram) {
        const results = {};

        // Validación individual de cada campo
        for (const [field, value] of Object.entries(academicprogram)) {
            if (this.config[field]) {
                results[field] = this.validateField(field, value);
            }
        }

        return results;
    }

}

