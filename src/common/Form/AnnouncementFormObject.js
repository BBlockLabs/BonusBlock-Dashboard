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
  seo = "";
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

    for (let i = 0; i < 1; i++) {
      this.socials.push(new Social());
    }
  }

  /**
   * @param {Announcement} announcement
   */
  setAnnouncementValues(announcement) {
    announcement.banner = this.banner;
    announcement.title = this.title;
    announcement.description = this.description;
    announcement.seo = this.seo;
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
    this.seo = announcement.seo;
    this.description = announcement.description;

    this.socials = [...announcement.socials];

    this.buttonLabel = announcement.buttonLabel;
    this.buttonUrl = announcement.buttonUrl;
  }
}
