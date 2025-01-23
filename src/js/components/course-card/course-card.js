class CourseCard extends HTMLElement {
  connectedCallback() {
      const title = this.getAttribute('title');
      const imageUrl = this.getAttribute('image-url');
      const description = this.getAttribute('description');
      const link = this.getAttribute('link');

      this.innerHTML = `
        <div class="course-card">
          <img src="${imageUrl}" alt="${title} profile">
          <p class="title">${title}</p>
          <p class="description">${description}</p>
          <div class="social-links">
            <a href="https://${link}" target="_blank">📚 Courses</a>
          </div>
        </div>
      `;
  }
}

customElements.define('course-card', CourseCard);