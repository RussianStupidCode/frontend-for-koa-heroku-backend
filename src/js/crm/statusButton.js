import SUCCESS_IMG from '../../img/success.png';

export default class StatusButton {
  constructor(status = false, setStatusCallback) {
    this.statusValue = status;
    this.setStatusCallback = setStatusCallback;

    this.el = document.createElement('button');
    this.el.classList.add(
      'btn',
      'd-inline-block',
      'control',
      'status',
      'border',
      'border-primary',
      'rounded-circle'
    );

    this.image = document.createElement('img');
    this.image.classList.add('control-img');
    this.image.src = SUCCESS_IMG;

    this.el.insertAdjacentElement('beforeEnd', this.image);

    if (!this.status) {
      this.image.classList.add('d-none');
    }

    this.setListeners();
  }

  setListeners() {
    this.el.addEventListener('click', (event) => {
      const parent = event.target.closest('.status');

      if (!parent) {
        return;
      }

      this.statusValue = !this.statusValue;

      if (!this.statusValue) {
        this.image.classList.add('d-none');
      } else {
        this.image.classList.remove('d-none');
      }

      this.setStatusCallback?.(this.statusValue);
    });
  }

  get status() {
    return this.statusValue;
  }

  bindToDOM(parentEl) {
    parentEl.insertAdjacentElement('beforeEnd', this.el);
  }
}
