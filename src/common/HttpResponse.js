export class HttpResponse {
  /**
   * @type {any}
   */
  payload;
  /**
   * @type {Array<string>}
   */
  errors;
  /**
   * @type {boolean}
   */
  success;
  /**
   * @type {Moment}
   */
  now;

  /**
   * @param {boolean} success
   * @param {any} payload
   * @param {Array<string>} errors
   * @param {Moment} now
   */
  constructor(success, payload, errors, now) {
    this.errors = errors;
    this.payload = payload;
    this.success = success;
    this.now = now;
  }
}
