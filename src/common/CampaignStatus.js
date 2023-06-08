import Enum from "@/common/Enum.js";

export default class CampaignStatus extends Enum {
  static DRAFT = new CampaignStatus("DRAFT", "Draft", "info");
  static CONFIRMED = new CampaignStatus("CONFIRMED", "Confirmed", "warning");
  static PAID = new CampaignStatus("PAYED", "Paid", "warning");
  static RUNNING = new CampaignStatus("RUNNING", "Active", "success");
  static ENDED = new CampaignStatus("ENDED", "Finished", "info");
  static CANCELLED = new CampaignStatus("CANCELLED", "Cancelled", "danger");
  static DELETED = new CampaignStatus("DELETED", "Deleted", "danger");
  /**
   * @param {String} name
   * @param {String} label
   * @param {String} tagClass
   */
  constructor(name, label, tagClass) {
    super(name);
    this.label = label;
    this.tagClass = tagClass;
  }

  /**
   * @return {String}
   */
  getLabel() {
    return this.label;
  }

  /**
   * @return {String}
   */
  getTagClass() {
    return this.tagClass;
  }
}
