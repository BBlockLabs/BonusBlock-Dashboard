import formObject from "@/common/Form/FormObject.js";
import Social from "@/state/models/Social.js";

export default class AnnouncementFormObject extends formObject {
  /**
   * @type {File | null}
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
   * @type {string}
   */
  buttonLabel = "";
  /**
   * @type {string}
   */
  buttonUrl = "";
  /**
   * @type {Array<Social>}
   */
  socials = [];

  constructor() {
    super();

    this.socials.length = 10;
    this.socials = this.socials.map(() => new Social());
  }

  /**
   * @param {Announcement} announcement
   */
  setAnnouncementValues(announcement) {
    announcement.banner = this.banner;
    announcement.title = this.title;
    announcement.description = this.description;
    announcement.socials = this.socials.filter(({ link }) => link);
    announcement.buttonLabel = this.buttonLabel;
    announcement.buttonUrl = this.buttonUrl;
  }

  /**
   * @param {Announcement} announcement
   */
  setValuesFromAnnouncement(announcement) {
    this.banner = announcement.banner;
    this.title = announcement.title;
    this.description = announcement.description;

    this.socials = [...announcement.socials];

    for (let i = this.socials.length; i < 10; i++) {
      this.socials.push(new Social());
    }
    this.buttonLabel = announcement.buttonLabel;
    this.buttonUrl = announcement.buttonUrl;
  }
}
