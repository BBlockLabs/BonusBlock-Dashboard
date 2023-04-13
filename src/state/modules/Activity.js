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
   * @type {Activity[]}
   */
  activities = [];
}

export default {
  namespaced: true,
  state: new ActivityState(),
  getters: {
    /**
     * @param {ActivityState} state
     * @returns {function({query?: string | undefined}): Activity[]}
     */
    queryActivities:
      (state) =>
      (filters = {}) => {
        let activities = state.activities;

        if (filters.query) {
          filters.query = filters.query.toLowerCase();

          activities = activities.filter((activity) =>
            activity.name.toLowerCase().includes(filters.query)
          );
        }

        return activities;
      },
  },
  mutations: {
    /**
     * @param {ActivityState} state
     * @param {Activity} activity
     */
    addActivity(state, activity) {
      const stateActivity = state.activities.find(
        (stateActivity) => stateActivity.id === activity.id
      );

      if (stateActivity) {
        return;
      }

      state.activities.push(activity);
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
        commit("addActivity", activity);
      });

      return new ActionResponse(true, apiActivities);
    },
  },
};
