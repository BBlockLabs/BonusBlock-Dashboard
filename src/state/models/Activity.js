import Model from "@/state/models/Model";
import ActivityType from "@/common/ActivityType.js";

export default class Activity extends Model {
  /**
   * @type {string}
   */
  name;

  /**
   * @type {string}
   */
  hash;

  /**
   * @type {string}
   */
  product;

  /**
   * @type {string}
   */
  network;

  /**
   * @type {Array<String>}
   */
  actions = [];

  /**
   * @type {String|null}
   */
  url = null;

  /**
   * @type {ActivityType|null}
   */
  type = null;

  /**
   * @param {ActivityDto} dto
   * @return {Activity}
   */
  static fromDto(dto) {
    const activity = new Activity();

    activity.id = dto.id;
    activity.name = dto.name;
    activity.hash = dto.address;
    activity.actions = dto.actions.map(({ id }) => id);
    activity.type =
      Object.values(ActivityType).find((type) => type.getName() === dto.type) ||
      null;

    return activity;
  }
}
