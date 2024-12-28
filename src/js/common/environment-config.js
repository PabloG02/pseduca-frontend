export default class EnvironmentConfig {
    static #backendUrl = 'http://localhost:80/pseduca-backend/';

    static get backendUrl() {
        return this.#backendUrl;
    }
}
