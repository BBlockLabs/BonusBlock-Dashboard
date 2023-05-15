import Enum from "@/common/Enum.js";
import ActivityAction from "@/common/ActivityAction.js";
import { toRaw } from "vue";

export default class ActivityType extends Enum {
  static DEX = new ActivityType("TYPE_DEX", "Dex", ActivityAction.SWAP);
  static POOL = new ActivityType("TYPE_POOL", "Pool", ActivityAction.SWAP);
  static ROUTER = new ActivityType(
    "TYPE_ROUTER",
    "Router",
    ActivityAction.SWAP
  );

  /**
   * @param {String} name
   * @param {String} label
   * @param {ActivityAction} action
   */
  constructor(name, label, action) {
    super(name);

    this.label = label;
    this.action = action;
  }

  /**
   * @return {String}
   */
  getLabel() {
    return this.label;
  }

  /**
   * @return {ActivityAction}
   */
  getAction() {
    return toRaw(this.action);
  }
}
