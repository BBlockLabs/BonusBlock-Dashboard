<template>
  <box-wrapper>
    <el-row justify="space-between">
      <el-col :span="-1">
        <h2 class="m-0">{{ campaign.name }}</h2>
      </el-col>

      <el-col :span="-1">
        <el-tag>
          {{ campaign.status }}
        </el-tag>

        <router-link :to="`/campaign/${campaign.id}/edit`">
          <el-button type="primary" round>
            {{ campaign.status === "DRAFT" ? "Edit" : "View" }}
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

        <el-tag v-for="category in categories" :key="category">
          {{ category.name }}
        </el-tag>
      </el-col>
    </el-row>

    <el-row :gutter="12">
      <el-col :xs="24" :md="12" :lg="6" class="py-2">
        <box-wrapper type="darker" class="info-box">
          <el-row justify="space-between">
            <el-col :span="-1"><b>Time Left</b></el-col>
            <el-col :span="-1"> days </el-col>
          </el-row>

          <el-row justify="end">
            <el-col :span="-1">
              {{ moment(campaign.timeFrameTill).diff(moment(), "days") }}
            </el-col>
          </el-row>
        </box-wrapper>
      </el-col>

      <el-col :xs="24" :md="12" :lg="6" class="py-2">
        <box-wrapper type="darker" class="info-box">
          <el-row justify="space-between">
            <el-col :span="-1"><b>Reward pool</b></el-col>
            <el-col :span="-1">size</el-col>
          </el-row>

          <el-row justify="end">
            <el-col :span="-1">
              {{ campaign.rewardPoolTokenCount }}
              {{ contract?.address || "-" }}
            </el-col>
          </el-row>
        </box-wrapper>
      </el-col>

      <el-col :xs="24" :md="12" :lg="6" class="py-2">
        <box-wrapper type="darker" class="info-box">
          <el-row justify="space-between">
            <el-col :span="-1"><b>Users</b></el-col>
            <el-col :span="-1">monthly</el-col>
          </el-row>

          <el-row justify="end">
            <el-col :span="-1"> - </el-col>
          </el-row>
        </box-wrapper>
      </el-col>

      <el-col :xs="24" :md="12" :lg="6" class="py-2">
        <box-wrapper type="darker" class="info-box">
          <el-row justify="space-between">
            <el-col :span="-1"><b>ROI</b></el-col>
            <el-col :span="-1">per user</el-col>
          </el-row>

          <el-row justify="end">
            <el-col :span="-1">
              {{ campaign.expectedReturnOfInvestment }}
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
    moment: () => moment,
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
