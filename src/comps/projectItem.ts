import { Component } from './baseComponent';
import { Project } from '../models/project';
import { BindThis } from '../decorators/autoBind';
import { Draggable } from '../models/drag-drop';

// ? Project item class
export class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  private project: Project;

  constructor(hostId: string, project: Project) {
    super('single-project', hostId, 'afterbegin', project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  @BindThis
  dragStartHandler(event: DragEvent) {
    event.dataTransfer!.setData('text/plain', this.project.id);
    event.dataTransfer!.effectAllowed = 'move';
  }
  // ! _ means we will not use the event obj here
  dragEndHandler(e: DragEvent) {
    const listEl = document.getElementById('active-project-list');
    const listEl2 = document.getElementById('finished-project-list');
    listEl2!.classList.remove('droppable');
    listEl!.classList.remove('droppable');
  }

  configure() {
    this.element.addEventListener('dragstart', this.dragStartHandler);
    this.element.addEventListener('dragend', this.dragEndHandler);
  }

  renderContent() {
    this.element.querySelector('h2')!.innerText = this.project.title;
    this.element.querySelector('h3')!.innerText =
      this.project.people.toString() +
      ` ${this.project.people > 1 ? 'Persons' : 'Person'} assigned`;
    this.element.querySelector('p')!.innerText = this.project.description;
  }
}
