import DataService from "../common/data-service.js";
import EnvironmentConfig from "../common/environment-config.js";

class TrainingPage{
    #dataService
    constructor(){
        this.#dataService = new DataService("course");
    }
    
    async #fetchCourses(){
        const {data} = await this.#dataService.fetchData();
        return data;
    }

    async renderCourses(){
        const courses = await this.#fetchCourses();
        const coursesContainer = document.getElementsByClassName('course-grid');

        courses.array.forEach(course => {
            const courseElement = document.createElement("course");
            courseElement.setAttribute('name', course.name);
            courseElement.setAttribute('image-uri', EnvironmentConfig.backendUrl + course.imageUrl);
            courseElement.setAttribute('image-alt', course.imageAlt);
            courseElement.setAttribute('description', course.description);
            courseElement.setAttribute('slots', course.slots);
            courseElement.setAttribute('level', course.level);
            courseElement.setAttribute('type', course.type);
            courseElement.setAttribute('frequency', course.frequency);
            courseElement.setAttribute('duration', course.duration);
            courseElement.setAttribute('url', EnvironmentConfig.backendUrl + course.url);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const trainingPage = new TrainingPage();
    trainingPage.renderCourses();
});