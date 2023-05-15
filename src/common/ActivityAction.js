import Enum from "@/common/Enum.js";

export default class ActivityAction extends Enum {
  static SWAP = new ActivityAction("ACTION_SWAP", "Swap");

  static INTERACT = new ActivityAction("ACTION_INTERACT", "Interact with");

  /**
   * @param {String} name
   * @param {String} label
   */
  constructor(name, label) {
    super(name);

    this.label = label;
  }

  /**
   * @return {String}
   */
  getLabel() {
    return this.label;
  }
}
