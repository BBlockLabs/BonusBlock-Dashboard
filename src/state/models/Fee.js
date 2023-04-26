import Model from "@/state/models/Model";

export default class Fee extends Model {
  /**
   * @type {number}
   */
  baseFee = 0;

  /**
   * @type {number}
   */
  percentFee = 0;

  /**
   * @type {string}
   */
  contract = "";

  /**
   * @type {string}
   */
  payment = "";

  /**
   * @param {FeeDto} dto
   * @return {Fee}
   */
  static fromDto(dto) {
    const fee = new Fee();

    fee.baseFee = dto.baseFee;
    fee.percentFee = dto.percentFee;

    return fee;
  }
}
