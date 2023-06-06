export default class Social {
  /**
   * @type {"twitter" | "telegram" | "discord" | "youtube" | "reddit" | "website" | "newsletter"| "blog" | null}
   */
  type = "website";

  /**
   * @type {string}
   */
  link = "";

  /**
   * @param {SocialDto} dto
   * @return {Social}
   */
  static fromDto(dto) {
    const social = new Social();

    social.type = dto.type;
    social.link = dto.link;

    if (dto.title) {
      social.title = dto.title;
    }

    return social;
  }
}
