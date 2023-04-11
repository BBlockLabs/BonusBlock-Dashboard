import Model from "@/state/models/Model";

export class Organization extends Model {
  /**
   * @type {String}
   */
  id = '';

  /**
   * @type {String}
   */
  name = '';

  /**
   * @type {String|null}
   */
  url = null;

  /**
   * @type {String|null}
   */
  email = null;

  /**
   * @type {Blob|null}
   */
  avatar = null;

  /**
   * @type {Blob|null}
   */
  profileImage = null;

  /**
   * @type {String|null}
   */
  phoneNumber = null;

  /**
   * @type {Number}
   */
  serversCount = 0;

  /**
   * @type {Number}
   */
  totalLeasing = 0;

  /**
   * @type {Array}
   */
  regions = [];

  /**
   * @param {{
   *  id: String,
   *  name: String,
   *  url: String|null,
   *  email: String|null,
   *  avatar: Blob|null,
   *  profileImage: Blob|null,
   *  phoneNumber: String|null,
   *  serversCount: Number,
   *  totalLeasing: Number,
   *  regions: Number,
   * }} options
   */
  constructor(options = {}) {
    super();

    Object.keys(options).forEach(key => {
      this[key] = options[key];
    });
  }
}

export default Organization;
