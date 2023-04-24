export default class Social {
  /**
   * @type {"discord" | "twitter" | null}
   */
  type = null;

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

    return social;
  }
}
