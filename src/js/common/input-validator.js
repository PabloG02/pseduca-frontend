export default class InputValidator {
    /**
     * Create a new InputValidator instance
     * @param {Object} rules - Validation rules for different input types
     */
    constructor(rules = {}) {
        // Default validation rules
        this.defaultRules = {
            required: (value) => value !== null && value !== undefined && value !== '',
            minLength: (value, length) => value.length >= length,
            maxLength: (value, length) => value.length <= length,
            email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            numeric: (value) => /^-?\d+(\.\d+)?$/.test(value),
            integer: (value) => /^-?\d+$/.test(value),
            alphanumeric: (value) => /^[a-zA-Z0-9]+$/.test(value),
            url: (value) => /^https?:\/\/[\w\-]+(\.[\w\-]+)+[#?/\w\-=&]+$/.test(value),
            phone: (value) => /^\d{9}$/.test(value),
            custom: (value, regex) => regex.test(value)
        };

        // Merge provided rules with default rules
        this.rules = { ...this.defaultRules, ...rules };

        // Default error messages
        this.errorMessages = {
            required: 'This field is required',
            minLength: (param) => `Minimum length is ${param} characters`,
            maxLength: (param) => `Maximum length is ${param} characters`,
            email: 'Invalid email format',
            numeric: 'Must be a valid number',
            integer: 'Must be a whole number',
            alphanumeric: 'Must contain only letters and numbers',
            url: 'Invalid URL format',
            phone: 'Invalid phone number format'
        };
    }

    /**
     * Validate a single value against multiple rules
     * @param {*} value - Value to validate
     * @param {Array} validationRules - Rules to apply
     * @returns {Object} Validation result
     */
    validate(value, validationRules = []) {
        const errors = [];

        for (const rule of validationRules) {
            let isValid = true;
            let ruleName = rule;
            let ruleParam = null;

            // Support rules with parameters
            if (typeof rule === 'object') {
                ruleName = rule.name;
                ruleParam = rule.param;
            }

            // Check if rule exists
            if (!this.rules[ruleName]) {
                throw new Error(`Validation rule '${ruleName}' not found`);
            }

            // Apply validation
            if (ruleParam !== null) {
                isValid = this.rules[ruleName](value, ruleParam);
            } else {
                isValid = this.rules[ruleName](value);
            }

            // Collect errors
            if (!isValid) {
                errors.push({
                    rule: ruleName,
                    message: this.getErrorMessage(ruleName, ruleParam)
                });
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Get human-readable error message for a validation rule
     * @param {string} rule - Validation rule name
     * @param {*} param - Rule parameter
     * @returns {string} Error message
     */
    getErrorMessage(rule, param = null) {
        if (typeof this.errorMessages[rule] === 'function') {
            return this.errorMessages[rule](param);
        }
        return this.errorMessages[rule] || 'Invalid input';
    }

    /**
     * Add a new custom validation rule
     * @param {string} name - Rule name
     * @param {Function} validator - Validation function
     * @param {string} [errorMessage] - Custom error message
     */
    addRule(name, validator, errorMessage = null) {
        this.rules[name] = validator;

        if (errorMessage) {
            this.errorMessages[name] = errorMessage;
        }
    }
}
