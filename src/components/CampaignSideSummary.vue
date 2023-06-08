<template>
  <div>
    <box-wrapper class="px-4">
      <h3 class="m-0 of-hidden">
        {{ campaign.name || temporaryCampaignName || "Unnamed campaign" }}
      </h3>
      {{ announcements.length }} announcements
    </box-wrapper>

    <div v-if="announcements.length > 0" class="my-3">
      <h3 class="m-0"><b>Announcement Preview</b></h3>

      <announcement-preview
        v-for="announcement in announcements"
        :key="announcement.id"
        class="mt-3"
        :announcement-id="announcement.id"
      />
    </div>

    <box-wrapper
      v-if="campaign.tags.length > 0 || network || product"
      class="my-3"
    >
      <el-row v-if="campaign.tags.length > 0" justify="space-between">
        <el-col :span="-1">
          <b>Categories</b>
        </el-col>

        <el-col :span="-1">
          <el-tag v-for="tag in campaign.tags" :key="tag" class="mx-1" round>
            {{ tag }}
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
    </box-wrapper>

    <div v-if="rewardedActivities.length > 0">
      <h3><b>Activities</b></h3>

      <box-wrapper
        v-for="rewardedActivity in rewardedActivities"
        :key="rewardedActivity.id"
        class="my-3"
      >
        <rewarded-activity-side-box :rewarded-activity-id="rewardedActivity.id" />
      </box-wrapper>
    </div>
  </div>
</template>

<script>
import AnnouncementPreview from "@/components/AnnouncementPreview.vue";
import BoxWrapper from "@/components/BoxWrapper.vue";
import Campaign from "@/state/models/Campaign.js";
import FileParser from "@/common/FileParser.js";
import RewardedActivitySideBox from "@/components/RewardedActivitySideBox.vue";

export default {
  components: {
    AnnouncementPreview,
    BoxWrapper,
    RewardedActivitySideBox,
  },
  props: {
    campaignId: {
      type: String,
      required: true,
    },
    temporaryCampaignName: {
      type: String,
      default: null,
      required: false,
    },
  },
  computed: {
    product() {
      return this.$store.getters["Product/getProduct"](this.campaign.product);
    },
    network() {
      return this.$store.getters["Network/getNetwork"](this.campaign.network);
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
