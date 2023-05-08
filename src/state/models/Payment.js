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
  amount;

  /**
   * @type {String}
   */
  currency;

  /**
   * @type {Moment}
   */
  deadline;

  /**
   * @type {"INITIATED" | "SUCCESS"}
   */
  status;

  /**
   * @type {string}
   */
  campaignId;

  /**
   * @param {PaymentDto} dto
   * @return {Payment}
   */
  static fromDto(dto) {
    const payment = new Payment();

    payment.memo = dto.memo || "";
    payment.amount = BigInt(dto.payAmount);
    payment.currency = dto.payCurrency;
    payment.status = dto.status;
    payment.wallet = dto.destinationAddress;
    // payment.deadline...

    return payment;
  }
}
