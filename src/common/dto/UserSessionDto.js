export default class UserSessionDto {
  /**
   * @type {Moment}
   */
  expiresOn = null;

  /**
   * @type {string}
   */
  token = "";

  constructor(options = {}) {
    Object.keys(options).forEach((key) => {
      this[key] = options[key];
    });
  }
}
