import DataService from "../common/data-service.js";
import UserValidator from "../validators/user-validator.js";

class RegisterPage {
    #dataService;
    #userValidator;
    #elements;

    constructor() {
        this.#dataService = new DataService('user');
        this.#userValidator = new UserValidator();
        this.#cacheDOM();
        this.#initialize();
    }

    #cacheDOM() {
        this.#elements = {
            form: document.querySelector('form'),
            inputs: {
                name: document.getElementById('name'),
                email: document.getElementById('email'),
                username: document.getElementById('username'),
                password: document.getElementById('password'),
            },
            registerButton: document.querySelector('.register-button'),
        };
    }

    #initialize() {
        this.#setUpValidation();
        this.#elements.form.addEventListener('submit', (event) => this.#register(event));
    }

    #setUpValidation() {
        Object.entries(this.#elements.inputs).forEach(([field, input]) => {
            input.oninput = () => this.#validateField(field, input);
        });
    }

    #validateField(field, input) {
        const parentElement = input.parentElement;
        const errorContainer = parentElement.querySelector('.message') || this.#createErrorContainer(parentElement);
        const errors = this.#userValidator.validateField(field, input.value);

        // Clear previous errors
        errorContainer.innerHTML = '';
        parentElement.classList.remove('error');

        if (errors.length > 0) {
            errors.forEach(error => errorContainer.innerHTML += `${error.message}<br>`);
            parentElement.classList.add('error');
        }
    }

    #createErrorContainer(parent) {
        const errorElement = document.createElement('p');
        errorElement.className = 'message';
        parent.appendChild(errorElement);
        return errorElement;
    }

    async #register(event) {
        event.preventDefault();
        const user = Object.fromEntries(
            Object.entries(this.#elements.inputs).map(([key, input]) => [key, input.value])
        );

        const errors = this.#userValidator.validateAll(user);

        if (Object.values(errors).flat().length > 0) {
            alert('Please correct the following errors:\n' + JSON.stringify(errors, null, 2));
            return;
        }

        try {
            const response = await this.#dataService.create(user);

            // Handle successful registration
            if (response) {
                alert('Registration successful! Please log in.');
                // Redirect to login page
                window.location.href = 'signin.html';
            }
        } catch (error) {
            // Handle registration errors
            console.error('Registration failed:', error);
            alert(`Registration failed: ${error.message}`);
        }
    }
}

// Initialize the login page when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new RegisterPage();
});
