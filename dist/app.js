"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const BindThis = (target, methodName, descriptor) => ({
    configurable: true,
    enumerable: false,
    get() {
        return descriptor.value.bind(this);
    },
});
const validate = (validating) => {
    let validated = true;
    let { value, required, maxLen, minLen, max, min } = validating;
    if (required) {
        validated = validated && value.toString().length !== 0;
    }
    if (maxLen != null && typeof value === 'string') {
        validated = validated && value.length <= maxLen;
    }
    if (minLen != null && typeof value === 'string') {
        validated = validated && value.length >= minLen;
    }
    if (max != null && typeof value === 'number') {
        validated = validated && value <= max;
    }
    if (min != null && typeof value === 'number') {
        validated = validated && value >= min;
    }
    return validated;
};
class Component {
    constructor() { }
}
class ProjectState {
    constructor() {
        this.projects = [];
        this.listener = [];
    }
    static getInstance() {
        if (this.instance)
            return this.instance;
        this.instance = new ProjectState();
        return this.instance;
    }
    addListener(fn) {
        this.listener.push(fn);
    }
    addProject(title, description, people) {
        const newProject = new Project(Math.floor(Math.random() * 989898989), title, description, people, projectStatus.active);
        this.projects.push(newProject);
        for (const listener of this.listener) {
            listener(this.projects.slice());
        }
    }
}
const projectState = ProjectState.getInstance();
class ProjectInput {
    constructor() {
        this.formtemplate = document.getElementById('project-input');
        this.hostElement = document.getElementById('app');
        const importedNode = document.importNode(this.formtemplate.content, true);
        this.formElement = importedNode.firstElementChild;
        this.formElement.id = 'user-input';
        this.titleInputEl = this.formElement.querySelector('#title');
        this.descriptionInputEl = this.formElement.querySelector('#description');
        this.peopleInputEl = this.formElement.querySelector('#people');
        this.projectButtonEl = this.formElement.querySelector('#submit');
        this.attach();
        this.configure();
    }
    submitHandler(e) {
        e.preventDefault();
        const title = this.titleInputEl.value;
        const description = this.descriptionInputEl.value;
        const people = +this.peopleInputEl.value;
        if (validate({ value: title, required: true }) &&
            validate({ value: description, required: true, minLen: 10 }) &&
            validate({ value: people, required: true, min: 2 })) {
            projectState.addProject(title, description, people);
            this.clearInputs();
        }
        else {
            alert('Please input valid data');
        }
    }
    clearInputs() {
        this.titleInputEl.value = '';
        this.peopleInputEl.value = '';
        this.descriptionInputEl.value = '';
    }
    configure() {
        this.formElement.addEventListener('submit', this.submitHandler);
    }
    attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.formElement);
    }
}
__decorate([
    BindThis,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProjectInput.prototype, "submitHandler", null);
class ProjectList {
    constructor(type) {
        this.type = type;
        this.projectListTemplate = document.getElementById('project-list');
        const importedNode = document.importNode(this.projectListTemplate.content, true);
        this.hostElement = document.getElementById('app');
        this.projectsElement = importedNode.firstElementChild;
        this.projectsElement.id = `${this.type}-project`;
        this.assignedProjects = [];
        projectState.addListener((projects) => {
            const relevantProjects = projects.filter(proj => {
                if (this.type === 'active') {
                    return proj.status === projectStatus.active;
                }
                else {
                    return proj.status === projectStatus.finished;
                }
            });
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        });
        this.attach();
        this.renderContent();
    }
    renderProjects() {
        const ul = document.getElementById(`${this.type}-project-list`);
        ul.innerHTML = ``;
        for (const project of this.assignedProjects) {
            const li = document.createElement('li');
            li.textContent = project.title;
            ul.appendChild(li);
        }
    }
    renderContent() {
        const listId = `${this.type}-project-list`;
        this.projectsElement.querySelector('ul').id = listId;
        this.projectsElement.querySelector('h2').innerText =
            this.type.toUpperCase() + ' PROJECTS';
    }
    attach() {
        this.hostElement.insertAdjacentElement('beforeend', this.projectsElement);
    }
}
var projectStatus;
(function (projectStatus) {
    projectStatus[projectStatus["active"] = 0] = "active";
    projectStatus[projectStatus["finished"] = 1] = "finished";
})(projectStatus || (projectStatus = {}));
class Project {
    constructor(id, title, description, people, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
    }
}
const input = new ProjectInput();
const activeProjects = new ProjectList('active');
const finishedProjects = new ProjectList('finished');
//# sourceMappingURL=app.js.map