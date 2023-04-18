import Model from "@/state/models/Model";
import AnnouncementDto from "@/common/dto/AnnouncementDto.js";
import moment from "moment";

export default class Announcement extends Model {
  /**
   * @type {FileObject}
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
  static fromDto(dto) {
    const announcement = new Announcement();

    announcement.id = dto.id;

    announcement.version = parseInt(dto.version);
    announcement.createdOn = moment(dto.createdOn);
    announcement.modifiedOn = moment(dto.modifiedOn);
    announcement.banner = dto.banner;
    announcement.title = dto.title;
    announcement.description = dto.description;
    announcement.socials = dto.socials;
    announcement.campaign = dto.campaign;

    return announcement;
  }

  /**
   * @returns {AnnouncementDto}
   */
  toDto() {
    const dto = new AnnouncementDto();

    dto.id = this.getId();
    dto.version = this.version.toString();
    dto.createdOn = this.createdOn.toISOString();
    dto.modifiedOn = this.modifiedOn.toISOString();
    dto.banner = this.banner;
    dto.title = this.title;
    dto.description = this.description;
    dto.socials = this.socials;
    dto.campaign = this.campaign;

    return dto;
  }
}
