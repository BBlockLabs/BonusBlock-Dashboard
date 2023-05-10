<template>
  <el-container v-loading="loading" class="h-100">
    <el-main>
      <el-row>
        <el-col :span="1">
          <el-button link @click="back">
            <svg-nav-arrow-left class="icon" />
          </el-button>
        </el-col>

        <el-col :span="23">
          <el-steps :active="step - 1" align-center class="mb-5">
            <el-step title="Set campaign" />
            <el-step title="Create activities" />
            <el-step title="Create your announcement" />
            <el-step title="Launch!" />
          </el-steps>
        </el-col>
      </el-row>

      <campaign-set-details
        v-if="step === 1"
        v-model="campaignFormObject"
        :validation="campaignValidation"
        @update:model-value="formChanged"
      />

      <div v-if="step === 2">
        <el-row>
          <el-col>
            <campaign-create-activity
              v-model:campaign="campaignFormObject"
              v-model="rewardedActivityFormObject"
              :validation="rewardedActivityValidation"
            />
          </el-col>

          <el-col class="d-flex">
            <el-button class="ml-auto" round @click="clearRewardedActivity">
              Clear
            </el-button>

            <el-button round type="primary" @click="addRewardedActivity">
              Add activity
            </el-button>
          </el-col>
        </el-row>
      </div>

      <announcement-form
        v-if="step === 3"
        v-model="announcementFormObject"
        :validation="announcementFormValidation"
      />

      <campaign-summary v-if="step === 4" :campaign-id="campaign.id" />
    </el-main>

    <el-aside
      class="bl-solid px-4"
      width="360px"
      style="
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      "
    >
      <campaign-side-summary
        v-if="step !== 4"
        :temporary-campaign-name="temporaryCampaignName"
        :campaign-id="campaign.id"
      />
      <campaign-side-launch v-else :campaign-id="campaign.id" />
      <div>
        <el-button
          v-if="step !== 4"
          type="primary"
          class="mt-3"
          @click="goToNextStep"
        >
          Continue
        </el-button>
      </div>
    </el-aside>
  </el-container>
</template>

<script>
import Announcement from "@/state/models/Announcement.js";
import AnnouncementForm from "@/components/AnnouncementForm.vue";
import AnnouncementFormObject from "@/common/Form/AnnouncementFormObject.js";
import AnnouncementFormValidationBuilder from "@/common/validation/AnnouncementFormValidationBuilder.js";
import Campaign from "@/state/models/Campaign.js";
import CampaignCreateActivity from "@/components/CampaignCreateActivity.vue";
import CampaignFormObject from "@/common/Form/CampaignFormObject.js";
import CampaignSetDetails from "@/components/CampaignSetDetails.vue";
import CampaignSideLaunch from "@/components/CampaignSideLaunch.vue";
import CampaignSideSummary from "@/components/CampaignSideSummary.vue";
import CampaignSummary from "@/components/CampaignSummary.vue";
import CampaignValidationBuilder from "@/common/validation/CampaignValidationBuilder.js";
import MessageBox from "@/mixins/MessageBox.js";
import RewardedActivity from "@/state/models/RewardedActivity.js";
import RewardedActivityFormObject from "@/common/Form/RewardedActivityFormObject.js";
import RewardedActivityValidationBuilder from "@/common/validation/RewardedActivityValidationBuilder.js";
import SvgNavArrowLeft from "@/assets/icons/nav-arrow-left.svg";
import Toast from "@/mixins/Toast.js";

export default {
  components: {
    AnnouncementForm,
    CampaignCreateActivity,
    CampaignSetDetails,
    CampaignSideLaunch,
    CampaignSideSummary,
    CampaignSummary,
    SvgNavArrowLeft,
  },
  mixins: [Toast, MessageBox],
  data() {
    return {
      temporaryCampaignName: null,
      loading: false,
      step: 1,
      campaign: new Campaign(),
      announcement: new Announcement(),
      announcementId: new Announcement(),
      campaignFormObject: new CampaignFormObject(),
      rewardedActivityFormObject: new RewardedActivityFormObject(),
      announcementFormObject: new AnnouncementFormObject(),
      campaignValidation: null,
      rewardedActivityValidation: null,
      announcementFormValidation: null,
    };
  },
  computed: {
    rewardedActivities() {
      return this.$store.getters["RewardedActivity/getByCampaign"](
        this.campaign.id
      );
    },
  },
  created() {
    this.campaignFormObject.setValuesFromCampaign(this.campaign);
    this.campaignFormObject.reset();

    this.loadData();

    this.campaignValidation = CampaignValidationBuilder.createValidation(
      this.campaignFormObject
    );

    this.rewardedActivityValidation =
      RewardedActivityValidationBuilder.createValidation(
        this.rewardedActivityFormObject
      );

    this.announcementFormValidation =
      AnnouncementFormValidationBuilder.createValidation(
        this.announcementFormObject
      );
  },
  methods: {
    formChanged(formData) {
      this.temporaryCampaignName = formData.name;
    },
    async loadData() {
      this.loading = true;

      const promises = [
        this.$store.dispatch("Network/preloadNetworks"),
        this.$store.dispatch("Contract/preloadContracts"),
      ];

      if (this.$route.params.id) {
        const campaign = this.$store.getters["Campaign/getCampaign"](
          this.$route.params.id
        );

        if (!campaign) {
          this.$router.push("/campaign");
          return;
        }

        this.campaign = campaign;

        this.campaignFormObject.setValuesFromCampaign(this.campaign);
        this.campaignFormObject.reset();

        promises.push(this.loadAnnouncement());
      }

      await Promise.all(promises);

      this.loading = false;
    },
    back() {
      if (this.step > 1) {
        this.step--;
      } else {
        this.$router.push("/campaign");
      }
    },
    async loadAnnouncement() {
      const campaignId = this.$route.params.id;

      await this.$store.dispatch(
        "Announcement/loadCampaignAnnouncements",
        campaignId
      );

      const announcements =
        this.$store.getters["Announcement/getByCampaign"](campaignId);

      if (announcements.length === 0) {
        return;
      }

      this.announcement = announcements[0];
      this.announcementFormObject.setValuesFromAnnouncement(this.announcement);
      this.announcementFormObject.reset();
    },
    async addRewardedActivity() {
      if (!(await this.rewardedActivityValidation.$validate())) {
        // console.log(this.rewardedActivityValidation.$errors);
        this.Toast("Form contains errors", null, "error");
        return;
      }

      const rewardedActivity = new RewardedActivity();
      this.rewardedActivityFormObject.setRewardedActivityValues(
        rewardedActivity
      );
      rewardedActivity.campaign = this.campaign.id;

      this.$store.commit(
        "RewardedActivity/setRewardedActivity",
        rewardedActivity
      );

      this.rewardedActivityValidation.$reset();

      this.rewardedActivityFormObject.minimumTransactionLimit = "";
      this.rewardedActivityFormObject.minimumTransactionCount = "";
      this.rewardedActivityFormObject.action = null;

      this.Toast("Activity added", null, "success");
    },
    clearRewardedActivity() {
      this.rewardedActivityFormObject.activity = null;
      this.rewardedActivityFormObject.action = null;

      this.rewardedActivityValidation.$reset();
    },
    async storeCampaign() {
      if (!this.campaignFormObject.dirty()) {
        return true;
      }

      this.campaignFormObject.setCampaignValues(this.campaign);

      this.$store.commit("Campaign/setCampaign", this.campaign);

      const response = await this.$store.dispatch(
        "Campaign/storeCampaign",
        this.campaign.id
      );

      if (!response.success) {
        this.Toast("Failed to save campaign", "", "error");
        console.error(response.errors);

        return false;
      }

      this.campaign = this.$store.getters["Campaign/getCampaign"](
        response.data
      );

      this.campaignFormObject.setValuesFromCampaign(this.campaign);
      this.campaignFormObject.reset();

      return true;
    },
    async storeAnnouncement() {
      if (!this.announcementFormObject.dirty()) {
        return true;
      }

      this.announcementFormObject.setAnnouncementValues(this.announcement);

      this.announcement.campaign = this.campaign.id;

      this.$store.commit("Announcement/setAnnouncement", this.announcement);

      const response = await this.$store.dispatch(
        "Announcement/storeAnnouncement",
        this.announcement.id
      );

      if (!response.success) {
        this.Toast("Failed to save announcement", "", "error");
        console.error(response.errors);

        return false;
      }

      this.announcement = this.$store.getters["Announcement/getAnnouncement"](
        response.data
      );

      this.announcementFormObject.setValuesFromAnnouncement(this.announcement);
      this.announcementFormObject.reset();

      return true;
    },
    /**
     * @return {Promise<boolean>}
     */
    async goToNextStep() {
      this.loading = true;

      switch (this.step) {
        case 1:
          if (!(await this.campaignValidation.$validate())) {
            // console.log(this.campaignValidation.$errors);
            this.Toast("Form contains errors", null, "error");
            this.loading = false;

            return false;
          }

          if (!(await this.storeCampaign())) {
            this.loading = false;

            return false;
          }

          break;
        case 2:
          if (this.rewardedActivities.length === 0) {
            await this.MessageBoxInfo("Add at least one activity to continue");
            this.loading = false;

            return false;
          }

          if (!(await this.storeCampaign())) {
            this.loading = false;

            return false;
          }

          break;
        case 3:
          if (!(await this.announcementFormValidation.$validate())) {
            // console.log(this.announcementFormValidation.$errors);
            this.Toast("Form contains errors", null, "error");
            this.loading = false;

            return false;
          }

          if (!(await this.storeAnnouncement())) {
            this.loading = false;

            return false;
          }

          break;
        case 4:
          break;
      }

      this.loading = false;
      this.step++;

      return true;
    },
  },
};
</script>
