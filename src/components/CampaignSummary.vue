<template>
  <el-row justify="space-between">
    <el-col :span="-1">
      <h1 class="m-0"><b>Campaign Summary</b></h1>
    </el-col>

    <el-col :span="-1">
      <el-button
        v-if="campaignStatus === CampaignStatus.DRAFT"
        round
        @click="deleteCampaign"
      >
        Delete
      </el-button>

      <el-button
        v-if="campaignStatus !== CampaignStatus.DRAFT"
        v-loading="copyLoading"
        type="primary"
        round
        @click="saveToDraft"
      >
        Copy as Draft
      </el-button>
    </el-col>
  </el-row>

  <box-wrapper class="my-3">
    <el-row justify="space-between" class="pt-2 pb-1">
      <el-col :span="-1"><b>Campaign Name</b></el-col>
      <el-col :span="-1">{{ campaign.name }}</el-col>
    </el-row>

    <el-row
      v-if="campaign.tags.length > 0"
      justify="space-between"
      class="pt-2 pb-1"
    >
      <el-col :span="-1">
        <b>Categories</b>
      </el-col>

      <el-col :span="-1">
        <el-tag v-for="tag in campaign.tags" :key="tag" class="mx-1" round>
          {{ tag }}
        </el-tag>
      </el-col>
    </el-row>

    <el-row v-if="network" justify="space-between" class="pt-2 pb-1">
      <el-col :span="-1"><b>Network</b></el-col>
      <el-col :span="-1">{{ network.name || "-" }}</el-col>
    </el-row>

    <el-row v-if="product" justify="space-between" class="pt-2 pb-1">
      <el-col :span="-1"><b>Product</b></el-col>
      <el-col :span="-1">{{ product.name || "-" }}</el-col>
    </el-row>
  </box-wrapper>

  <box-wrapper class="my-3">
    <el-row justify="space-between" class="pt-2 pb-1">
      <el-col :span="-1"><b>Reward Pool and total amount</b></el-col>
      <el-col :span="-1">
        <b>{{ Formatter.token(campaign.rewardPoolTokenCount, contract, 2) }}</b>
      </el-col>
    </el-row>

    <el-row justify="space-between" class="pt-2 pb-1">
      <el-col :span="-1"><b>Reward Ratio</b></el-col>
      <el-col :span="-1">
        {{ mostRewardedInteraction }} interaction will give the most rewards.
      </el-col>
    </el-row>
  </box-wrapper>

  <box-wrapper class="my-3">
    <el-row justify="space-between" class="pt-2 pb-1">
      <el-col :span="-1"><b>Period</b></el-col>
      <el-col :span="-1">
        Your campaign will start on
        {{
          moment(campaign.timeFrameFrom).format("MMM D, YYYY [at] HH:mm [UTC]")
        }}
        and will end on
        {{
          moment(campaign.timeFrameTill).format("MMM D, YYYY [at] HH:mm [UTC]")
        }}
      </el-col>
    </el-row>

    <el-row justify="space-between" class="pt-2 pb-1">
      <el-col :span="-1"><b>Total Duration</b></el-col>
      <el-col :span="-1">
        {{
          moment(campaign.timeFrameTill).diff(campaign.timeFrameFrom, "days")
        }}
        days.
      </el-col>
    </el-row>
  </box-wrapper>

  <h3>Activities</h3>

  <box-wrapper class="my-3">
    <el-row
      v-for="rewardedActivity in rewardedActivities"
      :key="rewardedActivity.id"
      justify="space-between"
      class="pt-2 pb-1"
    >
      <el-col :span="-1">
        <b>
          Interact with "{{ rewardedActivity.activity }}" pool, minimum
          transaction amount is {{ rewardedActivity.minimumTransactionLimit }}.
        </b>
      </el-col>

      <el-col :span="-1">
        <delete-button
          v-if="campaignStatus === CampaignStatus.DRAFT"
          @click="confirmActivityDeletion(rewardedActivity.id)"
        />
      </el-col>
    </el-row>
  </box-wrapper>
</template>

<script>
import BoxWrapper from "@/components/BoxWrapper.vue";
import Campaign from "@/state/models/Campaign.js";
import DeleteButton from "@/components/DeleteButton.vue";
import Toast from "@/mixins/Toast.js";
import moment from "moment";
import { Formatter } from "@/common/Formatter.js";
import { toRaw } from "vue";
import CampaignStatus from "@/common/CampaignStatus.js";
import MessageBox from "@/mixins/MessageBox.js";

export default {
  components: {
    BoxWrapper,
    DeleteButton,
  },
  mixins: [Toast, MessageBox],
  props: {
    campaignId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      copyLoading: false,
    };
  },
  computed: {
    CampaignStatus() {
      return CampaignStatus;
    },
    Formatter: () => Formatter,
    moment: () => moment,
    mostRewardedInteraction() {
      if (
        this.campaign.frequencyRatioDaily > this.campaign.frequencyRatioWeekly
      ) {
        return "Daily";
      } else {
        return "Weekly";
      }
    },
    contract() {
      return this.$store.getters["Contract/getContract"](
        this.campaign.rewardPoolContract
      );
    },
    product() {
      return this.$store.getters["Product/getProduct"](this.campaign.product);
    },
    network() {
      return this.$store.getters["Network/getNetwork"](this.campaign.network);
    },
    campaign() {
      const campaign = this.$store.getters["Campaign/getCampaign"](
        this.campaignId
      );

      return campaign || new Campaign();
    },
    campaignStatus() {
      return toRaw(this.campaign.status);
    },
    rewardedActivities() {
      return this.$store.getters["RewardedActivity/getByCampaign"](
        this.campaignId
      );
    },
  },
  methods: {
    async confirmActivityDeletion(id) {
      if (
        await this.MessageBoxConfirm(
          "Are you sure you want to delete this activity?",
          {}
        )
      ) {
        this.$store.commit("RewardedActivity/removeRewardedActivity", id);
      }
    },
    async saveToDraft() {
      if (this.copyLoading) {
        return;
      }

      this.copyLoading = true;

      const response = await this.$store.dispatch(
        "Campaign/copyCampaign",
        this.campaign.id
      );

      if (!response.success) {
        this.Toast("Failed to save campaign", "", "error", 1500);
        console.error("Failed to save campaign", response.errors);
        this.copyLoading = false;

        return;
      }

      this.Toast("Campaign copied", null, "success");

      this.$router.push(`/campaign/${response.data}/edit`);

      this.copyLoading = false;
    },
    async deleteCampaign() {
      const response = await this.$store.dispatch("Campaign/changeStatus", {
        campaignId: this.campaign.id,
        status: CampaignStatus.DELETED,
      });

      if (!response.success) {
        this.Toast("Failed to delete campaign", "", "error");
        console.error("Failed to delete campaign", response.errors);

        return false;
      }

      return true;
    },
  },
};
</script>
