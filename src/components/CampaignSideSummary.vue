<template>
  <el-row>
    <el-col>
      <h3>{{ campaign.name || "Unnamed campaign" }}</h3>
      {{ announcements.length }} announcements
    </el-col>
  </el-row>

  <h3>Announcement Preview</h3>

  <announcement-preview
    v-for="announcement in announcements"
    :key="announcement.id"
    :announcement-id="announcement.id"
  />

  <el-row justify="space-between">
    <el-col :span="-1">
      <b>Categories</b>
    </el-col>

    <el-col :span="-1">
      <el-tag v-for="category in categories" :key="category.id" class="mx-1">
        {{ category.name }}
      </el-tag>
    </el-col>
  </el-row>

  <el-row justify="space-between">
    <el-col :span="-1">
      <b>Network</b>
    </el-col>

    <el-col :span="-1">
      {{ network?.name || "-" }}
    </el-col>
  </el-row>

  <el-row justify="space-between">
    <el-col :span="-1">
      <b>Product</b>
    </el-col>

    <el-col :span="-1">
      {{ product?.name || "-" }}
    </el-col>
  </el-row>

  <h3>Activities</h3>

  <rewarded-activity-side-box
    v-for="rewardedActivity in rewardedActivities"
    :key="rewardedActivity.id"
    :rewarded-activity-id="rewardedActivity.id"
  />
</template>

<script>
import Campaign from "@/state/models/Campaign.js";
import FileParser from "@/common/FileParser.js";
import AnnouncementPreview from "@/components/AnnouncementPreview.vue";
import RewardedActivitySideBox from "@/components/RewardedActivitySideBox.vue";

export default {
  components: {
    RewardedActivitySideBox,
    AnnouncementPreview,
  },
  props: {
    campaignId: {
      type: String,
      required: true,
    },
  },
  computed: {
    product() {
      return this.$store.getters["Product/getProduct"](this.campaign.product);
    },
    network() {
      return this.$store.getters["Network/getNetwork"](this.campaign.network);
    },
    categories() {
      return this.campaign.categories.map(
        this.$store.getters["Category/getCategory"]
      );
    },
    FileParser() {
      return FileParser;
    },
    campaign() {
      const campaign = this.$store.getters["Campaign/getCampaign"](
        this.campaignId
      );

      return campaign || new Campaign();
    },
    announcements() {
      return this.$store.getters["Announcement/getByCampaign"](this.campaignId);
    },
    rewardedActivities() {
      return this.$store.getters["RewardedActivity/getByCampaign"](
        this.campaignId
      );
    },
  },
};
</script>
