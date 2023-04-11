export default class RouteMeta {
  static get AUTH_ANY() {return 0;}
  static get AUTH_ONLY_AUTHORIZED() {return 1;}
  static get AUTH_ONLY_NON_AUTHORIZED() {return 2;}

  /**
   * @type {boolean}
   */
  auth = RouteMeta.AUTH_ONLY_AUTHORIZED;

  /**
   * @param {{
   *  auth: AUTH_ANY|AUTH_ONLY_AUTHORIZED|AUTH_ONLY_NON_AUTHORIZED
   * }} options
   */
  constructor(options = {}) {
    Object.keys(options).forEach(key => {
      this[key] = options[key];
    });
  }
}
