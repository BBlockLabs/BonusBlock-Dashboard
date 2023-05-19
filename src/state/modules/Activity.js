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
     * @return {function({
     *  queryString?: string,
     *  activity?: String,
     * }): Array<Action>}
     */
    queryActions: (state) => (filters) => {
      const actions = [];

      const activity = state.activities.has(filters.activity)
        ? state.activities.get(filters.activity)
        : null;

      state.actions.forEach((action) => {
        if (activity && !activity.actions.includes(action.id)) {
          return;
        }

        if (
          filters.queryString &&
          !action.name
            .toLowerCase()
            .includes(filters.queryString.toLowerCase()) &&
          !`0x${action.hash}`
            .toLowerCase()
            .includes(filters.queryString.toLowerCase())
        ) {
          return;
        }

        actions.push(action);
      });

      return actions;
    },
    /**
     * @param {ActivityState} state
     * @return {function({
     *  productId?: string,
     *  queryString?: string,
     *  selectedRewardedActivities?: Array,
     *  type?: ActivityType
     * }): Array<Activity>}
     */
    queryActivities: (state) => (filters) => {
      const activities = [];

      state.activities.forEach((activity) => {
        if (filters.type && activity.type !== filters.type) {
          return;
        }

        if (filters.productId && activity.product !== filters.productId) {
          return;
        }

        if (
          filters.queryString &&
          !activity.name
            .toLowerCase()
            .includes(filters.queryString.toLowerCase()) &&
          !`0x${activity.hash}`
            .toLowerCase()
            .includes(filters.queryString.toLowerCase())
        ) {
          return;
        }

        if (
          filters.selectedRewardedActivities &&
          filters.selectedRewardedActivities.length > 0
        ) {
          activity.actionsDisplay = activity.actions.filter((action) =>
            filters.selectedRewardedActivities.every(
              (activity) => activity.action !== action
            )
          );
        } else {
          activity.actionsDisplay = activity.actions;
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
     * @param {{
     *  action?: String,
     *  filter?: String,
     *  network: String,
     *  page: Number,
     *  perPage: Number,
     *  type: ActivityType,
     *  product: String
     * }} filters
     * @returns {Promise<ActionResponse>}
     */
    async queryActivities({ commit, getters }, filters) {
      const response = await HttpRequest.makeRequest("product/find", {
        ...filters,
        page: filters.page || 1,
        perPage: filters.perPage || 25,
        type: filters.type?.getName() || undefined,
      });

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
        getters["queryActivities"]({
          productId: filters.product,
          queryString: filters.filter,
          type: filters.type,
        })
      );
    },
  },
};
