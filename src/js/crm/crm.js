import { titleValidate } from '../utils';
import { CONTROL_TYPES, getContolType } from './control_types';
import CRUDModal from './crudModal';
import Input from './input';
import Table from './table';
import * as ticket from '../api/tickets';

export default class CRM {
  constructor() {
    this.lastSelectedItemId = null;

    this.nonactiveFilter = document.createElement('div');
    this.nonactiveFilter.classList.add('nonactive-filter');

    this.el = document.createElement('div');
    this.el.classList.add(
      'crm',
      'd-flex',
      'flex-column',
      'align-items-center',
      'border',
      'border-primary',
      'border-2',
      'rounded-3',
      'm-2'
    );

    this.headerEl = document.createElement('div');
    this.headerEl.classList.add(
      'd-flex',
      'justify-content-between',
      'align-items-center',
      'flex-row',
      'crm-header'
    );

    this.headerEl.innerHTML = `
    <span class="m-1 header-title">Тикеты</span> 
    <button type="button" class="btn control create m-1">
      Добавить тикет
    </button>`;

    this.table = new Table();

    this.bodyEl = document.createElement('div');
    this.bodyEl.classList.add('crm-body', 'px-1');

    this.table.bindToDOM(this.bodyEl);

    this.el.insertAdjacentElement('beforeEnd', this.headerEl);
    this.el.insertAdjacentElement('beforeEnd', this.bodyEl);

    this.crudModal = new CRUDModal(
      this.deleteItem.bind(this),
      this.updateItem.bind(this),
      this.createItem.bind(this),
      this.unblockingCRM.bind(this)
    );

    this.crudModal.bindToDOM(this.el);
    this.createCRUDModalInputs();

    this.setListeners();
    this.fetchAllTickets();
  }

  fetchAllTickets() {
    this.table.reset();
    this.blockingCRM();

    const ticketsPromise = ticket.all();

    ticketsPromise
      .then((response) => response.json())
      .then((data) => {
        data.forEach((item) => {
          this.table.addNewItem(
            item.id,
            item.name,
            item.description,
            item.status,
            item.created,
            (status) => {
              ticket.update({ id: item.id, status });
            }
          );

          const allTicketInfo = ticket.get(item.id);
          allTicketInfo
            .then((response) => response.json())
            .then((json) => {
              this.table.updateItem(json.id, json.name, json.description);
            });
        });
        this.unblockingCRM();
      });
  }

  createCRUDModalInputs() {
    const titleInput = new Input('title', 'Название', 'text', titleValidate);
    this.crudModal.addInput('title', titleInput);

    const descriptionInput = new Input(
      'description',
      'Описание',
      'textarea',
      titleValidate
    );
    this.crudModal.addInput('description', descriptionInput);

    const statusInput = new Input('status', 'статус', 'radio', undefined, true);
    this.crudModal.addInput('status', statusInput);
  }

  setListeners() {
    this.el.addEventListener('click', (event) => {
      if (this.isInit) {
        return;
      }

      const { target } = event;

      const control = target.closest('.control');

      if (!control) {
        return;
      }

      const controlType = getContolType(control);

      if (controlType === CONTROL_TYPES.create) {
        this.blockingCRM();
        this.crudModal.open('Добавление тикета', CONTROL_TYPES.create);
        return;
      }

      if (controlType === CONTROL_TYPES.delete) {
        this.blockingCRM();
        this.lastSelectedItemId = control.closest('.crm-row').dataset.id;

        const item = this.table.getItem(Number(this.lastSelectedItemId));

        this.crudModal.setInput('title', item.title);
        this.crudModal.setInput('description', item.description);

        this.crudModal.open(
          'Вы действительно хотите удалить?',
          CONTROL_TYPES.delete
        );
      }

      if (controlType === CONTROL_TYPES.update) {
        this.blockingCRM();
        this.lastSelectedItemId = control.closest('.crm-row').dataset.id;

        const item = this.table.getItem(Number(this.lastSelectedItemId));

        this.crudModal.setInput('title', item.title);
        this.crudModal.setInput('description', item.description);

        this.crudModal.open(
          `Обновление тикета ${item.title}`,
          CONTROL_TYPES.update
        );
      }
    });
  }

  createItem() {
    const title = this.crudModal.getInput('title');
    const description = this.crudModal.getInput('description');
    const status = this.crudModal.getInput('status');

    ticket
      .create({ title, description, status })
      .then((response) => response.json())
      .then((json) => {
        this.table.addNewItem(
          json.id,
          json.name,
          json.description,
          json.status,
          (status) => {
            ticket.update({ id: json.id, status });
          }
        );

        this.fetchAllTickets();
      });
  }

  deleteItem() {
    if (this.lastSelectedItemId !== null) {
      ticket.remove(this.lastSelectedItemId).then(() => {
        this.fetchAllTickets();
      });
    }
  }

  updateItem() {
    const title = this.crudModal.getInput('title');
    const description = this.crudModal.getInput('description');
    const status = this.crudModal.getInput('status');

    ticket
      .update({ id: this.lastSelectedItemId, title, description, status })
      .then((response) => response.json())
      .then((json) => {
        this.table.updateItem(json.id, json.name, json.description);
        this.unblockingCRM();
      });
  }

  blockingCRM() {
    this.nonactiveFilter.classList.remove('d-none');
  }

  unblockingCRM() {
    this.nonactiveFilter.classList.add('d-none');
  }

  bindToDOM(parentEl) {
    parentEl.insertAdjacentElement('beforeEnd', this.el);
    parentEl.insertAdjacentElement('beforeEnd', this.nonactiveFilter);
  }
}
