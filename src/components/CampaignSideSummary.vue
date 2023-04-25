<template>
  <div class="bg-fill-lighter py-3 px-4 br-base">
    <h3 class="m-0">{{ campaign.name || "Unnamed campaign" }}</h3>
    {{ announcements.length }} announcements
  </div>

  <div v-if="announcements.length > 0" class="my-3">
    <h3 class="m-0"><b>Announcement Preview</b></h3>

    <announcement-preview
      v-for="announcement in announcements"
      :key="announcement.id"
      class="mt-3"
      :announcement-id="announcement.id"
    />
  </div>

  <div
    v-if="categories.length > 0 || network || product"
    class="bg-fill-lighter p-3 my-3 br-base"
  >
    <el-row v-if="categories.length > 0" justify="space-between">
      <el-col :span="-1">
        <b>Categories</b>
      </el-col>

      <el-col :span="-1">
        <el-tag
          v-for="category in categories"
          :key="category.id"
          class="mx-1"
          round
        >
          {{ category.name }}
        </el-tag>
      </el-col>
    </el-row>

    <el-row v-if="network" justify="space-between">
      <el-col :span="-1">
        <b>Network</b>
      </el-col>

      <el-col :span="-1">
        {{ network.name || "-" }}
      </el-col>
    </el-row>

    <el-row v-if="product" justify="space-between">
      <el-col :span="-1">
        <b>Product</b>
      </el-col>

      <el-col :span="-1">
        {{ product.name || "-" }}
      </el-col>
    </el-row>
  </div>

  <div v-if="rewardedActivities.length > 0">
    <h3><b>Activities</b></h3>

    <div
      v-for="rewardedActivity in rewardedActivities"
      :key="rewardedActivity.id"
      class="bg-fill-lighter p-3 br-base my-3"
    >
      <rewarded-activity-side-box :rewarded-activity-id="rewardedActivity.id" />
    </div>
  </div>
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
