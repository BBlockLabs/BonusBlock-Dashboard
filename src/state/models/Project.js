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
   * @type {String}
   */
  imageType = "";

  /**
   * @param {{
   *  title: String,
   *  image: String,
   *  imageType: String,
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
