import AuthService from "../common/auth-service.js";

class LoginPage {
    #authService;
    #elements;

    constructor() {
        this.#authService = new AuthService();
        this.#cacheDOM();
        this.#elements.form.addEventListener('submit', this.#login.bind(this));
    }

    #cacheDOM() {
        this.#elements = {
            form: document.querySelector('form'),
            usernameInput: document.getElementById('username'),
            passwordInput: document.getElementById('password'),
            loginButton: document.querySelector('.login-button')
        };
    }

    async #login(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const result = await this.#authService.login(username, password);

        if (result.success) {
            window.location.href = 'private/management-dashboard.html';
        } else {
            alert(`Login failed: ${result.error}`);
        }
    }
}

// Initialize the login page when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new LoginPage();
});