import DataService from "../common/data-service.js";

class RegisterPage {
    #dataService;
    #elements;

    constructor() {
        this.#dataService = new DataService('user');
        this.#cacheDOM();
        this.#elements.form.addEventListener('submit', this.#register.bind(this));
    }

    #cacheDOM() {
        this.#elements = {
            form: document.querySelector('form'),
            nameInput: document.getElementById('name'),
            emailInput: document.getElementById('email'),
            usernameInput: document.getElementById('username'),
            passwordInput: document.getElementById('password'),
            registerButton: document.querySelector('.register-button')
        };
    }

    async #register(event) {
        event.preventDefault();
        const name = this.#elements.nameInput.value;
        const email = this.#elements.emailInput.value;
        const username = this.#elements.usernameInput.value;
        const password = this.#elements.passwordInput.value;

        try {
            const response = await this.#dataService.create({
                name: name,
                email: email,
                username: username,
                password: password
            });

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
