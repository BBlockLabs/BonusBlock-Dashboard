<template>
  <box-wrapper>
    <el-row class="flex-nowrap" align="middle">
      <h3
        class="m-0 mr-1 mw-0 of-hidden text-nowrap"
        :title="campaign.name"
      >
        {{ campaign.name }}
      </h3>

      <el-tag
        round
        class="mr-auto"
        :type="status.getTagClass()"
      >
        <strong>{{ status.getLabel() }}</strong>
      </el-tag>

      <delete-button
        v-if="status === CampaignStatus.DRAFT"
        class="ml-2"
        @click="deleteCampaign(campaign.id)"
      />

      <router-link
        class="ml-2"
        :to="status === CampaignStatus.DRAFT ? `/campaign/${campaign.id}/edit` : `/campaign/${campaign.id}/analytics`"
      >
        <el-button type="primary">
          {{ status === CampaignStatus.DRAFT ? "Edit" : "View" }}
        </el-button>
      </router-link>
    </el-row>

    <el-row>
      <el-col>
        <b>Product: {{ product?.name || "-" }}</b>
      </el-col>
    </el-row>

    <el-row>
      <el-col>
        <b>Categories:</b>

        <el-tag v-for="tag in campaign.tags" :key="tag" class="mx-1">
          {{ tag }}
        </el-tag>

        <span v-if="campaign.tags.length === 0">-</span>
      </el-col>
    </el-row>

    <el-row :gutter="12">
      <el-col
        v-for="(block, idx) in blocks"
        :key="idx"
        :xs="24"
        :md="12"
        class="py-2"
      >
        <box-wrapper type="darker" class="info-box">
          <el-row justify="space-between">
            <el-col :span="-1"
              ><b>{{ block.left }}</b></el-col
            >
            <el-col :span="-1"> {{ block.right }} </el-col>
          </el-row>

          <el-row justify="end">
            <el-col :span="-1">
              <h1 class="w-100 of-hidden">{{ block.bottom }}</h1>
            </el-col>
          </el-row>
        </box-wrapper>
      </el-col>
    </el-row>
  </box-wrapper>
</template>

<script>
import Campaign from "@/state/models/Campaign.js";
import moment from "moment";
import BoxWrapper from "@/components/BoxWrapper.vue";
import { Formatter } from "@/common/Formatter.js";
import CampaignStatus from "../common/CampaignStatus.js";
import { toRaw } from "vue";
import DeleteButton from "@/components/DeleteButton.vue";
import MessageBox from "@/mixins/MessageBox.js";

export default {
  components: {
    DeleteButton,
    BoxWrapper,
  },
  mixins: [MessageBox],
  props: {
    campaignId: {
      type: String,
      required: true,
      default: "",
    },
  },
  computed: {
    status() {
      return toRaw(this.campaign.status);
    },
    CampaignStatus() {
      return CampaignStatus;
    },
    now() {
      return moment();
    },
    blocks() {
      const timeLeft = moment(this.campaign.timeFrameTill).diff(
        moment(),
        "days"
      );

      return [
        {
          left: "Time Left",
          right: "days",
          bottom: timeLeft < 0 ? "Ended" : timeLeft,
        },
        {
          left: "Reward pool",
          right: "size",
          bottom: this.contract
            ? Formatter.token(
                this.campaign.rewardPoolTokenCount,
                this.contract,
                2
              )
            : "-",
        },
        {
          left: "Users",
          right: "monthly",
          bottom: "-",
        },
        {
          left: "ROI",
          right: "per user",
          bottom: this.campaign.expectedReturnOfInvestment,
        },
      ];
    },
    campaign() {
      const campaign = this.$store.getters["Campaign/getCampaign"](
        this.campaignId
      );

      return campaign || new Campaign();
    },
    contract() {
      return this.$store.getters["Contract/getContract"](
        this.campaign.rewardPoolContract
      );
    },
    product() {
      return this.$store.getters["Product/getProduct"](this.campaign.product);
    },
  },
  methods: {
    async deleteCampaign(campaignId) {
      if (
        await this.MessageBoxConfirm(
          'Are you sure you want to mark this campaign as "Deleted"?',
          {}
        )
      ) {
        const response = await this.$store.dispatch("Campaign/changeStatus", {
          campaignId: campaignId,
          status: CampaignStatus.DELETED,
        });

        if (!response.success) {
          this.Toast("Failed to delete campaign", "", "error");
          console.error(response.errors);

          return false;
        }

        this.$router.push("/campaign");

        return true;
      }
    },
  },
};
</script>

<style lang="scss">
.info-box {
  height: 6.429em;

  @media only screen and (max-width: 991px) {
    height: 4em;

    h1 {
      margin-top: 0.5em;
      margin-bottom: 0.5em;
    }
  }
}
</style>
