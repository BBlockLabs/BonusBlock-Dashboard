import ActionResponse from "@/common/ActionResponse";
import Activity from "@/state/models/Activity.js";
import { HttpRequest } from "@/common/HttpRequest.js";
import Action from "@/state/models/Action.js";

export class ActivityState {
  /**
   * @type {Map<String, Activity>}
   */
  activities = new Map();
  /**
   * @type {Map<String, Action>}
   */
  actions = new Map();
}

export default {
  namespaced: true,
  state: new ActivityState(),
  getters: {
    /**
     * @param {ActivityState} state
     * @returns {function(string): Action | null}
     */
    getAction: (state) => (actionId) => {
      if (!state.actions.has(actionId)) {
        return null;
      }

      return state.actions.get(actionId);
    },
    /**
     * @param {ActivityState} state
     * @returns {function(string): Activity | null}
     */
    getActivity: (state) => (activityId) => {
      if (!state.activities.has(activityId)) {
        return null;
      }

      return state.activities.get(activityId);
    },
    /**
     * @param {ActivityState} state
     * @returns {function(network: string, product: string, queryString: string, selectedRewardedActivities: Array): Array<Activity>}
     */
    queryActivities:
      (state) =>
      (networkId, productId, queryString = "", selectedRewardedActivities) => {
        const activities = [];

        state.activities.forEach((activity) => {
          if (activity.network !== networkId) {
            return;
          }

          if (activity.product !== productId) {
            return;
          }

          if (
            queryString &&
            activity.hash !== queryString &&
            activity.hash !== `0x${queryString}` &&
            !activity.name.toLowerCase().includes(queryString.toLowerCase())
          ) {
            return;
          }
          if (
            selectedRewardedActivities &&
            selectedRewardedActivities.length > 0
          ) {
            activity.actionsDisplay = activity.actions.filter((action) =>
              selectedRewardedActivities.every(
                (activity) => activity.action !== action
              )
            );
          } else {
            activity.actionsDisplay = activity.actions;
          }

          if (activity.actionsDisplay.length === 0) {
            return;
          }

          activities.push(activity);
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
    /**
     * @param {ActivityState} state
     * @param {Action} action
     */
    setAction(state, action) {
      state.actions.set(action.id, action);
    },
  },
  actions: {
    /**
     * @param commit
     * @param getters
     * @param {{filterString?: string, product: string, network: string}} filters
     * @returns {Promise<ActionResponse>}
     */
    async queryActivities({ commit, getters }, filters) {
      const response = await HttpRequest.makeRequest(
        `product/${filters.product}`,
        filters
      );

      if (!response.success) {
        return new ActionResponse(false, null, response.errors);
      }

      /**
       * @type {Array<ActivityDto>}
       */
      const payload = response.payload;

      payload.forEach((activityDto) => {
        const activity = Activity.fromDto(activityDto);

        activity.network = filters.network;
        activity.product = filters.product;

        activityDto.actions.forEach((actionDto) => {
          const action = Action.fromDto(actionDto);

          commit("setAction", action);
        });

        commit("setActivity", activity);
      });

      return new ActionResponse(
        true,
        getters["queryActivities"](
          filters.network,
          filters.product,
          filters.filterString
        )
      );
    },
  },
};
