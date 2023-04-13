export class RewardedActivityState {
  /**
   * @type {Map<string, RewardedActivity>}
   */
  rewardedActivities = new Map();
}

export default {
  namespaced: true,
  state: new RewardedActivityState(),
  getters: {
    /**
     * @param state
     * @returns {function(string): RewardedActivity | null}
     */
    get: (state) => (rewardedActivityId) => {
      if (!state.rewardedActivities.has(rewardedActivityId)) {
        return null;
      }

      return state.rewardedActivities.get(rewardedActivityId);
    },
    getByCampaign: (state) => (campaignId) => {
      const rewardedActivities = [];

      state.rewardedActivities.forEach((rewardedActivity) => {
        if (rewardedActivity.campaign === campaignId) {
          rewardedActivities.push(rewardedActivity);
        }
      });

      return rewardedActivities;
    },
  },
  mutations: {
    /**
     * @param {RewardedActivityState} state
     * @param {RewardedActivity} rewardedActivity
     */
    setRewardedActivity(state, rewardedActivity) {
      state.rewardedActivities.set(rewardedActivity.id, rewardedActivity);
    },
    /**
     * @param {RewardedActivityState} state
     * @param {string} rewardedActivityId
     */
    removeRewardedActivity(state, rewardedActivityId) {
      state.rewardedActivities.delete(rewardedActivityId);
    },
  },
};
