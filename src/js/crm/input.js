export default class Input {
  constructor(name, text, type, validateCallback, hidden = false) {
    this.el = document.createElement('div');
    this.el.classList.add(
      'd-flex',
      'flex-column',
      'mb-1',
      'align-items-center',
      'w-100'
    );

    this.validateCallback = validateCallback;

    this.isValid = true;

    const label = document.createElement('label');
    label.textContent = text;

    if (type === 'textarea') {
      this.input = document.createElement('textarea');
      this.input.setAttribute('rows', 3);
    } else {
      this.input = document.createElement('input');
      this.input.type = type;
    }

    this.input.classList.add('form-control');
    this.input.name = name;
    this.input.hidden = hidden;

    if (hidden) {
      this.el.classList.add('d-none');
    }

    this.error = document.createElement('span');
    this.error.classList.add('badge', 'bg-danger', 'd-none', 'mt-2');

    this.el.insertAdjacentElement('beforeend', label);
    this.el.insertAdjacentElement('beforeend', this.input);
    this.el.insertAdjacentElement('beforeend', this.error);
    this.reset();
  }

  validate() {
    if (!this.validateCallback) {
      this.hideError();
      return;
    }

    const { errorMessage, isValid } = this.validateCallback(this.value);

    this.error.textContent = errorMessage;

    this.isValid = isValid;

    if (!isValid) {
      this.showError();
      return;
    }

    this.hideError();
  }

  showError() {
    this.error.classList.remove('d-none');
  }

  hideError() {
    this.error.classList.add('d-none');
    this.error.textContent = '';
  }

  get valid() {
    return this.isValid;
  }

  bindToDOM(parentEl) {
    parentEl.insertAdjacentElement('beforeEnd', this.el);
  }

  disable() {
    this.input.disabled = true;
  }

  enable() {
    this.input.disabled = false;
  }

  get value() {
    if (this.type === 'radio') {
      return this.input.checked;
    }
    return this.input.value.trim();
  }

  reset() {
    if (this.type === 'radio') {
      this.input.checked = false;
      return;
    }
    this.input.value = '';
  }

  get type() {
    return this.input.type;
  }

  set value(value) {
    if (this.type === 'radio') {
      this.input.checked = value;
      return;
    }
    this.input.value = value;
  }
}
