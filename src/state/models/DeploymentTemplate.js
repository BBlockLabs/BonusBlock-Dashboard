import Model from "@/state/models/Model";

export class DeploymentTemplate extends Model {
  /**
   * @type {String}
   */
  id = '';

  /**
   * @type {String}
   */
  title = '';

  /**
   * @type {String|null}
   */
  url = null;

  /**
   * @type {String|null}
   */
  shortText = "";

  /**
   * @type {String|null}
   */
  text = "";

  /**
   * @type {Blob|null}
   */
  icon = null;

  /**
   * @type {String|null}
   */
  updatedAt = null;

  /**
   * @type {Number}
   */
  contributors = 0;

  /**
   * @type {Number}
   */
  totalUses = 0;

  /**
   * @type {Number}
   */
  stars = 0;

  /**
   * @type {Number}
   */
  forks = 0;

  /**
   * @type {String}
   */
  yaml = "";

  /**
   * @param {{
   *  id: String,
   *  title: String,
   *  url: String|null,
   *  shortText: String|null,
   *  text: String|null,
   *  icon: Blob|null,
   *  updatedAt: String|null,
   *  totalUses: String,
   *  stars: Number,
   *  forks: Number,
   *  yaml: String,
   * }} options
   */
  constructor(options = {}) {
    super();

    Object.keys(options).forEach(key => {
      this[key] = options[key];
    });
  }
}

export default DeploymentTemplate;
