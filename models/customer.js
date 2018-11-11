module.exports = class Customer {
    constructor() {
        this.CustomerId = null;
        this.name = null;
        this.isActive = true;
        this.projects = new Array();
    }

    addProject(project) {
        this.projects.push(project);
    }
}