import { Component } from './baseComponent';
import { BindThis } from '../decorators/autoBind';
import { validate } from '../utils/validation';
import { projectState } from '../state/projectState';

// ? Input hndler class
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputEl: HTMLInputElement;
  descriptionInputEl: HTMLInputElement;
  peopleInputEl: HTMLInputElement;

  projectButtonEl: HTMLButtonElement;

  constructor() {
    super('project-input', 'app', 'afterbegin', 'user-input');

    this.titleInputEl = this.element.querySelector(
      '#title'
    ) as HTMLInputElement;
    this.descriptionInputEl = this.element.querySelector(
      '#description'
    ) as HTMLInputElement;
    this.peopleInputEl = this.element.querySelector(
      '#people'
    ) as HTMLInputElement;
    this.projectButtonEl = this.element.querySelector(
      '#submit'
    ) as HTMLButtonElement;

    this.configure();
  }

  @BindThis
  private submitHandler(e: any) {
    e.preventDefault();
    const title = this.titleInputEl.value;
    const description = this.descriptionInputEl.value;
    const people = +this.peopleInputEl.value;

    // ? validating inputs....
    if (
      validate({ value: title, required: true }) &&
      validate({ value: description, required: true, minLen: 10 }) &&
      validate({ value: people, required: true, min: 1 })
    ) {
      projectState.addProject(title, description, people);
      this.clearInputs();
    } else {
      alert('Please input valid data');
    }
  }

  private clearInputs() {
    this.titleInputEl.value = '';
    this.peopleInputEl.value = '';
    this.descriptionInputEl.value = '';
  }

  configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }

  renderContent() {}
}
