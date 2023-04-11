import Model from "@/state/models/Model";

export class Workspace extends Model{
  /**
   * @type {String}
   */
  id = '';

  /**
   * @type {Blob|null}
   */
  icon = null;

  /**
   * @type {String}
   */
  name = '';

  /**
   * @type {String}
   */
  userId = '';

  /**
   * @param {{
   *  id: String,
   *  icon: Blob|null,
   *  name: String,
   *  userId: String,
   * }} options
   */
  constructor(options = {}) {
    super();

    Object.keys(options).forEach(key => {
      this[key] = options[key];
    });
  }
}

export default Workspace;
