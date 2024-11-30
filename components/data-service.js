export default class DataService {
    constructor(controller) {
        this.baseUrl = 'http://localhost:80/';
        this.controller = controller;
    }

    buildUrl(action) {
        const url = new URL(this.baseUrl);
        url.searchParams.set('controller', this.controller);
        url.searchParams.set('action', action);
        return url;
    }

    async fetchData(filters = {}, pagination = { limit: 10, offset: 0 }) {
        try {
            const url = this.buildUrl('list');
            const data = JSON.stringify({ ...filters, ...pagination });

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: data
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const responseData = await response.json();
            return this.#transformResponseKeysCamelToSnake(responseData);
        } catch (error) {
            console.error('Data fetch failed:', error);
            return { data: [], total_count: 0 };
        }
    }

    async create(data) {
        return this.#createOrUpdate('create', data);
    }

    async update(data) {
        return this.#createOrUpdate('update', data);
    }

    async #createOrUpdate(action, data) {
        const url = this.buildUrl(action);
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(this.#camelToSnakeCase(key), value);
        });

        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    }

    async delete(id) {
        const url = this.buildUrl('delete');
        const formData = new FormData();
        formData.append(Object.keys(id)[0], Object.values(id)[0]);

        return fetch(url, {
            method: 'POST',
            body: formData
        });
    }

    #camelToSnakeCase(key) {
        return key.replace(/([A-Z])/g, '_$1').toLowerCase();
    }

    #transformResponseKeysCamelToSnake(obj) {
        if (Array.isArray(obj)) {
            return obj.map(item => this.#transformResponseKeysCamelToSnake(item));
        } else if (obj !== null && typeof obj === 'object') {
            return Object.keys(obj).reduce((acc, key) => {
                const newKey = this.#camelToSnakeCase(key);
                acc[newKey] = this.#transformResponseKeysCamelToSnake(obj[key]);
                return acc;
            }, {});
        }
        return obj;
    }
}
