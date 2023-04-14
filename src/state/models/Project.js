import Model from "@/state/models/Model";

export class Project extends Model {
  /**
   * @type {String}
   */
  title = "";

  /**
   * @type {String}
   */
  image = "";

  /**
   * @param {{
   *  title: String,
   *  image: String,
   * }} options
   */
  constructor(options = {}) {
    super();

    Object.keys(options).forEach((key) => {
      this[key] = options[key];
    });
  }
}

export default Project;
