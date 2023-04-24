import Model from "@/state/models/Model";

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
   * @param {ActivityDto} dto
   * @return {Activity}
   */
  static fromDto(dto) {
    const activity = new Activity();

    activity.id = dto.id;
    activity.name = dto.name;
    activity.hash = dto.address;
    activity.actions = dto.actions.map(({ id }) => id);

    return activity;
  }
}
