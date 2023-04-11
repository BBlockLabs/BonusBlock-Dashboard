import Model from "@/state/models/Model";

export class User extends Model {
  static get LOGIN_METHOD_GITHUB() {
    return 1;
  }
  static get LOGIN_METHOD_METAMASK() {
    return 2;
  }
  static get LOGIN_METHOD_KEPLR() {
    return 3;
  }
  static get LOGIN_METHOD_PASSWORD() {
    return 4;
  }

  /**
   * @type {String}
   */
  id = "";

  /**
   * @type {String}
   */
  username = "";

  /**
   * @type {LOGIN_METHOD_GITHUB|LOGIN_METHOD_METAMASK|LOGIN_METHOD_KEPLR|LOGIN_METHOD_PASSWORD} User.LOGIN_METHOD_*
   */
  loginMethod = User.LOGIN_METHOD_PASSWORD;

  /**
   * @type {Blob|File|null}
   */
  avatar = null;

  /**
   * @type {[Deployment]}
   */
  deployments = [];

  /**
   * @param {{
   *  id: String,
   *  username: String,
   *  loginMethod: LOGIN_METHOD_GITHUB|LOGIN_METHOD_METAMASK|LOGIN_METHOD_KEPLR|LOGIN_METHOD_PASSWORD,
   *  avatar: Blob|File|null,
   *  deployments: Array,
   * }} options
   */
  constructor(options = {}) {
    super();

    Object.keys(options).forEach((key) => {
      this[key] = options[key];
    });
  }
}

export default User;
