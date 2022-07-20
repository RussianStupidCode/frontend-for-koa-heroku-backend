export default class TicketTextBody {
  constructor(title, description) {
    this.el = document.createElement('div');
    this.el.classList.add('w-100', 'ticket-text-body');

    this.titleElement = document.createElement('div');
    this.titleElement.textContent = title;
    this.titleElement.classList.add('ticket-title');

    this.descriptionElement = document.createElement('pre');
    this.descriptionElement.textContent = description;
    this.descriptionElement.classList.add('ticket-description', 'd-none');

    this.el.insertAdjacentElement('beforeEnd', this.titleElement);
    this.el.insertAdjacentElement('beforeEnd', this.descriptionElement);

    this.setListeners();
  }

  setListeners() {
    this.el.addEventListener('click', (event) => {
      const parent = event.target.closest('.ticket-text-body');

      if (!parent) {
        return;
      }

      this.descriptionElement.classList.toggle('d-none');
    });
  }

  get title() {
    return this.titleElement.textContent;
  }

  set title(title) {
    this.titleElement.textContent = title;
  }

  get description() {
    return this.descriptionElement.textContent;
  }

  set description(description) {
    this.descriptionElement.textContent = description;
  }

  bindToDOM(parentEl) {
    parentEl.insertAdjacentElement('beforeEnd', this.el);
  }
}
