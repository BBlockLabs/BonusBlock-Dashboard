import ActionResponse from "@/common/ActionResponse";
import Announcement from "@/state/models/Announcement.js";

const sleep = async (milliseconds) => {
  return new Promise((r) => {
    window.setTimeout(r, milliseconds);
  });
};

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
    /**
     * @param getters
     * @param commit
     * @param {string} announcementId
     * @returns {Promise<ActionResponse>}
     */
    async storeAnnouncement({ getters, commit }, announcementId) {
      const announcementDto =
        getters["getAnnouncement"](announcementId)?.toDto() || null;

      if (announcementDto === null) {
        return new ActionResponse(false, null, ["ANNOUNCEMENT_NOT_FOUND"]);
      }

      // simulate request
      await sleep(500);

      console.log(JSON.stringify(announcementDto));

      if (!announcementDto.id) {
        announcementDto.id = crypto.randomUUID();
      }

      if (announcementDto.title === "fail") {
        return new ActionResponse(false, null, ["REQUEST_FAILED"]);
      }

      console.log(announcementDto.id, announcementId);

      //////////////////////

      if (announcementDto.id !== announcementId) {
        commit("removeAnnouncement", announcementId);
      }

      commit("setAnnouncement", Announcement.fromDto(announcementDto));

      return new ActionResponse(true, announcementDto.id);
    },
  },
};
