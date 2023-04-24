import Model from "@/state/models/Model";

export default class Action extends Model {
  /**
   * @type {string}
   */
  name;

  /**
   * @type {string}
   */
  hash;

  /**
   * @param {ActionDto} dto
   * @return {Action}
   */
  static fromDto(dto) {
    const action = new Action();

    action.id = dto.id;
    action.name = dto.name;
    action.hash = dto.signature;

    return action;
  }
}
