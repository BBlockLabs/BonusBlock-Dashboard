import Enum from "@/common/Enum.js";

export default class CampaignStatus extends Enum {
  static DRAFT = new CampaignStatus("DRAFT", "Draft");
  static CONFIRMED = new CampaignStatus("CONFIRMED", "Confirmed");
  static PAID = new CampaignStatus("PAYED", "Paid");
  static RUNNING = new CampaignStatus("RUNNING", "Running");
  static ENDED = new CampaignStatus("ENDED", "Ended");
  static CANCELLED = new CampaignStatus("CANCELLED", "Cancelled");
  static DELETED = new CampaignStatus("DELETED", "Deleted");
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
