// ? auto binding (this) decorator for methods
const BindThis = (
  target: any,
  methodName: string | symbol,
  descriptor: PropertyDescriptor
): PropertyDescriptor => ({
  configurable: true,
  enumerable: false,
  get() {
    return descriptor.value.bind(this);
  },
});

// ? validation logic
interface validatable {
  value: string | number;
  required?: boolean;
  maxLen?: number;
  minLen?: number;
  max?: number;
  min?: number;
}

const validate = (validating: validatable) => {
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

// ! Base Component Class
abstract class Component {
  constructor(){}
  abstract attach():void;
}


type Listener = (projects: Project[]) => void;

// ? Implementing singleton pattern
class ProjectState {
  private projects: any[] = [];

  private static instance: ProjectState;

  private listener: Listener[] = [];

  // ? this is a private constructor and its can't be called from the outside of this class to instantiate new object based on this class
  private constructor() {}

  static getInstance() {
    // ? in static method this refers to the class itself not the instance
    if (this.instance) return this.instance;
    this.instance = new ProjectState();
    return this.instance;
  }

  addListener(fn: Listener) {
    this.listener.push(fn);
  }

  addProject(title: string, description: string, people: number) {
    const newProject = new Project(
      Math.floor(Math.random() * 989898989),
      title,
      description,
      people,
      projectStatus.active
    );
    this.projects.push(newProject);
    for (const listener of this.listener) {
      listener(this.projects.slice());
    }
  }
}
const projectState = ProjectState.getInstance();

// ? Input hndler class
class ProjectInput {
  formtemplate: HTMLTemplateElement;
  formElement: HTMLFormElement;
  hostElement: HTMLDivElement;

  titleInputEl: HTMLInputElement;
  descriptionInputEl: HTMLInputElement;
  peopleInputEl: HTMLInputElement;

  projectButtonEl: HTMLButtonElement;

  constructor() {
    this.formtemplate = document.getElementById(
      'project-input'
    ) as HTMLTemplateElement;
    this.hostElement = document.getElementById('app') as HTMLDivElement;

    const importedNode = document.importNode(this.formtemplate.content, true);
    this.formElement = importedNode.firstElementChild as HTMLFormElement;
    this.formElement.id = 'user-input';

    this.titleInputEl = this.formElement.querySelector(
      '#title'
    ) as HTMLInputElement;
    this.descriptionInputEl = this.formElement.querySelector(
      '#description'
    ) as HTMLInputElement;
    this.peopleInputEl = this.formElement.querySelector(
      '#people'
    ) as HTMLInputElement;
    this.projectButtonEl = this.formElement.querySelector(
      '#submit'
    ) as HTMLButtonElement;

    this.attach();
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
      validate({ value: people, required: true, min: 2 })
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

  private configure() {
    this.formElement.addEventListener('submit', this.submitHandler);
  }

  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.formElement);
  }
}

// ? Project List class
class ProjectList {
  projectListTemplate: HTMLTemplateElement;
  projectsElement: HTMLElement;
  hostElement: HTMLDivElement;

  assignedProjects: Project[];

  constructor(private type: 'active' | 'finished') {
    this.projectListTemplate = document.getElementById(
      'project-list'
    ) as HTMLTemplateElement;

    const importedNode = document.importNode(
      this.projectListTemplate.content,
      true
    );
    this.hostElement = document.getElementById('app') as HTMLDivElement;
    this.projectsElement = importedNode.firstElementChild as HTMLElement;
    // ? adding an id base on type
    this.projectsElement.id = `${this.type}-project`;

    this.assignedProjects = [];

    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter(proj => {
        if(this.type === 'active'){
          return proj.status === projectStatus.active
        }else {
          return proj.status === projectStatus.finished;
        }
      })
      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });

    this.attach();
    this.renderContent();
  }

  private renderProjects() {
    const ul = document.getElementById(
      `${this.type}-project-list`
    ) as HTMLUListElement;

    ul.innerHTML = ``;

    for (const project of this.assignedProjects) {
      const li = document.createElement('li');
      li.textContent = project.title;
      ul.appendChild(li);
    }
  }

  private renderContent() {
    const listId = `${this.type}-project-list`;
    this.projectsElement.querySelector('ul')!.id = listId;
    this.projectsElement.querySelector('h2')!.innerText =
      this.type.toUpperCase() + ' PROJECTS';
  }

  private attach() {
    this.hostElement.insertAdjacentElement('beforeend', this.projectsElement);
  }
}

enum projectStatus {
  active,
  finished,
}

// ? Project Class
class Project {
  constructor(
    public id: number,
    public title: string,
    public description: string,
    public people: number,
    public status: projectStatus
  ) {}
}

const input = new ProjectInput();

const activeProjects = new ProjectList('active');
const finishedProjects = new ProjectList('finished');

// const singleProject = new Project();
