import Enum from "@/common/Enum.js";

export default class ActivityAction extends Enum {
  static SWAP = new ActivityAction("ACTION_SWAP", "SWAP");
  static INTERACT = new ActivityAction("ACTION_INTERACT", "Interact with");
  static DEPOSIT = new ActivityAction("ACTION_DEPOSIT", "Deposit");
  static CREATE_VAULT = new ActivityAction("ACTION_CREATE_VAULT", "Create vault");
  static HOLDING = new ActivityAction("ACTION_HOLDING", "Holding");

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
