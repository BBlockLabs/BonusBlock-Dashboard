<template>
  <el-row>
    <el-col>
      <h3>{{ action.name }} {{ activity.name }}</h3>
      Minimum transaction limit {{ rewardedActivity.minimumTransactionLimit }}
      <el-button
        type="danger"
        @click="
          $store.commit(
            'RewardedActivity/removeRewardedActivity',
            rewardedActivity.id
          )
        "
      >
        remove
      </el-button>
    </el-col>
  </el-row>
</template>

<script>
import Action from "@/state/models/Action.js";
import Activity from "@/state/models/Activity.js";

export default {
  props: {
    rewardedActivityId: {
      type: String,
      required: true,
    },
  },
  computed: {
    activity() {
      return (
        this.$store.getters["Activity/getActivity"](
          this.rewardedActivity.activity
        ) || new Activity()
      );
    },
    action() {
      return (
        this.activity.actions.find((action) => {
          return action.id === this.rewardedActivity.action;
        }) || new Action()
      );
    },
    rewardedActivity() {
      return this.$store.getters["RewardedActivity/get"](
        this.rewardedActivityId
      );
    },
  },
};
</script>
