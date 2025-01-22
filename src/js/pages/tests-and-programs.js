import DataService from "../common/data-service.js";
import EnvironmentConfig from "../common/environment-config.js";

class TestsAndProgramsPage {
    #dataService;

    constructor() {
        this.#dataService = new DataService("program");
    }

    async #fetchTestsAndPrograms() {
        const {data} = await this.#dataService.fetchData();
        return data;
    }

    async renderTestsAndPrograms() {
        const testsAndPrograms = await this.#fetchTestsAndPrograms();
        const testsAndProgramsContainer = document.getElementsByClassName('testing-programs-grid')[0];

        testsAndPrograms.forEach(testOrProgram => {
            const testOrProgramElem = document.createElement('test-program-card');
            testOrProgramElem.setAttribute('name', testOrProgram.name);
            testOrProgramElem.setAttribute('description', testOrProgram.description);
            testOrProgramElem.setAttribute('image-uri', `${EnvironmentConfig.backendUrl}${testOrProgram.image_uri}`);
            testOrProgramElem.setAttribute('image-alt', testOrProgram.image_alt);
            testOrProgramElem.setAttribute('url', testOrProgram.url);
            testsAndProgramsContainer.appendChild(testOrProgramElem);
        });
    }

}

document.addEventListener('DOMContentLoaded', () => {
    const testsAndProgramsPage = new TestsAndProgramsPage();
    testsAndProgramsPage.renderTestsAndPrograms();
});
