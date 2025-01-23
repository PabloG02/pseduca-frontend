class SVGIcon extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const src = this.getAttribute('src');
        if (src) {
            fetch(src)
                .then(response => response.text())
                .then(data => {
                    // Set the component's innerHTML to the fetched SVG
                    this.innerHTML = data;
                })
                .catch(error => console.error('Error loading SVG:', error));
        }
    }
}

customElements.define('svg-icon', SVGIcon);