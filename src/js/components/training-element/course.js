class Course extends HTMLElement {

    connectedCallback() {
        const name = this.getAttribute('name');
        const imageUrl = this.getAttribute('image-uri');
        const imageAlt = this.getAttribute('image-alt');
        const description = this.getAttribute('description');
        const slots = this.getAttribute('slots');
        const level = this.getAttribute('level');
        const type = this.getAttribute('type');
        const frequency = this.getAttribute('frequency');
        const duration = this.getAttribute('duration');
        const url = this.getAttribute('url');
        

        this.innerHTML = `
 <div class="course">
                <div class="course-img-container">
                    <img class="course-img" src="${imageUrl}" alt="${imageAlt}">
                    <div class="course-name">${name}</div>
                </div>
                <div class="couse-content">
                    <p class="course-description">${description}</p>
                    <h4>Caracteristicas</h4>
                    <br>
                    <ul class="course-char-container">
                        <li class="course-char">
                            <p class="car-title" data-i18n="academic-programs.characteristics.title.level">Nivel: </p>
                            <span class="car-element" data-i18n="car.element.${level}">${level}</span>
                        </li>
                        <li class="course-char">
                            <p class="car-title" data-i18n="academic-programs.characteristics.title.slots">Plazas: </p>
                            <span class="car-element">${slots}</span>
                        </li>
                        <li class="course-char">
                            <p class="car-title" data-i18n="academic-programs.characteristics.title.type">Tipo: </p>
                            <span class="car-element" data-i18n="car.element.${type}">${type}</span>
                        </li>
                        <li class="course-char">
                            <p class="car-title" data-i18n="academic-programs.characteristics.title.frequency">
                                Frecuencia: </p><span class="car-element" data-i18n="car.element.${frequency}">${frequency}</span>
                        </li>
                        <li class="course-char">
                            <p class="car-title" data-i18n="academic-programs.characteristics.title.duration">Duracion:
                            </p><span class="car-element" data-i18n="car.element.${duration}">${duration}</span>
                        </li>
                    </ul>
                    <a href="${url}" class="course-button" data-i18n="academic-programs.access-button">Acceder al curso</a>
                </div>
            </div>
        `;
    }
}

customElements.define('course', Course);