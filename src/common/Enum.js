export default class Enum {
  /**
   * @param {String} name
   */
  constructor(name) {
    this.name = name;
  }

  /**
   * @return {String}
   */
  getName() {
    return this.name;
  }

  /**
   * @return {String}
   */
  toString() {
    return this.name;
  }
}
