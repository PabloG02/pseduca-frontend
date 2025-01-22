import DataService from "../common/data-service.js";
import EnvironmentConfig from "../common/environment-config.js";

class testingProgramsOfferings {
    #dataServiceTestingProgram;

    constructor() {
        this.#dataServiceTestingProgram = new DataService("testing-program");
    }

    async #fetchTestingProgram() {
        const {data} = await this.#dataServiceTestingProgram.fetchData();
        return data;
    }

    async renderTestingPrograms() {
        const testingPrograms = await this.#fetchTestingProgram();
        const testingProgramsContainer = document.getElementsByClassName('testing-programs-grid')[0];

        testingPrograms.forEach(program => {
            const testingPrograms = document.createElement('testing-program-card');
            testingPrograms.setAttribute('name', program.name);
            testingPrograms.setAttribute('description', program.description);
            testingPrograms.setAttribute('image-uri', `${EnvironmentConfig.backendUrl}${program.image_uri}`);
            testingPrograms.setAttribute('url', program.url);
            testingProgramsContainer.appendChild(testingPrograms);
        });
    }

}

document.addEventListener('DOMContentLoaded', () => {
    const testingProgramsOfferings = new testingProgramsOfferings();
    testingProgramsOfferings.renderTestingPrograms();
});
