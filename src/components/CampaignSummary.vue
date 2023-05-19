<template>
  <el-row justify="space-between">
    <el-col :span="-1">
      <h1 class="m-0"><b>Campaign Summary</b></h1>
    </el-col>

    <el-col
      v-if="
        campaignStatus === CampaignStatus.DRAFT
        || campaignStatus === CampaignStatus.CANCELLED
      "
      :span="-1"
    >
      <el-button round @click="deleteCampaign"> Delete </el-button>

      <el-button type="primary" round @click="saveToDraft">
        Save as Draft
      </el-button>
    </el-col>
  </el-row>

  <box-wrapper class="my-3">
    <el-row justify="space-between" class="pt-2 pb-1">
      <el-col :span="-1"><b>Campaign Name</b></el-col>
      <el-col :span="-1">{{ campaign.name }}</el-col>
    </el-row>

    <el-row
      v-if="categories.length > 0"
      justify="space-between"
      class="pt-2 pb-1"
    >
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
          @click="
            $store.commit(
              'RewardedActivity/removeRewardedActivity',
              rewardedActivity.id
            )
          "
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
import {toRaw} from "vue";
import CampaignStatus from "@/common/CampaignStatus.js";

export default {
  components: {
    BoxWrapper,
    DeleteButton,
  },
  mixins: [Toast],
  props: {
    campaignId: {
      type: String,
      required: true,
    },
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
    categories() {
      return this.campaign.categories.map(
        this.$store.getters["Category/getCategory"]
      );
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
    async saveToDraft() {
      const response = await this.$store.dispatch(
        "Campaign/storeCampaign",
        this.campaign.id
      );

      if (!response.success) {
        this.Toast("Failed to save campaign", "", "error");
        console.error(response.errors);

        return false;
      }

      return true;
    },
    async deleteCampaign() {
      const response = await this.$store.dispatch("Campaign/changeStatus", {
        campaignId: this.campaign.id,
        status: "DELETED",
      });

      if (!response.success) {
        this.Toast("Failed to delete campaign", "", "error");
        console.error(response.errors);

        return false;
      }

      this.$router.push("/campaign");

      return true;
    },
  },
};
</script>
