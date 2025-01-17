import DataService from './data-service.js';

class ResourceCard extends HTMLElement {
    connectedCallback() {
        const resourceId = this.getAttribute('resource-id');
        const name = this.getAttribute('name');
        const imageUrl = this.getAttribute('image-url');
        const description = this.getAttribute('description');
        const author = this.getAttribute('author');

        this.innerHTML = `
          <div class="card">
            <div class="card-image">
                <img src="${imageUrl}" alt="${name} image">
            </div>
            <div class="card-content">
              <div class="card-header"><a href="/resource-details.html?id=${resourceId}">${name}</a></div>
              <div class="card-body">
                <p><strong>Autor:</strong> ${author}</p>
                <p><strong>Descripción:</strong> ${description}</p>
              </div>
              <a href="/resource-details.html?id=${resourceId}" class="btn">Ver detalles</a>
            </div>
          </div> 
        `;
    }
}

customElements.define('resource-card', ResourceCard);

// Función para cargar los recursos y añadirlos al DOM
async function loadResources() {
    const dataService = new DataService('resource'); // Apunta al controlador "resource"
    try {
        const { data, total_count } = await dataService.fetchData();

        if (data && data.length > 0) {
            const resourcesContainer = document.querySelector('.resources-list');
            resourcesContainer.innerHTML = ''; // Limpia cualquier contenido previo

            data.forEach(resource => {
                // Crea un elemento `resource-card` por cada recurso
                const resourceCard = document.createElement('resource-card');
                resourceCard.setAttribute('resource-id', resource.id);
                resourceCard.setAttribute('name', resource.name);
                resourceCard.setAttribute('image-url', resource.image_uri || '/images/default.jpg');
                resourceCard.setAttribute('description', resource.description || 'Sin descripción.');
                resourceCard.setAttribute('author', resource.author_name || 'Autor desconocido');

                // Añade la tarjeta al contenedor de recursos
                resourcesContainer.appendChild(resourceCard);
            });
        } else {
            alert('No se encontraron recursos disponibles.');
        }
    } catch (error) {
        console.error('Error al cargar los recursos:', error);
        alert('Ocurrió un error al cargar los recursos.');
    }
}

// Llama a la función para cargar recursos cuando la página esté lista
document.addEventListener('DOMContentLoaded', loadResources);

