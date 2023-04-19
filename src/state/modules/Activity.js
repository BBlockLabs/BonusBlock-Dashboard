import ActionResponse from "@/common/ActionResponse";
import activityMock from "@/state/mock/activity.json";
import moment from "moment";
import Activity from "@/state/models/Activity.js";

const sleep = async (milliseconds) => {
  return new Promise((r) => {
    window.setTimeout(r, milliseconds);
  });
};

export class ActivityState {
  /**
   * @type {Map<String, Activity>}
   */
  activities = new Map();
}

export default {
  namespaced: true,
  state: new ActivityState(),
  getters: {
    /**
     * @param state
     * @returns {function(string): Announcement | null}
     */
    getActivity: (state) => (activityId) => {
      if (!state.activities.has(activityId)) {
        return null;
      }

      return state.activities.get(activityId);
    },
    /**
     * @param {ActivityState} state
     * @returns {function({query?: string | undefined}): Activity[]}
     */
    queryActivities:
      (state) =>
      (filters = {}) => {
        const activities = [];

        state.activities.forEach((activity) => {
          if (!filters.query) {
            activities.push(activity);
            return;
          }

          if (activity.name.toLowerCase().includes(filters.query)) {
            activities.push(activity);
          }
        });

        return activities;
      },
  },
  mutations: {
    /**
     * @param {ActivityState} state
     * @param {Activity} activity
     */
    setActivity(state, activity) {
      state.activities.set(activity.id, activity);
    },
  },
  actions: {
    /**
     * @param commit
     * @param getters
     * @param {{query?: string}} filters
     * @returns {Promise<ActionResponse>}
     */
    async queryActivities({ commit, getters }, filters) {
      const currentActivityList = getters.queryActivities(filters.query);

      if (currentActivityList.length >= 10) {
        return new ActionResponse(true, currentActivityList);
      }

      await sleep(500);

      if (filters.query === "fail") {
        return new ActionResponse(false, null, ["REQUEST_FAILED"]);
      }

      const apiActivities = activityMock
        .filter(
          (mockActivity) =>
            !filters.query ||
            mockActivity.name
              .toLowerCase()
              .includes(filters.query.toLowerCase())
        )
        .map((mockActivity) => {
          const activity = new Activity();

          activity.id = mockActivity.id;
          activity.name = mockActivity.name;
          activity.hash = mockActivity.hash;
          activity.actions = mockActivity.actions;
          activity.version = mockActivity.version;
          activity.createdOn = moment(mockActivity.createdOn);
          activity.modifiedOn = moment(mockActivity.modifiedOn);

          return activity;
        });

      apiActivities.forEach((activity) => {
        commit("setActivity", activity);
      });

      return new ActionResponse(true, apiActivities);
    },
  },
};
