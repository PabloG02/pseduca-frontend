import DataService from "../common/data-service.js";
import EnvironmentConfig from "../common/environment-config.js";

class DivulgationPage {
    #dataService;

    constructor() {
        this.#dataService = new DataService("article");
    }

    async #fetchArticles() {
        const {data} = await this.#dataService.fetchData();
        return data;
    }

    async renderArticlesCards() {
        const articles = await this.#fetchArticles();
        const articlesContainer = document.getElementsByClassName('divulgation-grid')[0];

        articles.forEach((article, index) => {
            const articleElement = document.createElement('div');

            // Determine the class based on the index
            let itemClass = 'divulgation-item';
            if (index === 0) {
                itemClass += ' main';
            } else if (index === 1 || index === 2) {
                itemClass += ' secondary';
            } else {
                itemClass += ' tertiary';
            }

            articleElement.className = itemClass;

            // Build the content dynamically
            if (itemClass.includes('main')) {
                articleElement.innerHTML = `
                    <a href="article.html?id=${article.id}">
                        <img src="${EnvironmentConfig.backendUrl}${article.image_uri}" alt="${article.image_alt}">
                    </a>
                    <div class="content">
                        <a href="article.html?id=${article.id}">
                            <h2>${article.title}</h2>
                        </a>
                        <p>${article.body}</p>
                    </div>
                `;
            } else if (itemClass.includes('secondary')) {
                articleElement.innerHTML = `
                    <a href="article.html?id=${article.id}">
                        <img src="${EnvironmentConfig.backendUrl}${article.image_uri}" alt="${article.image_alt}">
                        <div class="image-overlay"></div>
                        <h2>${article.title}</h2>
                    </a>
                `;
            } else if (itemClass.includes('tertiary')) {
                articleElement.innerHTML = `
                    <a href="article.html?id=${article.id}">
                        <img src="${EnvironmentConfig.backendUrl}${article.image_uri}" alt="${article.image_alt}">
                        <h2>${article.title}</h2>
                    </a>
                `;
            }

            // Append the article element to the container
            articlesContainer.appendChild(articleElement);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const divulgationPage = new DivulgationPage();
    divulgationPage.renderArticlesCards();
});
