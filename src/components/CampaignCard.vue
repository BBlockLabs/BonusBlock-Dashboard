<template>
  <box-wrapper>
    <el-row justify="space-between">
      <el-col :span="-1">
        <h2 class="m-0">{{ campaign.name }}</h2>
      </el-col>

      <el-col :span="-1">
        <el-tag
          class="mr-1"
          :type="status === CampaignStatus.DELETED ? 'danger' : ''"
        >
          {{ status.getLabel() }}
        </el-tag>

        <router-link :to="`/campaign/${campaign.id}/edit`">
          <el-button type="primary">
            {{ status === CampaignStatus.DRAFT ? "Edit" : "View" }}
          </el-button>
        </router-link>
      </el-col>
    </el-row>

    <el-row>
      <el-col>
        <b>Product: {{ product?.name || "-" }}</b>
      </el-col>
    </el-row>

    <el-row>
      <el-col>
        <b>Categories:</b>

        <el-tag v-for="category in categories" :key="category" class="mx-1">
          {{ category.name }}
        </el-tag>

        <span v-if="categories.length === 0">-</span>
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

export default {
  components: {
    BoxWrapper,
  },
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
    blocks() {
      return [
        {
          left: "Time Left",
          right: "days",
          bottom: moment(this.campaign.timeFrameTill).diff(moment(), "days"),
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
    categories() {
      return this.campaign.categories.map(
        this.$store.getters["Category/getCategory"]
      );
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
};
</script>

<style lang="scss">
.info-box {
  height: 6.429em;
}
</style>
