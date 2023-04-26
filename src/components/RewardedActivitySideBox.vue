<template>
  <el-row justify="space-between">
    <el-col :span="-1">
      <h3 class="m-0">
        <b>{{ action.name }}</b>
      </h3>
    </el-col>
    <el-col :span="-1">
      <h3 class="m-0">{{ activity.name }}</h3>
    </el-col>
  </el-row>

  <el-row justify="space-between">
    <el-col :span="-1"> Minimum transaction limit </el-col>
    <el-col :span="-1">
      {{ rewardedActivity.minimumTransactionLimit }}
    </el-col>
  </el-row>

  <el-row justify="space-between">
    <el-col :span="-1"> Additional reward transaction limit </el-col>
    <el-col :span="-1">
      {{ rewardedActivity.additionalRewardTransactionLimit }}
    </el-col>
  </el-row>

  <el-row justify="space-between">
    <el-col :span="-1"> Minimum transaction amount </el-col>
    <el-col :span="-1">
      {{ rewardedActivity.minimumTransactionCount }}
    </el-col>
  </el-row>

  <el-row justify="space-between">
    <el-col :span="-1"> Additional reward transaction amount </el-col>
    <el-col :span="-1">
      {{ rewardedActivity.additionalRewardTransactionCount }}
    </el-col>
  </el-row>

  <el-row justify="end">
    <el-col :span="-1">
      <delete-button
        @click="
          $store.commit(
            'RewardedActivity/removeRewardedActivity',
            rewardedActivity.id
          )
        "
      />
    </el-col>
  </el-row>

  <debug-wrapper>
    {{ rewardedActivity }}
  </debug-wrapper>
</template>

<script>
import Action from "@/state/models/Action.js";
import Activity from "@/state/models/Activity.js";
import DebugWrapper from "@/components/DebugWrapper.vue";
import DeleteButton from "@/components/DeleteButton.vue";

export default {
  components: {
    DebugWrapper,
    DeleteButton,
  },
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
        this.$store.getters["Activity/getAction"](
          this.rewardedActivity.action
        ) || new Action()
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
