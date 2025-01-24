import DataService from "../common/data-service.js";
import EnvironmentConfig from "../common/environment-config.js";

class AcademicOfferings {
    #dataServiceAcademicPrograms;
    #dataServiceCourses;

    constructor() {
        this.#dataServiceAcademicPrograms = new DataService("academic-program");
        this.#dataServiceCourses = new DataService("course");
    }

    async #fetchAcademicPrograms() {
        const {data} = await this.#dataServiceAcademicPrograms.fetchData();
        return data;
    }

    async #fetchCourses() {
        const {data} = await this.#dataServiceCourses.fetchData();
        return data;
    }

    async renderAcademicPrograms() {
        const academicPrograms = await this.#fetchAcademicPrograms();
        const academicProgramsContainer = document.getElementsByClassName('academic-programs-grid')[0];

        academicPrograms.forEach(program => {
            const academicProgram = document.createElement('academic-program-card');
            academicProgram.setAttribute('name', program.name);
            academicProgram.setAttribute('qualification-level', program.qualification_level);
            academicProgram.setAttribute('description', program.description);
            academicProgram.setAttribute('image-uri', `${EnvironmentConfig.backendUrl}${program.image_uri}`);
            academicProgram.setAttribute('image-alt', program.name);
            academicProgram.setAttribute('available-slots', program.available_slots);
            academicProgram.setAttribute('teaching-type', program.teaching_type);
            academicProgram.setAttribute('offering-frequency', program.offering_frequency);
            academicProgram.setAttribute('duration-ects', program.duration_ects);
            academicProgram.setAttribute('location', program.location);
            academicProgram.setAttribute('url', program.url);
            academicProgramsContainer.appendChild(academicProgram);
        });
    }

    async renderCourses() {
        const courses = await this.#fetchCourses();
        const coursesContainer = document.getElementsByClassName('courses-grid')[0];

        courses.forEach(course => {
            const courseElement = document.createElement('course-card');
            courseElement.setAttribute('name', course.name);
            courseElement.setAttribute('description', course.description);
            courseElement.setAttribute('image-uri', `${EnvironmentConfig.backendUrl}${course.image_uri}`);
            courseElement.setAttribute('url', course.url);
            coursesContainer.appendChild(courseElement);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const academicOfferings = new AcademicOfferings();
    academicOfferings.renderAcademicPrograms();
    academicOfferings.renderCourses();
});