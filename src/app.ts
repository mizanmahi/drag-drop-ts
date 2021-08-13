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
// ? abstract classes can only be used for inheritance not for creating instances
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElememt: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    templateId: string,
    hostElementId: string,
    placeToInsert: InsertPosition,
    newElementId?: string
  ) {
    this.templateElememt = document.getElementById(
      templateId
    ) as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId) as T;

    const importedNode = document.importNode(
      this.templateElememt.content,
      true
    );
    this.element = importedNode.firstElementChild as U;
    if (newElementId) this.element.id = newElementId;
    this.attach(placeToInsert);
  }

  private attach(placeToInsert: InsertPosition) {
    this.hostElement.insertAdjacentElement(placeToInsert, this.element);
  }

  abstract configure(): void;
  abstract renderContent(): void;
}

type Listener<T> = (projects: T[]) => void;

class State<T> {
  protected listener: Listener<T>[] = [];

  addListener(fn: Listener<T>) {
    this.listener.push(fn);
  }
}

// ? Project State Class
// ? Implementing singleton pattern
class ProjectState extends State<Project> {
  private projects: any[] = [];

  private static instance: ProjectState;

  // ? this is a private constructor and its can't be called from the outside of this class to instantiate new object based on this class
  private constructor() {
    super();
  }

  static getInstance() {
    // ? in static method this refers to the class itself not the instance
    if (this.instance) return this.instance;
    this.instance = new ProjectState();
    return this.instance;
  }

  addProject(title: string, description: string, people: number) {
    const newProject = new Project(
      Math.floor(Math.random() * 989898989).toString(),
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
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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

// ? Project item class
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> {
  private project: Project;

  constructor(hostId: string, project: Project) {
    super('single-project', hostId, 'afterbegin', project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  configure() {}
  renderContent() {
    this.element.querySelector('h2')!.innerText = this.project.title;
    this.element.querySelector('h3')!.innerText = 
      this.project.people.toString() + ` ${this.project.people > 1 ? 'Persons' : 'Person'} assigned`;
    this.element.querySelector('p')!.innerText = this.project.description;
  }
}

// ? Project List class
class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  assignedProjects: Project[];

  constructor(private type: 'active' | 'finished') {
    super('project-list', 'app', 'beforeend', `${type}-project`);
    this.assignedProjects = [];

    this.configure();
    this.renderContent();
  }

  private renderProjects() {
    const ul = document.getElementById(
      `${this.type}-project-list`
    )! as HTMLUListElement;
    ul.innerHTML = ``;
    for (const project of this.assignedProjects) {
      new ProjectItem(this.element.querySelector('ul')!.id, project);
    }
  }

  renderContent() {
    const listId = `${this.type}-project-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.innerText =
      this.type.toUpperCase() + ' PROJECTS';
  }

  // this is an abstract method of base class
  configure() {
    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter((proj) => {
        if (this.type === 'active') {
          return proj.status === projectStatus.active;
        } else {
          return proj.status === projectStatus.finished;
        }
      });
      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });
  }
}

enum projectStatus {
  active,
  finished,
}

// ? Project Class
class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: projectStatus
  ) {}
}

const input = new ProjectInput();

const activeProjects = new ProjectList('active');
const finishedProjects = new ProjectList('finished');
