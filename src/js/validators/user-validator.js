import InputValidator from "../common/input-validator.js";

export default class UserValidator {
    /**
     * Create a new UserValidator instance
     */
    constructor() {
        // Validation mapping for different columns
        this.validationMap = {
            username: this.validateUsername.bind(this),
            password: this.validatePassword.bind(this),
            email: this.validateEmail.bind(this),
            name: this.validateName.bind(this)
        };

        // Default validation configurations
        this.config = {
            username: {
                minLength: 3,
                maxLength: 20,
                allowedChars: /^[a-zA-Z0-9_]+$/
            },
            password: {
                minLength: 8,
                maxLength: 64,
                requireUppercase: true,
                requireLowercase: true,
                requireNumber: true,
                requireSpecialChar: true
            },
            email: {
                maxLength: 255
            },
            name: {
                minLength: 2,
                maxLength: 50,
                allowedChars: /^[a-zA-Z\s'-]+$/
            },
        };

        // Create a base input validator with centralized rules
        this.validator = new InputValidator({
            username: (value) => {
                const { minLength, maxLength, allowedChars } = this.config.username;
                return value.length >= minLength &&
                    value.length <= maxLength &&
                    allowedChars.test(value);
            },

            password: (value) => {
                const {
                    minLength,
                    maxLength,
                    requireUppercase,
                    requireLowercase,
                    requireNumber,
                    requireSpecialChar
                } = this.config.password;

                // Length check
                if (value.length < minLength || value.length > maxLength) return false;

                // Complexity checks
                const checks = {
                    uppercase: requireUppercase ? /[A-Z]/.test(value) : true,
                    lowercase: requireLowercase ? /[a-z]/.test(value) : true,
                    number: requireNumber ? /[0-9]/.test(value) : true,
                    specialChar: requireSpecialChar ? /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value) : true
                };

                // All required checks must pass
                return Object.values(checks).every(Boolean);
            },

            email: (value) => {
                const { maxLength } = this.config.email;
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                return value.length <= maxLength && emailRegex.test(value);
            },

            name: (value) => {
                const { minLength, maxLength, allowedChars } = this.config.name;
                return value.length >= minLength &&
                    value.length <= maxLength &&
                    allowedChars.test(value);
            }
        });

        // Custom error messages
        this.validator.customErrorMessages = {
            username: {
                base: 'Invalid username',
                minLength: `Username must be at least ${this.config.username.minLength} characters`,
                maxLength: `Username must be no more than ${this.config.username.maxLength} characters`
            },
            password: {
                base: 'Invalid password',
                minLength: `Password must be at least ${this.config.password.minLength} characters`,
                maxLength: `Password must be no more than ${this.config.password.maxLength} characters`,
                complexity: 'Password does not meet complexity requirements'
            },
            email: {
                base: 'Invalid email address',
                maxLength: `Email must be no more than ${this.config.email.maxLength} characters`
            },
            name: {
                base: 'Invalid name',
                minLength: `Name must be at least ${this.config.name.minLength} characters`,
                maxLength: `Name must be no more than ${this.config.name.maxLength} characters`
            }
        };
    }

    /**
     * Validate username
     * @param {string} username - Username to validate
     * @returns {Object} Validation result
     */
    validateUsername(username) {
        return this.validator.validate(username, [
            'required',
            'username'
        ]);
    }

    /**
     * Validate password
     * @param {string} password - Password to validate
     * @returns {Object} Validation result
     */
    validatePassword(password) {
        return this.validator.validate(password, [
            'required',
            'password'
        ]);
    }

    /**
     * Validate email
     * @param {string} email - Email to validate
     * @returns {Object} Validation result
     */
    validateEmail(email) {
        return this.validator.validate(email, [
            'required',
            'email'
        ]);
    }

    /**
     * Validate name
     * @param {string} name - Name to validate
     * @returns {Object} Validation result
     */
    validateName(name) {
        return this.validator.validate(name, [
            'required',
            'name'
        ]);
    }

    /**
     * Validate a specific column based on its name
     * @param {string} column - Column name to validate
     * @param {string} value - Value to validate
     * @returns {boolean} Validation result
     */
    validate(column, value) {
        // Check if the column has a validation method
        if (!this.validationMap[column]) {
            throw new Error(`No validation method found for column: ${column}`);
        }

        // Perform validation for the specific column
        const validationResult = this.validationMap[column](value);

        // Return boolean indicating overall validation status
        return validationResult.isValid;
    }

    /**
     * Validate entire user object
     * @param {Object} user - User object to validate
     * @returns {Object} Comprehensive validation result
     */
    validateAll(user) {
        return {
            username: this.validateUsername(user.username),
            password: this.validatePassword(user.password),
            email: this.validateEmail(user.email),
            name: this.validateName(user.name)
        };
    }
}
