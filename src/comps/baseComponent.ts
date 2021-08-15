// ! Base Component Class
// ? abstract classes can only be used for inheritance not for creating instances
export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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
