import { Project, projectStatus } from '../models/project';

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
    this.updateListener();
  }

  moveProject(projId: string, newProjectStatus: projectStatus) {
    const project = this.projects.find((proj) => proj.id === projId);
    if (project && project.status !== newProjectStatus) {
      project.status = newProjectStatus;
      this.updateListener();
    }
  }

  private updateListener() {
    for (const listener of this.listener) {
      listener(this.projects.slice());
    }
  }
}
export const projectState = ProjectState.getInstance();
