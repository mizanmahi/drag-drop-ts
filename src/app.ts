function BindThis(target: any, methodName: string | symbol, descriptor: PropertyDescriptor){
  console.log('decorator ran...');
  console.log(descriptor);
  
  return {
    
  }
}


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
    const people = this.peopleInputEl.value;
    console.log({title, description, people});
  }

  private configure() {
    this.formElement.addEventListener('submit', this.submitHandler)
  }

  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.formElement);
  }
}

const input = new ProjectInput();

// const wrapper = document.querySelector(".wrapper")!;
// console.log(wrapper.childNodes);
