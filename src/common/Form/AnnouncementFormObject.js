import formObject from "@/common/Form/FormObject.js";
import Social from "@/state/models/Social.js";

export default class AnnouncementFormObject extends formObject {
  /**
   * @type {string | null}
   */
  banner = null;
  /**
   * @type {string}
   */
  title = "";
  /**
   * @type {string}
   */
  description = "";

  /**
   * @type {Array<Social>}
   */
  socials = [];

  constructor() {
    super();

    this.socials = [
      new Social(),
      new Social(),
      new Social(),
      new Social(),
      new Social(),
      new Social(),
    ];
  }

  /**
   * @param {Announcement} announcement
   */
  setAnnouncementValues(announcement) {
    announcement.banner = this.banner;
    announcement.title = this.title;
    announcement.description = this.description;
    announcement.socials = this.socials;
  }

  /**
   * @param {Announcement} announcement
   */
  setValuesFromAnnouncement(announcement) {
    this.banner = announcement.banner;
    this.title = announcement.title;
    this.description = announcement.description;
    this.socials = announcement.socials;
  }
}
