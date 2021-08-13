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
    constructor(templateId, hostElementId, placeToInsert, newElementId) {
        this.templateElememt = document.getElementById(templateId);
        this.hostElement = document.getElementById(hostElementId);
        const importedNode = document.importNode(this.templateElememt.content, true);
        this.element = importedNode.firstElementChild;
        if (newElementId)
            this.element.id = newElementId;
        this.attach(placeToInsert);
    }
    attach(placeToInsert) {
        this.hostElement.insertAdjacentElement(placeToInsert, this.element);
    }
}
class State {
    constructor() {
        this.listener = [];
    }
    addListener(fn) {
        this.listener.push(fn);
    }
}
class ProjectState extends State {
    constructor() {
        super();
        this.projects = [];
    }
    static getInstance() {
        if (this.instance)
            return this.instance;
        this.instance = new ProjectState();
        return this.instance;
    }
    addProject(title, description, people) {
        const newProject = new Project(Math.floor(Math.random() * 989898989).toString(), title, description, people, projectStatus.active);
        this.projects.push(newProject);
        for (const listener of this.listener) {
            listener(this.projects.slice());
        }
    }
}
const projectState = ProjectState.getInstance();
class ProjectInput extends Component {
    constructor() {
        super('project-input', 'app', 'afterbegin', 'user-input');
        this.titleInputEl = this.element.querySelector('#title');
        this.descriptionInputEl = this.element.querySelector('#description');
        this.peopleInputEl = this.element.querySelector('#people');
        this.projectButtonEl = this.element.querySelector('#submit');
        this.configure();
    }
    submitHandler(e) {
        e.preventDefault();
        const title = this.titleInputEl.value;
        const description = this.descriptionInputEl.value;
        const people = +this.peopleInputEl.value;
        if (validate({ value: title, required: true }) &&
            validate({ value: description, required: true, minLen: 10 }) &&
            validate({ value: people, required: true, min: 1 })) {
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
        this.element.addEventListener('submit', this.submitHandler);
    }
    renderContent() { }
}
__decorate([
    BindThis,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProjectInput.prototype, "submitHandler", null);
class ProjectItem extends Component {
    constructor(hostId, project) {
        super('single-project', hostId, 'afterbegin', project.id);
        this.project = project;
        this.configure();
        this.renderContent();
    }
    configure() { }
    renderContent() {
        this.element.querySelector('h2').innerText = this.project.title;
        this.element.querySelector('h3').innerText =
            this.project.people.toString() + ` ${this.project.people > 1 ? 'Persons' : 'Person'} assigned`;
        this.element.querySelector('p').innerText = this.project.description;
    }
}
class ProjectList extends Component {
    constructor(type) {
        super('project-list', 'app', 'beforeend', `${type}-project`);
        this.type = type;
        this.assignedProjects = [];
        this.configure();
        this.renderContent();
    }
    renderProjects() {
        const ul = document.getElementById(`${this.type}-project-list`);
        ul.innerHTML = ``;
        for (const project of this.assignedProjects) {
            new ProjectItem(this.element.querySelector('ul').id, project);
        }
    }
    renderContent() {
        const listId = `${this.type}-project-list`;
        this.element.querySelector('ul').id = listId;
        this.element.querySelector('h2').innerText =
            this.type.toUpperCase() + ' PROJECTS';
    }
    configure() {
        projectState.addListener((projects) => {
            const relevantProjects = projects.filter((proj) => {
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