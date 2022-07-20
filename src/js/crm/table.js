import moment from 'moment';
import TableRow from './tableRow';

export default class Table {
  constructor() {
    this.el = document.createElement('table');
    this.el.classList.add('table');

    this.items = [];

    this.el.innerHTML = '<thead></thead>';

    this.body = document.createElement('tbody');

    this.el.insertAdjacentElement('beforeEnd', this.body);
  }

  deleteItem(id) {
    const itemIndex = this.items.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
      return;
    }

    const item = this.items[itemIndex];
    item.remove();
    this.items.splice(itemIndex, 1);
  }

  addNewItem(id, title, description) {
    const item = new TableRow(id, title, description, false, moment().unix());
    this.items.push(item);

    item.bindToDOM(this.body);
  }

  updateItem(id, title, description) {
    const item = this.getItem(id);

    if (!item) {
      return;
    }

    item.title = title;
    item.description = description;
  }

  getItem(id) {
    return this.items.find((item) => item.id === id);
  }

  bindToDOM(parentEl) {
    parentEl.insertAdjacentElement('beforeEnd', this.el);
  }
}
