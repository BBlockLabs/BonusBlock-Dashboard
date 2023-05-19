import Model from "@/state/models/Model";

export default class PaymentPreview extends Model {
  /**
   * @type {BigInt}
   */
  gasFee = 0;
  /**
   * @type {BigInt}
   */
  commissionFee = 0;
  /**
   * @type {BigInt}
   */
  baseAmount = 0;
  /**
   * @type {BigInt}
   */
  totalAmount = 0;

  /**
   * @param {PaymentPreviewDto} dto
   * @return {PaymentPreview}
   */
  static fromDto(dto) {
    const paymentPreview = new PaymentPreview();

    paymentPreview.gasFee = dto.gasFee ? BigInt(dto.gasFee) : 0;
    paymentPreview.commissionFee = BigInt(dto.commissionFee);
    paymentPreview.baseAmount = BigInt(dto.baseAmount);
    paymentPreview.totalAmount = BigInt(dto.totalAmount);

    return paymentPreview;
  }
}
