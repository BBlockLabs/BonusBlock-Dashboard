<template>
  <el-row justify="space-between">
    <el-col :span="-1">
      <h3 v-if="action.name" class="m-0">
        <b>{{ Formatter.splitWordByCase(action.name) }}</b>
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
    <el-col :span="-1"> Minimum transaction amount </el-col>
    <el-col :span="-1">
      {{ rewardedActivity.minimumTransactionCount }}
    </el-col>
  </el-row>

  <el-row justify="end">
    <el-col :span="-1">
      <delete-button @click="removeRewardedActivity" />
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
import { Formatter } from "../common/Formatter.js";

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
    Formatter() {
      return Formatter;
    },
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
  methods: {
    removeRewardedActivity() {
      this.$store.commit("Campaign/setDirty", true);
      this.$store.commit(
        "RewardedActivity/removeRewardedActivity",
        this.rewardedActivity.id
      );
    },
  },
};
</script>
