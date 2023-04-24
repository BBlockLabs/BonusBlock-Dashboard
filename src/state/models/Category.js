import Model from "@/state/models/Model";
import { CategoryDto } from "@/common/dto/CategoryDto.js";

export default class Category extends Model {
  /**
   * @type {string}
   */
  name;

  /**
   * @param {CategoryDto} dto
   * @return {Category}
   */
  static fromDto(dto) {
    const network = new Category();

    network.id = dto.id;
    network.name = dto.name;

    return network;
  }

  /**
   * @returns {CategoryDto}
   */
  toDto() {
    const dto = new CategoryDto();

    dto.id = this.getId();
    dto.name = this.name;

    return dto;
  }
}
