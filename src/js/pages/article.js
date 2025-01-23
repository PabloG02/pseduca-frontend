import DataService from "../common/data-service.js";
import EnvironmentConfig from "../common/environment-config.js";

class ArticlePage {
    #dataService;

    constructor() {
        this.#dataService = new DataService("article");
    }

    #calculateReadingTime(text) {
        const wordsPerMinute = 200;
        const wordCount = text.trim().split(/\s+/).length;
        return Math.ceil(wordCount / wordsPerMinute);
    }

    #formatDate(dateString) {
        // Retrieve locale
        const locale = navigator.language || 'en-US';

        return new Date(dateString).toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    async #fetchArticle() {
        const urlParams = new URLSearchParams(window.location.search);
        const articleId = urlParams.get('id');

        if (!articleId) {
            throw new Error('No article ID provided');
        }

        return await this.#dataService.get({id: articleId});
    }

    async renderArticle() {
        try {
            const article = await this.#fetchArticle();
            const articleContainer = document.getElementsByClassName('article')[0];
            const readingTime = this.#calculateReadingTime(article.body);

            // Dynamically generate the article content
            articleContainer.innerHTML = `
                <div class="article-container">
                    <article class="article-content">
                        <header class="article-header">
                            <h1 class="article-title">${article.title}</h1>
                            <p class="subtitle">${article.subtitle || ""}</p>
                            <div class="article-meta">
                                <span class="author">By ${article.author}</span>
                                <time datetime="${new Date(article.created_at).toISOString()}">
                                    ${this.#formatDate(article.created_at)}
                                </time>
                            </div>
                            <div class="read-time">${readingTime} min read</div>
                        </header>

                        ${article.image_uri ? `
                            <img 
                                src="${EnvironmentConfig.backendUrl}${article.image_uri}" 
                                alt="${article.image_alt}" 
                                class="article-image"
                            >
                        ` : ''}

                        <div class="article-body">
                            ${article.body.split('\n\n').map(paragraph =>
                                `<p>${this.#formatParagraph(paragraph.trim())}</p>`
                            ).join('')}
                        </div>
                    </article>
                </div>
            `;
        } catch (error) {
            console.error('Error rendering article:', error);
            const articleContainer = document.getElementsByClassName('article')[0];
            articleContainer.innerHTML = `
                <div class="article-container">
                    <div class="error">
                        <p>Unable to load the article. Please try again later.</p>
                    </div>
                </div>
            `;
        }
    }

    #formatParagraph(paragraph) {
        // Optional: Add link detection or other formatting
        // This is a basic implementation you can expand
        return paragraph
            .replace(/https?:\/\/[^\s]+/g, match =>
                `<a href="${match}" target="_blank">${match}</a>`
            );
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const articlePage = new ArticlePage();
    articlePage.renderArticle();
});
