import Model from "@/state/models/Model";
import ContractDto from "@/common/dto/ContractDto.js";

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

  /**
   * @return {ContractDto}
   */
  toDto() {
    const dto = new ContractDto();

    dto.id = this.id;
    dto.networkName = this.network;
    dto.smartContractAddress = this.address;
    dto.decimal = this.decimalSpaces;
    dto.denom = this.denom;

    return dto;
  }
}
