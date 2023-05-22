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
        <el-tag
          v-if="
            status === CampaignStatus.PAID &&
            now.isAfter(campaign.timeFrameFrom) &&
            now.isBefore(campaign.timeFrameTill)
          "
          class="mr-1"
          type="success"
        >
          <strong>ACTIVE</strong>
        </el-tag>
        <el-tag
          v-if="
            status === CampaignStatus.PAID &&
            now.isAfter(campaign.timeFrameTill)
          "
          class="mr-1"
          type="success"
        >
          <strong>FINISHED</strong>
        </el-tag>

        <delete-button
          v-if="status === CampaignStatus.DRAFT"
          class="mr-2"
          @click="deleteCampaign(campaign.id)"
        />
        <router-link
          :to="
            status === CampaignStatus.PAID ||
            status === CampaignStatus.RUNNING ||
            status === CampaignStatus.ENDED
              ? `/campaign/${campaign.id}/analytics`
              : `/campaign/${campaign.id}/edit`
          "
        >
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
}
</style>
