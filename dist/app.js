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
    }
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
        if (!validate({ value: title, required: true }) ||
            !validate({ value: description, required: true, minLen: 10 }) ||
            !validate({ value: people, required: true, min: 2 })) {
            console.log(title);
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
const input = new ProjectInput();
class ProjectList {
    constructor() {
        this.projectListTemplate = document.getElementById('project-list');
    }
}
