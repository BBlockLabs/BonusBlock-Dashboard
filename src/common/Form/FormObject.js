export default class formObject {
  constructor() {
    this.json = JSON.stringify(this);
  }

  reset() {
    delete this.json;

    this.json = JSON.stringify(this);
  }

  /**
   * @returns {boolean}
   */
  dirty() {
    const oldJson = this.json;

    delete this.json;

    const newJson = JSON.stringify(this);

    this.json = oldJson;

    return newJson !== oldJson;
  }
}
