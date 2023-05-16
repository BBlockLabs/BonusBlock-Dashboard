<template>
  <div class="d-flex flex-column h-100">
    <el-row justify="space-between" class="my-3">
      <el-col :span="-1">
        <h1 class="m-0">Launch Campaign</h1>
      </el-col>
      <el-col :span="-1">
        <h3 class="m-0">
          {{ Formatter.token(campaign.rewardPoolTokenCount, contract, 2) }}
        </h3>
      </el-col>
    </el-row>

    <box-wrapper class="my-3">
      <el-row justify="space-between" class="pt-1 pb-1">
        <el-col :span="-1">Reward Amount</el-col>
        <el-col :span="-1">
          {{ Formatter.token(paymentPreview?.baseAmount || 0, contract, 2) }}
        </el-col>
      </el-row>

      <el-row justify="space-between" class="pt-1 pb-1">
        <el-col :span="-1">Gas Fees</el-col>
        <el-col :span="-1">
          {{ Formatter.token(paymentPreview?.gasFee || 0, contract, 2) }}
        </el-col>
      </el-row>

      <el-row justify="space-between" class="pt-1 pb-1">
        <el-col :span="-1">Commission Fees</el-col>
        <el-col :span="-1">
          {{ Formatter.token(paymentPreview?.commissionFee || 0, contract, 2) }}
        </el-col>
      </el-row>

      <el-row justify="space-between" class="pt-1 pb-1">
        <el-col :span="-1"><b>Total</b></el-col>
        <el-col :span="-1">
          <b>
            {{ Formatter.token(paymentPreview?.totalAmount || 0, contract, 2) }}
          </b>
        </el-col>
      </el-row>
    </box-wrapper>

    <el-row
      v-if="campaign.status === 'DRAFT' || campaign.status === 'CANCELLED'"
      v-loading="loading"
      class="mt-4 mb-4"
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
      :campaign-id="campaignId"
      :payment-id="payments[0].id"
      @payment-success="onPayment"
    />

    <h3 class="mt-auto">Announcement Preview</h3>

    <div>
      <announcement-preview
        v-for="announcement in announcements"
        :key="announcement.id"
        class="my-3"
        :announcement-id="announcement.id"
      />
    </div>
  </div>
</template>

<script>
import Campaign from "@/state/models/Campaign.js";
import AnnouncementPreview from "@/components/AnnouncementPreview.vue";
import PaymentComponent from "@/components/PaymentComponent.vue";
import BoxWrapper from "@/components/BoxWrapper.vue";
import { Formatter } from "@/common/Formatter.js";
import Toast from "@/mixins/Toast.js";

export default {
  components: {
    AnnouncementPreview,
    PaymentComponent,
    BoxWrapper,
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
    Formatter: () => Formatter,
    paymentPreview() {
      return this.$store.getters["PaymentPreview/getPaymentPreview"](
        this.campaignId
      );
    },
    contract() {
      return this.$store.getters["Contract/getContract"](
        this.campaign.rewardPoolContract
      );
    },
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
  created() {
    this.$store.dispatch(
      "PaymentPreview/loadCampaignPaymentPreview",
      this.campaignId
    );
  },
  methods: {
    onPayment() {
      Toast.methods.Toast("Payment successful", "", "success");

      this.$router.push("/campaign");
    },
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
