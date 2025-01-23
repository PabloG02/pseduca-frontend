import AuthService from "../common/auth-service.js";

class Header {
    #headerElement = document.querySelector('.bottom-header .nav-menu > ul');
    #authService = new AuthService();

    async addManagementDashboardLink() {
        if (this.#authService.isAuthenticated()) {
            const managementDashboardLink = document.createElement('li');
            if (window.location.href.includes('private')) {
                managementDashboardLink.innerHTML = '<a href="management-dashboard.html">Management</a>';
            } else {
                managementDashboardLink.innerHTML = '<a href="private/management-dashboard.html">Management</a>';
            }
            this.#headerElement.appendChild(managementDashboardLink);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const header = new Header();
    header.addManagementDashboardLink();
});
