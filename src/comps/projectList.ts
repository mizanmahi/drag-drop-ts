import { Component } from './baseComponent';
import { ProjectItem } from './projectItem';
import { DragTarget } from '../models/drag-drop';
import { Project, projectStatus } from '../models/project';
import { BindThis } from '../decorators/autoBind';
import { projectState } from '../state/projectState';

// ? Project List class
export class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  assignedProjects: Project[];

  constructor(private type: 'active' | 'finished') {
    super('project-list', 'app', 'beforeend', `${type}-project`);
    this.assignedProjects = [];

    this.configure();
    this.renderContent();
  }

  @BindThis
  dragOverHandler(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      event.preventDefault();
      const listEl = this.element.querySelector('ul')!;
      listEl.classList.add('droppable');
    }
  }

  @BindThis
  dropHandler(event: DragEvent) {
    const prjId = event.dataTransfer!.getData('text/plain');
    projectState.moveProject(
      prjId,
      this.type === 'active' ? projectStatus.active : projectStatus.finished
    );
  }

  @BindThis
  dragLeaveHandler(event: DragEvent) {
    const listEl = this.element.querySelector('ul')!;
    listEl.classList.remove('droppable');
  }

  // this is an abstract method of base class
  configure() {
    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('drop', this.dropHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);

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
}
