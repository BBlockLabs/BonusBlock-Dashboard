<template>
  <el-row v-if="advanced" justify="space-between">
    <el-col :span="-1">
      <h3 v-if="action" class="m-0">
        <b>{{ Formatter.splitWordByCase(action.name) }}</b>
      </h3>
    </el-col>
    <el-col :span="-1">
      <h3 v-if="activity" class="m-0">
        {{ activity.name }}
      </h3>
    </el-col>
  </el-row>

  <el-row v-else justify="space-between">
    <el-col :span="-1">
      <h3 v-if="activity" class="m-0">
        <b>
          {{ activity.type.getAction().getLabel() }} /
          {{ activity.type.getLabel() }}
        </b>
      </h3>
    </el-col>
    <el-col :span="-1">
      <h3 v-if="activity" class="m-0">
        {{ activity.name }}
      </h3>
    </el-col>
  </el-row>

  <el-row v-if="rewardedActivity?.minimumTransactionLimit" justify="space-between">
    <el-col :span="-1"> Minimum transaction amount </el-col>
    <el-col :span="-1">
      {{
        Formatter.token(
          rewardedActivity.minimumTransactionLimit,
          $store.getters["Contract/getContract"]("USD"),
          2
        )
      }}
    </el-col>
  </el-row>

  <el-row v-if="rewardedActivity?.minimumTransactionCount" justify="space-between">
    <el-col :span="-1"> Minimum transaction limit </el-col>
    <el-col :span="-1">
      {{ rewardedActivity.minimumTransactionCount }}
    </el-col>
  </el-row>

  <debug-wrapper>
    {{ rewardedActivity }}
  </debug-wrapper>
</template>

<script>
import DebugWrapper from "@/components/DebugWrapper.vue";
import { Formatter } from "../common/Formatter.js";

export default {
  components: {
    DebugWrapper,
  },
  props: {
    rewardedActivityId: {
      type: String,
      required: true,
    },
  },
  computed: {
    advanced() {
      return !!this.action;
    },
    Formatter() {
      return Formatter;
    },
    activity() {
      return this.rewardedActivity
        ? this.$store.getters["Activity/getActivity"](this.rewardedActivity.activity)
        : null;
    },
    action() {
      return this.rewardedActivity
        ? this.$store.getters["Activity/getAction"](this.rewardedActivity.action)
        : null;
    },
    rewardedActivity() {
      return this.$store.getters["RewardedActivity/get"](this.rewardedActivityId);
    },
  },
};
</script>
