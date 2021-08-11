// ? auto binding (this) decorator for methods
const  BindThis = (target: any, methodName: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => (
  {
    configurable: true,
    enumerable: false,
    get(){
       return descriptor.value.bind(this)
    }
  }
)

// ? validation logic
interface validatable {
  value: string | number;
  required?: boolean;
  maxLen?: number;
  minLen?: number;
  max?: number;
  min?: number
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

    this.titleInputEl = this.formElement.querySelector('#title') as HTMLInputElement;
    this.descriptionInputEl = this.formElement.querySelector('#description') as HTMLInputElement;
    this.peopleInputEl = this.formElement.querySelector('#people') as HTMLInputElement;
    this.projectButtonEl = this.formElement.querySelector('#submit') as HTMLButtonElement;

    this.attach();
    this.configure()
  }


  @BindThis
  private submitHandler(e: any) {
    e.preventDefault()
    const title = this.titleInputEl.value;
    const description = this.descriptionInputEl.value;
    const people = +this.peopleInputEl.value;

    // ? validating inputs....
    if (
      !validate({ value: title, required: true }) ||
      !validate({ value: description, required: true, minLen: 10 }) ||
      !validate({ value: people, required: true, min: 2 })
    ) {
      console.log(title);
      this.clearInputs();
    } else {
      alert('Please input valid data');
    }
    
  }

  private clearInputs(){
    this.titleInputEl.value = '';
    this.peopleInputEl.value = '';
    this.descriptionInputEl.value = '';
  }

  private configure() {
    this.formElement.addEventListener('submit', this.submitHandler)
  }

  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.formElement);
  }
}


const input = new ProjectInput();

// ? Project List class

class ProjectList{
  projectListTemplate: HTMLTemplateElement;
  projectsElement: HTMLElement;
  hostElement: HTMLDivElement;

  constructor(){
    this.projectListTemplate = document.getElementById(
      'project-list'
    ) as HTMLTemplateElement;
    
    const importedNode = document.importNode(this.projectListTemplate.content, true);
    this.hostElement = document.getElementById("app") as HTMLDivElement;
    this.projectsElement = importedNode.firstElementChild as HTMLElement; 
  }
}