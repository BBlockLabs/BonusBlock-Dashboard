import Model from "@/state/models/Model";

export default class Contract extends Model {
  /**
   * @type {string}
   */
  address;

  /**
   * @type {string}
   */
  network;

  /**
   * @type {number}
   */
  decimalSpaces;

  /**
   * @type {string}
   */
  denom;

  /**
   * @param {ContractDto} dto
   * @return {Contract}
   */
  static fromDto(dto) {
    const contract = new Contract();

    contract.id = dto.id;
    contract.network = dto.networkName;
    contract.address = dto.smartContractAddress;
    contract.decimalSpaces = dto.decimal;
    contract.denom = dto.denom;

    return contract;
  }
}
