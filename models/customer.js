module.exports = class Customer {
    constructor() {
        this.CustomerId = null;
        this.name = null;
        this.projects = new Array();
    }

    addProject(project) {
        this.projects.push(project);
    }
}