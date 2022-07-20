import UPDATE_IMG from '../../img/pencil.png';
import DELETE_IMG from '../../img/recycle.png';
import { dateFormat } from '../utils';
import StatusButton from './statusButton';
import TicketTextBody from './ticketTextBody';

export default class TableRow {
  constructor(id, title, description, status, created, setStatusCallback) {
    this.el = document.createElement('tr');
    this.el.classList.add('crm-row');
    this.el.dataset.id = id;

    this.statusButton = new StatusButton(status, setStatusCallback);
    this.ticketBody = new TicketTextBody(title, description);

    const titleAndDescriptionBlock = document.createElement('div');
    titleAndDescriptionBlock.classList.add('title-description-block', 'w-100');

    const statusElement = document.createElement('td');
    this.statusButton.bindToDOM(statusElement);

    const ticketTextBody = document.createElement('td');
    this.ticketBody.bindToDOM(ticketTextBody);

    this.createdElement = document.createElement('td');
    this.createdElement.textContent = dateFormat(created);

    this.el.insertAdjacentElement('beforeEnd', statusElement);
    this.el.insertAdjacentElement('beforeEnd', ticketTextBody);
    this.el.insertAdjacentElement('beforeEnd', this.createdElement);

    const contorlsElement = document.createElement('td');
    contorlsElement.innerHTML = `
    <button class="btn d-inline-block control update">
      <img class="control-img" src=${UPDATE_IMG}>
    </button>
    <button class="btn d-inline-block control delete">
      <img class="control-img" src=${DELETE_IMG}>
    </button>`;

    this.el.insertAdjacentElement('beforeEnd', contorlsElement);
  }

  get id() {
    return Number(this.el.dataset.id);
  }

  get title() {
    return this.ticketBody.title;
  }

  set title(title) {
    this.ticketBody.title = title;
  }

  get status() {
    return this.status.status;
  }

  get description() {
    return this.ticketBody.description;
  }

  set description(description) {
    this.ticketBody.description = description;
  }

  remove() {
    this.el.remove();
  }

  bindToDOM(parentEl) {
    parentEl.insertAdjacentElement('beforeEnd', this.el);
  }
}
