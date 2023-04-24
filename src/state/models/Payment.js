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
   * @type {"INITIATED"}
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

    payment.memo = dto.comment || "";
    payment.ammount = BigInt(dto.payAmount);
    payment.currency = dto.payCurrency;
    payment.status = dto.status;
    payment.wallet = dto.destinationAddress;
    // payment.deadline...

    return payment;
  }
}
