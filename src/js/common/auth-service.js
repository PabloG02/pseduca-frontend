export default class AuthService {
    #baseUrl;

    constructor() {
        this.#baseUrl = 'http://localhost:80/';
    }

    #buildUrl(action) {
        const url = new URL(this.#baseUrl);
        url.searchParams.set('controller', 'user');
        url.searchParams.set('action', action);
        return url;
    }

    async login(username, password) {
        try {
            const url = this.#buildUrl('login');
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            const response = await fetch(url, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: data.error || `HTTP error! status: ${response.status}`
                };
            }

            this.setAuthToken(data.token);

            return {success: true};
        } catch (error) {
            console.error('Login failed:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : String(error)
            };
        }
    }

    setAuthToken(token) {
        localStorage.setItem('authToken', token);
    }

    getAuthToken() {
        return localStorage.getItem('authData');
    }

    logout() {
        localStorage.removeItem('authToken');
    }

    isAuthenticated() {
        return !!this.getAuthToken();
    }
}