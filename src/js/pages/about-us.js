import DataService from "../common/data-service.js";
import EnvironmentConfig from "../common/environment-config.js";

class AboutUsPage {
    #dataService;

    constructor() {
        this.#dataService = new DataService("team-member");
    }

    async #fetchTeamMembers() {
        const {data} = await this.#dataService.fetchData();
        return data;
    }

    async renderTeamMembers() {
        const teamMembers = await this.#fetchTeamMembers();
        const teamMembersContainer = document.getElementsByClassName('team-grid')[0];

        teamMembers.forEach(member => {
            const teamMember = document.createElement('team-member');
            teamMember.setAttribute('name', member.name);
            teamMember.setAttribute('image-url', EnvironmentConfig.backendUrl + member.image_uri);
            teamMember.setAttribute('biography', member.biography);
            teamMember.setAttribute('email', member.email);
            teamMember.setAttribute('researcher-id', member.researcher_id);
            teamMembersContainer.appendChild(teamMember);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const aboutUsPage = new AboutUsPage();
    aboutUsPage.renderTeamMembers();
});
