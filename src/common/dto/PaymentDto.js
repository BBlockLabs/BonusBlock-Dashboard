import FeeDto from "@/common/dto/FeeDto.js";

export default class PaymentDto {
  /**
   * @type {string | null}
   */
  comment = "";
  /**
   * @type {string}
   */
  destinationAddress = "";
  /**
   * @type {string | null}
   */
  externalId = "";
  /**
   * @type {number}
   */
  payAmount = 0;
  /**
   * @type {string}
   */
  payCurrency = "";
  /**
   * @type {"INITIATED" | "SUCCESS"}
   */
  status = "INITIATED";
  /**
   * @type {FeeDto}
   */
  fee = new FeeDto();
}
