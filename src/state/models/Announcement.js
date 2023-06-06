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
   * @type {string}
   */
  seo;

  /**
   * @type {string}
   */
  buttonLabel;

  /**
   * @type {string}
   */
  buttonUrl;

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

    if (dto.campaign) {
      announcement.campaign = dto.campaign;
    }

    announcement.title = dto.title;
    announcement.description = dto.description;
    announcement.seo = dto.seo;

    const socials = JSON.parse(dto.socials)?.map(Social.fromDto);

    announcement.socials = socials.filter(
      ({ type }) => type !== "main-label" && type !== "main-link"
    );

    // This part would be nicer if we would add these fields in backend..
    const buttonLink = socials.find(({ type }) => type === "main-link");

    if (buttonLink) {
      announcement.buttonLabel = buttonLink.title ?? "Visit";
      announcement.buttonUrl = buttonLink.link;
    }

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
    dto.seo = this.seo;

    const socials = [...this.socials];

    socials.push(Social.fromDto({ type: "main-link", link: this.buttonUrl, title: this.buttonLabel }));

    dto.socials = JSON.stringify(socials);

    if (this.campaign) {
      dto.campaign = this.campaign;
    }

    try {
      dto.imageType = this.banner.type;
      dto.image = (await FileParser.fileToBase64(this.banner)).split(",")[1];
    } catch (e) {
      console.error("IMAGE_ENCODE_FAILED");
    }

    return dto;
  }
}
