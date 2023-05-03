export default class ContractDto {
  /**
   * @type {string}
   */
  id = "";
  /**
   * @type {string}
   */
  smartContractAddress = "";
  /**
   * @type {string}
   */
  networkName = "";
  /**
   * @type {string}
   */
  denom = "";
  /**
   * @type {number}
   */
  decimal = 0;

  /**
   * @type {FeeDto}
   */
  fee = null;
  /**
   * @type {string}
   */
  title = "";
}
