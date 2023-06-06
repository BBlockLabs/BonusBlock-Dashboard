import ActionResponse from "@/common/ActionResponse";
import { HttpRequest } from "@/common/HttpRequest.js";
import Announcement from "@/state/models/Announcement.js";

export class AnnouncementState {
  /**
   * @type {Map<string, Announcement>}
   */
  announcements = new Map();
}

export default {
  namespaced: true,
  state: new AnnouncementState(),
  getters: {
    /**
     * @param state
     * @returns {function(string): Announcement | null}
     */
    getAnnouncement: (state) => (announcementId) => {
      if (!state.announcements.has(announcementId)) {
        return null;
      }

      return state.announcements.get(announcementId);
    },
    getByCampaign: (state) => (campaignId) => {
      const announcements = [];

      state.announcements.forEach((rewardedActivity) => {
        if (rewardedActivity.campaign === campaignId) {
          announcements.push(rewardedActivity);
        }
      });

      return announcements;
    },
  },
  mutations: {
    /**
     * @param {AnnouncementState} state
     * @param {Announcement} announcement
     */
    setAnnouncement(state, announcement) {
      state.announcements.set(announcement.id, announcement);
    },
    /**
     * @param {AnnouncementState} state
     * @param {string} announcementId
     */
    removeAnnouncement(state, announcementId) {
      if (!state.announcements.has(announcementId)) {
        return;
      }

      state.announcements.delete(announcementId);
    },
    /**
     * @param {AnnouncementState} state
     * @param {string} oldId
     * @param {string} newId
     */
    updateCampaignId(state, [oldId, newId]) {
      state.announcements.forEach((announcement) => {
        if (announcement.campaign !== oldId) {
          return;
        }

        announcement.campaign = newId;

        state.announcements.set(announcement.id, announcement);
      });
    },
  },
  actions: {
    async loadCampaignAnnouncements({ commit }, campaignId) {
      let response;
      try {
        response = await HttpRequest.makeRequest(
            `announcement/${campaignId}/list`
        );
      } catch (e) {
        return new ActionResponse(false, null, e);
      }

      /**
       * @type {Array<AnnouncementDto>}
       */
      const payload = response.payload;

      for (const announcementDto of payload) {
        const announcement = await Announcement.fromDto(announcementDto);

        announcement.campaign = campaignId;

        commit("setAnnouncement", announcement);
      }

      return new ActionResponse(true, null);
    },
    /**
     * @param getters
     * @param commit
     * @param {string} announcementId
     * @returns {Promise<ActionResponse>}
     */
    async storeAnnouncement({ getters, commit }, announcementId) {
      const announcement = getters["getAnnouncement"](announcementId);

      if (announcement === null) {
        return new ActionResponse(false, null, ["ANNOUNCEMENT_NOT_FOUND"]);
      }

      const endpoint =
        announcement.getId() !== null
          ? `announcement/${announcement.campaign}/${announcement.id}/update`
          : `announcement/${announcement.campaign}/create`;

      let response;
      try {
        response = await HttpRequest.makeRequest(
            endpoint,
            await announcement.toDto()
        );
      } catch (e) {
        return new ActionResponse(false, null, e);
      }

      /**
       * @type {string}
       */
      const newId = response.payload;

      if (newId !== announcementId) {
        announcement.id = newId;

        commit("removeAnnouncement", announcementId);
        commit("setAnnouncement", announcement);
      }

      return new ActionResponse(true, newId);
    },
  },
};
