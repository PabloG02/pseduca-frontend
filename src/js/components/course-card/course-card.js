class CourseCard extends HTMLElement {
    connectedCallback() {
        const name = this.getAttribute('name');
        const description = this.getAttribute('description');
        const imageUrl = this.getAttribute('image-uri');
        const url = this.getAttribute('url');

        this.innerHTML = `
        <div class="card">
            <img src="${imageUrl}" class="card-image">
            <div class="card-content">
                <div class="card-name">${name}</div>
                <div id="description" class="card-description">${description}</div>
                <a href="${url}" target="_blank" class="card-button">Website</a>
            </div>
        </div>
      `;
    }
}

customElements.define('course-card', CourseCard);
