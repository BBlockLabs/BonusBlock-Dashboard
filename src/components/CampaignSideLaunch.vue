<template>
  <el-row justify="space-between" class="mt-4 mb-3">
    <el-col :span="-1">
      <h1 class="m-0">Launch Campaign</h1>
    </el-col>
    <el-col :span="-1">
      <h3 class="m-0">7,500.00 $UNI</h3>
    </el-col>
  </el-row>

  <el-card class="mt-3 mb-4">
    <el-row justify="space-between">
      <el-col :span="-1">Reward Amount</el-col>
      <el-col :span="-1">{{ campaign.rewardPoolTokenCount }}</el-col>
    </el-row>

    <el-row justify="space-between">
      <el-col :span="-1">Gas Fees</el-col>
      <el-col :span="-1"></el-col>
    </el-row>

    <el-row justify="space-between">
      <el-col :span="-1">Commission Fees</el-col>
      <el-col :span="-1"></el-col>
    </el-row>

    <el-row justify="space-between">
      <el-col :span="-1">Total</el-col>
      <el-col :span="-1"></el-col>
    </el-row>
  </el-card>

  <el-row
    v-if="campaign.status === 'DRAFT' || campaign.status === 'CANCELLED'"
    v-loading="loading"
    class="mt-4"
    justify="center"
  >
    <el-col :span="-1">
      <el-button type="primary" @click="setStatus('CONFIRMED')">
        Pay & Launch Campaign
      </el-button>
    </el-col>
  </el-row>

  <payment-component
    v-if="campaign.status === 'CONFIRMED' && payments.length > 0"
    class="mt-4"
    :payment-id="payments[0].id"
  />

  <h3>Announcement Preview</h3>

  <announcement-preview
    v-for="announcement in announcements"
    :key="announcement.id"
    :announcement-id="announcement.id"
  />
</template>

<script>
import Campaign from "@/state/models/Campaign.js";
import AnnouncementPreview from "@/components/AnnouncementPreview.vue";
import PaymentComponent from "@/components/PaymentComponent.vue";

export default {
  components: {
    AnnouncementPreview,
    PaymentComponent,
  },
  props: {
    campaignId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    payments() {
      return this.$store.getters["Payment/getByCampaign"](this.campaignId);
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
  },
  methods: {
    /**
     * @param {"CONFIRMED"} status
     * @returns {Promise<void>}
     */
    async setStatus(status) {
      this.loading = true;

      try {
        const response = await this.$store.dispatch("Campaign/changeStatus", {
          campaignId: this.campaign.id,
          status,
        });

        if (!response.success) {
          console.error(response.errors);
        }
      } catch (e) {
        console.error(e);
      }

      this.loading = false;
    },
  },
};
</script>
