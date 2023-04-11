import Model from "@/state/models/Model";

export class Deployment extends Model {
  /**
   * @type {String}
   */
  title = '';

  /**
   * @type {String}
   */
  yaml = '';

  /**
   *
   * @type {[Package]}
   */
  packages = [];

  /**
   * @param {{
   *   title: String,
   *   yaml: String,
   *   packages: [Package]
   * }} options
   */
  constructor(options = {}) {
    super();

    Object.keys(options).forEach(key => {
      this[key] = options[key];
    });
  }
}

export default Deployment;
