export default class AnnouncementDto {
  /**
   * @type {string}
   */
  id = "";
  /**
   * @type {string}
   */
  version = "";
  /**
   * @type {string}
   */
  createdOn = "";
  /**
   * @type {string}
   */
  modifiedOn = "";
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
}
