<template>
  <el-row justify="space-between">
    <el-col :span="-1">
      <b>Campaign Name</b>
    </el-col>

    <el-col :span="-1">
      {{ campaign.name }}
    </el-col>
  </el-row>

  <el-row justify="space-between">
    <el-col :span="-1">
      <b>Categories</b>
    </el-col>

    <el-col :span="-1">
      {{ campaign.categories }}
    </el-col>
  </el-row>

  <el-row justify="space-between">
    <el-col :span="-1">
      <b>Network</b>
    </el-col>

    <el-col :span="-1">
      {{ campaign.network }}
    </el-col>
  </el-row>

  <el-row justify="space-between">
    <el-col :span="-1">
      <b>Product</b>
    </el-col>

    <el-col :span="-1">
      {{ campaign.product }}
    </el-col>
  </el-row>

  <el-row justify="space-between">
    <el-col :span="-1">
      <b>Reward Pool and total amount</b>
    </el-col>

    <el-col :span="-1">
      {{ campaign.product }}
    </el-col>
  </el-row>

  <el-row justify="space-between">
    <el-col :span="-1">
      <b>Reward Ratio</b>
    </el-col>

    <el-col :span="-1">
      {{ campaign.product }}
    </el-col>
  </el-row>

  <el-row justify="space-between">
    <el-col :span="-1">
      <b>Period</b>
    </el-col>

    <el-col :span="-1">
      {{ campaign.product }}
    </el-col>
  </el-row>

  <el-row justify="space-between">
    <el-col :span="-1">
      <b>Total Duration</b>
    </el-col>

    <el-col :span="-1">
      {{ campaign.product }}
    </el-col>
  </el-row>

  <h3>Activities</h3>

  <el-row
    v-for="rewardedActivity in rewardedActivities"
    :key="rewardedActivity.id"
  >
    <el-col>
      Interact with "{{ rewardedActivity.activity }}" pool, minimum transaction
      amount is $10.00.
    </el-col>
  </el-row>
</template>

<script>
import Campaign from "@/state/models/Campaign.js";

export default {
  props: {
    campaignId: {
      type: String,
      required: true,
    },
  },
  computed: {
    campaign() {
      const campaign = this.$store.getters["Campaign/getCampaign"](
        this.campaignId
      );

      return campaign || new Campaign();
    },
    rewardedActivities() {
      return this.$store.getters["RewardedActivity/getByCampaign"](
        this.campaignId
      );
    },
  },
};
</script>
