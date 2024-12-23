class TeamMember extends HTMLElement {

    connectedCallback() {
        const name = this.getAttribute('name');
        const imageUrl = this.getAttribute('image-url');
        const biography = this.getAttribute('biography');
        const email = this.getAttribute('email');
        const researcherId = this.getAttribute('researcher-id');

        this.innerHTML = `
          <div class="team-member">
            <img src="${imageUrl}" alt="${name} profile">
            <p class="name">${name}</p>
            <p class="biography">${biography}</p>
            <div class="social-links">
              <a href="mailto:${email}">📧 Email</a>
              <a href="https://portalcientifico.uvigo.gal/investigadores/${researcherId}/detalle" target="_blank">📚 Research Portal</a>
            </div>
          </div>
        `;
    }
}

customElements.define('team-member', TeamMember);
