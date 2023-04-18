<template>
  {{ computed }}
  <el-row v-for="[key, value] in data" :key="key" justify="space-between">
    <el-col :span="-1">
      <b>{{ key }}</b>
    </el-col>

    <el-col :span="-1">
      {{ value }}
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    campaignId: {
      type: String,
      required: true,
    },
  },
  computed: {
    campaign() {
      return this.$store.getters["Campaign/getCampaign"](this.campaignId);
    },
    data() {
      return [
        ["Campaign Name", ""],
        ["Categories", ""],
        ["Network", ""],
        ["Product", ""],
        ["Reward Pool and total amount", ""],
        ["Reward Ratio", ""],
        ["Period", ""],
      ];
    },
  },
};
</script>
