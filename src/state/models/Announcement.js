import Model from "@/state/models/Model";
import AnnouncementDto from "@/common/dto/AnnouncementDto.js";
import FileParser from "@/common/FileParser.js";

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

    if (dto.announcementId !== undefined) {
      announcement.id = dto.announcementId;
    }

    announcement.title = dto.title;
    announcement.description = dto.description;
    announcement.socials = JSON.parse(dto.socials);
    announcement.banner = await FileParser.base64ToFile(dto.image);

    return announcement;
  }

  /**
   * @returns {AnnouncementDto}
   */
  async toDto() {
    const dto = new AnnouncementDto();

    dto.announcementId = this.getId() || undefined;
    dto.image = await FileParser.fileToBase64(this.banner);
    dto.title = this.title;
    dto.description = this.description;
    dto.socials = JSON.stringify(this.socials);

    return dto;
  }
}
