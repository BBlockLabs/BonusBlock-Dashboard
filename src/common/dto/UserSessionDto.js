export default class UserSessionDto {
  /**
   * @type {moment}
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
