import Enum from "@/common/Enum.js";
import ActivityAction from "@/common/ActivityAction.js";
import { toRaw } from "vue";

export default class ContractType extends Enum {
  static DEX = new ContractType("TYPE_DEX", "DEX", ActivityAction.SWAP);
  static POOL = new ContractType("TYPE_POOL", "POOL", ActivityAction.SWAP);
  static ROUTER = new ContractType("TYPE_ROUTER", "ROUTER", ActivityAction.SWAP);
  static ENZYME = new ContractType("ENZYME_COMPTROLLER_PROXY", "ENZYME_COMPTROLLER_PROXY", ActivityAction.DEPOSIT);

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
