export default class EnvironmentConfig {
    static #backendUrl = 'http://localhost:80/';

    static get backendUrl() {
        return this.#backendUrl;
    }
}
