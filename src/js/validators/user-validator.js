import InputValidator from "../common/input-validator.js";

export default class UserValidator {
    /**
     * Create a new UserValidator instance
     */
    constructor() {
        // Validation configurations for user fields
        this.config = {
            username: [
                { name: 'required' },
                { name: 'minLength', param: 3 },
                { name: 'maxLength', param: 20 },
                { name: 'alphanumeric', param: /^[a-zA-Z0-9_]+$/ }
            ],
            password: [
                { name: 'required' },
                { name: 'minLength', param: 8 },
                { name: 'maxLength', param: 64 },
                { name: 'containsUpper', param: /[A-Z]/, message: 'Must include at least one uppercase letter', custom: true },
                { name: 'containsLower', param: /[a-z]/, message: 'Must include at least one lowercase letter', custom: true },
                { name: 'containsNumber', param: /[0-9]/, message: 'Must include at least one number', custom: true },
                { name: 'containsSpecial', param: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, message: 'Must include at least one special character', custom: true }
            ],
            email: [
                { name: 'required' },
                { name: 'maxLength', param: 255 },
                { name: 'email' }
            ],
            name: [
                { name: 'required' },
                { name: 'minLength', param: 2 },
                { name: 'maxLength', param: 50 },
                { name: 'namePattern', param: /^[a-zA-Z\s'-]+$/, message: 'Name can only contain letters, spaces, apostrophes, and hyphens', custom: true }
            ]
        };

        // Custom error messages for validation rules
        this.customErrorMessages = {
            username: {
                required: 'Username is required',
                minLength: `Username must be at least 3 characters long`,
                maxLength: `Username must not exceed 20 characters`,
            },
            password: {
                required: 'Password is required',
                minLength: `Password must be at least 8 characters long`,
                maxLength: `Password must not exceed 64 characters`
            },
            email: {
                required: 'Email is required',
                email: 'Invalid email format',
                maxLength: `Email must not exceed 255 characters`
            },
            name: {
                required: 'Name is required',
                minLength: `Name must be at least 2 characters long`,
                maxLength: `Name must not exceed 50 characters`,
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
     * Validate a user object
     * @param {Object} user - User object to validate
     * @returns {Object} Comprehensive validation result
     */
    validateAll(user) {
        const results = {};
        for (const [field, value] of Object.entries(user)) {
            if (this.config[field]) {
                results[field] = this.validateField(field, value);
            }
        }
        return results;
    }
}
