class CourseCard extends HTMLElement {
    connectedCallback() {
        // const title = this.getAttribute('title');
        // const imageUrl = this.getAttribute('image-url');
        // const description = this.getAttribute('description');
        // const link = this.getAttribute('link');

        this.innerHTML = `
          <div class="course-card">
            
          </div>
        `;
    }
}

customElements.define('course-card', CourseCard);
