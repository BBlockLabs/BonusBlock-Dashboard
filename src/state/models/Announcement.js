import Model from "@/state/models/Model";
import AnnouncementDto from "@/common/dto/AnnouncementDto.js";
import FileParser from "@/common/FileParser.js";
import Social from "@/state/models/Social.js";

export default class Announcement extends Model {
  /**
   * @type {File}
   */
  banner;

  /**
   * @type {string}
   */
  title;

  /**
   * @type {string}
   */
  description;

  /**
   * @type {Array<Social>}
   */
  socials = [];

  /**
   * @type {string}
   */
  campaign;

  /**
   * @param {AnnouncementDto} dto
   * @return {Announcement}
   */
  static async fromDto(dto) {
    const announcement = new Announcement();

    if (dto.id !== undefined) {
      announcement.id = dto.id;
    }

    announcement.title = dto.title;
    announcement.description = dto.description;
    announcement.socials = JSON.parse(dto.socials)?.map(Social.fromDto);

    try {
      announcement.banner = await FileParser.base64ToFile(
        `data:${dto.imageType};base64,${dto.image}`
      );
    } catch (e) {
      console.error("IMAGE_DECODE_FAILED");
    }

    return announcement;
  }

  /**
   * @returns {AnnouncementDto}
   */
  async toDto() {
    const dto = new AnnouncementDto();

    dto.id = this.getId() || undefined;
    dto.title = this.title;
    dto.description = this.description;
    dto.socials = JSON.stringify(this.socials);

    try {
      dto.imageType = this.banner.type;
      dto.image = (await FileParser.fileToBase64(this.banner)).split(",")[1];
    } catch (e) {
      console.error("IMAGE_ENCODE_FAILED");
    }

    return dto;
  }
}
