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

      <router-link
        class="ml-2"
        :to="status === CampaignStatus.DRAFT ? `/campaign/${campaign.id}/edit` : `/campaign/${campaign.id}/analytics`"
      >
        <el-button type="primary">
          {{ status === CampaignStatus.DRAFT ? "Edit" : "View" }}
        </el-button>
      </router-link>

      <el-dropdown trigger="click" class="ml-2">
        <el-button link>
          <svg-ellipsis-v class="icon" />
        </el-button>

        <template #dropdown>
          <el-dropdown-item v-if="status !== CampaignStatus.DRAFT" @click="exportData(campaign.id)">
            <svg-text /> Export data
          </el-dropdown-item>

          <el-dropdown-item @click="copyCampaign(campaign.id)">
            <svg-copy-bolder /> Duplicate
          </el-dropdown-item>

          <el-dropdown-item v-if="status === CampaignStatus.DRAFT" class="text-danger" @click="deleteCampaign(campaign.id)">
            <svg-trash /> Delete
          </el-dropdown-item>
          <el-dropdown-item v-else class="text-danger" @click="cancelCampaign(campaign.id)">
            <svg-trash /> Cancel campaign
          </el-dropdown-item>
        </template>
      </el-dropdown>
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
import Toast from "@/mixins/Toast.js";
import Campaign from "@/state/models/Campaign.js";
import moment from "moment";
import BoxWrapper from "@/components/BoxWrapper.vue";
import { Formatter } from "@/common/Formatter.js";
import CampaignStatus from "../common/CampaignStatus.js";
import { toRaw } from "vue";
import MessageBox from "@/mixins/MessageBox.js";
import SvgEllipsisV from "@/assets/icons/ellipsis-v.svg";
import SvgTrash from "@/assets/icons/trash.svg";
import SvgText from "@/assets/icons/text.svg";
import SvgCopyBolder from "@/assets/icons/copy-bolder.svg";

export default {
  components: {
    BoxWrapper,
    SvgEllipsisV,
    SvgTrash,
    SvgText,
    SvgCopyBolder,
  },
  mixins: [MessageBox, Toast],
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
    exportData(campaignId) {
      this.Toast("Coming soon", "", "info");
    },
    async copyCampaign(campaignId) {
      const response = await this.$store.dispatch(
        "Campaign/copyCampaign",
        campaignId
      );

      if (!response.success) {
        this.Toast("Failed to copy campaign", "", "error");
        console.error("Failed to copy campaign", response.errors);

        return false;
      }

      this.Toast("Campaign copied successfully", null, "success");

      return true;
    },
    async cancelCampaign(campaignId) {
      if (
        !(await this.MessageBoxConfirm(
          "Be aware that the cancellation will not have an immediate impact. You will be required to await the completion of the next set of calculations (which will mark the end of the campaign) before you can retrieve your reward pool.",
          {
            title: "Cancel Campaign",
          }
        ))
      ) {
        return false;
      }
      this.Toast("Coming soon", "", "info");
    },
    async deleteCampaign(campaignId) {
      if (
        !(await this.MessageBoxConfirm(
          "Do you wish to proceed with the deletion of your campaign? Please note that by doing so, all the associated campaign information will be permanently lost.",
          {
            title: "Delete Campaign",
          }
        ))
      ) {
        return false;
      }

      const response = await this.$store.dispatch("Campaign/changeStatus", {
        campaignId: campaignId,
        status: CampaignStatus.DELETED,
      });

      if (!response.success) {
        this.Toast("Failed to delete campaign", "", "error");
        console.error("Failed to delete campaign", response.errors);

        return false;
      }

      this.$router.push("/campaign");
      this.Toast("Campaign deleted successfully", null, "success");

      return true;
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
