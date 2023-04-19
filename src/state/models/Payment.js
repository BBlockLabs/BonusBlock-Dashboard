import Model from "@/state/models/Model";

export default class Payment extends Model {
  /**
   * @type {string}
   */
  wallet;

  /**
   * @type {string}
   */
  memo;

  /**
   * @type {BigInt}
   */
  ammount;

  /**
   * @type {String}
   */
  currency;

  /**
   * @type {Moment}
   */
  deadline;

  /**
   * @type {"pending" | "payed" | "canceled"}
   */
  status;

  /**
   * @type {string}
   */
  campaignId;
}
