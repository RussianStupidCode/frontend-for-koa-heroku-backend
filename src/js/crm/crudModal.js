import { CONTROL_TYPES } from './control_types';

export default class CRUDModal {
  constructor(deleteCallback, updateCallback, createCallback, cancelCallback) {
    this.callbacks = {
      [CONTROL_TYPES.delete]: deleteCallback,
      [CONTROL_TYPES.update]: updateCallback,
      [CONTROL_TYPES.create]: createCallback,
    };

    this.cancelCallback = cancelCallback;

    this.inputs = new Map();
    this.controlType = null;

    this.el = document.createElement('form');
    this.el.classList.add('crud-form', 'd-none');
    this.el.noValidate = true;

    this.titleEl = document.createElement('span');
    this.titleEl.classList.add('crud-title', 'mb-2');

    this.inputsBlock = document.createElement('div');
    const buttonsBlock = document.createElement('div');

    this.inputsBlock.classList.add(
      'd-flex',
      'flex-column',
      'align-items-center',
      'justify-content-center',
      'w-100'
    );

    buttonsBlock.classList.add(
      'd-flex',
      'flex-row',
      'align-items-center',
      'justify-content-center',
      'mt-2'
    );

    this.submitButton = document.createElement('button');
    this.submitButton.classList.add(
      'btn',
      'bg-success',
      'crud-control',
      'text-light',
      'mx-4'
    );
    this.submitButton.textContent = 'Подтвердить';

    this.cancelButton = document.createElement('button');
    this.cancelButton.classList.add(
      'btn',
      'bg-warning',
      'crud-control',
      'mx-4'
    );
    this.cancelButton.textContent = 'Отмена';

    buttonsBlock.insertAdjacentElement('beforeEnd', this.submitButton);
    buttonsBlock.insertAdjacentElement('beforeEnd', this.cancelButton);

    this.el.insertAdjacentElement('beforeEnd', this.titleEl);
    this.el.insertAdjacentElement('beforeEnd', this.inputsBlock);
    this.el.insertAdjacentElement('beforeEnd', buttonsBlock);

    this.setListeners();
    this.close();
  }

  addInput(name, input) {
    if (this.inputs.has(name)) {
      return;
    }

    this.inputs.set(name, input);
    input.bindToDOM(this.inputsBlock);
  }

  setInput(name, value) {
    this.inputs.get(name).value = value;
  }

  getInput(name) {
    return this.inputs.get(name).value;
  }

  setListeners() {
    this.submitButton.addEventListener('click', (event) => {
      event.preventDefault();

      if (!(this.controlType in this.callbacks)) {
        return;
      }

      const isValid = this.validateInputs();

      if (!isValid) {
        return;
      }

      this.callbacks[this.controlType](event);
      this.close();
      this.resetInputs();
    });

    this.cancelButton.addEventListener('click', (event) => {
      event.preventDefault();
      this.cancelCallback();
      this.close();
      this.resetInputs();
    });
  }

  disableInputs() {
    this.inputs.forEach((input) => {
      input.disable();
    });
  }

  enableInputs() {
    this.inputs.forEach((input) => {
      input.enable();
    });
  }

  resetInputs() {
    this.inputs.forEach((input) => {
      input.reset();
    });
  }

  validateInputs() {
    for (const value of this.inputs.values()) {
      value.validate();
      if (!value.valid) {
        return false;
      }
    }
    return true;
  }

  open(title, controlType) {
    this.controlType = controlType;
    this.titleEl.textContent = title;
    this.el.classList.remove('d-none');

    this.inputs.forEach((input) => {
      input.hideError();
    });

    if (controlType === CONTROL_TYPES.delete) {
      this.disableInputs();
    } else {
      this.enableInputs();
    }
  }

  close() {
    this.el.classList.add('d-none');
  }

  bindToDOM(parentEl) {
    parentEl.insertAdjacentElement('beforeEnd', this.el);
  }
}
