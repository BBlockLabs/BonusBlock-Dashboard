import Model from "@/state/models/Model";

export default class Announcement extends Model {
  /**
   * @type {string}
   */
  banner;

  /**
   * @type {string}
   */
  title;

  /**
   * @type {string}
   */
  description;

  socials = [];
}
