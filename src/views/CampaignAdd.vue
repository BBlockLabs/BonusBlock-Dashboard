<template>
  <el-container class="h-100">
    <el-main>
      <el-button
        v-for="idx in 4"
        :key="idx"
        :disabled="idx > lastActiveStep"
        :type="idx === step ? 'success' : ''"
        @click="goToStep(idx)"
      >
        {{ idx }}
      </el-button>

      <campaign-set-details
        v-if="step === 1"
        v-model="campaignFormObject"
        :validation="campaignValidation"
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

          <el-col>
            <el-button @click="clearRewardedActivity"> Clear </el-button>

            <el-button @click="addRewardedActivity"> Add activity </el-button>
          </el-col>
        </el-row>
      </div>

      <div v-if="step === 3">
        <h2>Create an announcement</h2>

        <announcement-form
          v-model="announcementFormObject"
          :validation="announcementFormValidation"
        />

        <debug-wrapper>{{ announcementFormObject }}</debug-wrapper>
      </div>

      <div v-if="step === 4">
        <h2>Create an announcement</h2>

        <campaign-summary :campaign-id="campaign.id" />
      </div>
    </el-main>

    <el-aside class="bl-solid" width="200px">
      <campaign-side-summary v-if="step !== 4" :campaign-id="campaign.id" />
      <campaign-side-launch v-else :campaign-id="campaign.id" />

      <el-button v-if="step !== 4" @click="goToNextStep"> Continue </el-button>
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
import CampaignSummary from "@/components/CampaignSummary.vue";
import CampaignValidationBuilder from "@/common/validation/CampaignValidationBuilder.js";
import DebugWrapper from "@/components/DebugWrapper.vue";
import MessageBox from "@/mixins/MessageBox.js";
import RewardedActivity from "@/state/models/RewardedActivity.js";
import RewardedActivityFormObject from "@/common/Form/RewardedActivityFormObject.js";
import RewardedActivityValidationBuilder from "@/common/validation/RewardedActivityValidationBuilder.js";
import Toast from "@/mixins/Toast.js";
import CampaignSideSummary from "@/components/CampaignSideSummary.vue";
import CampaignSideLaunch from "@/components/CampaignSideLaunch.vue";

export default {
  components: {
    CampaignSideLaunch,
    AnnouncementForm,
    CampaignCreateActivity,
    CampaignSetDetails,
    DebugWrapper,
    CampaignSummary,
    CampaignSideSummary,
  },
  mixins: [Toast, MessageBox],
  data() {
    return {
      lastActiveStep: 1,
      step: 3,
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
    this.$store.dispatch("Network/preloadNetworks");

    this.campaignFormObject.setValuesFromCampaign(this.campaign);

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
    async addRewardedActivity() {
      if (!(await this.rewardedActivityValidation.$validate())) {
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
    },
    clearRewardedActivity() {
      this.rewardedActivityFormObject.activity = null;
      this.rewardedActivityFormObject.action = null;

      this.rewardedActivityValidation.$reset();
    },
    setLastActiveStep() {
      this.lastActiveStep = Math.max(this.lastActiveStep, this.step);
    },
    /**
     * @param {number} step
     */
    async goToStep(step) {
      if (step <= this.step) {
        this.step = step;
        return;
      }

      while (this.step < step) {
        if (!(await this.goToNextStep())) {
          this.lastActiveStep = this.step;

          break;
        }
      }
    },
    async storeCampaign() {
      if (!this.campaignFormObject.dirty()) {
        return true;
      }

      this.campaignFormObject.setCampaignValues(this.campaign);

      this.campaign.normalizeFrequencyRatios();

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
      switch (this.step) {
        case 1:
          if (!(await this.campaignValidation.$validate())) {
            this.Toast("Form contains errors", null, "error");
            return false;
          }

          if (!(await this.storeCampaign())) {
            return false;
          }

          break;
        case 2:
          if (this.rewardedActivities.length === 0) {
            await this.MessageBoxInfo("Add at least one activity to continue");

            return false;
          }

          if (!(await this.storeCampaign())) {
            return false;
          }

          break;
        case 3:
          if (!(await this.announcementFormValidation.$validate())) {
            this.Toast("Form contains errors", null, "error");
            return false;
          }

          if (!(await this.storeAnnouncement())) {
            return false;
          }

          break;
        case 4:
          break;
      }

      this.step++;

      this.setLastActiveStep();

      return true;
    },
  },
};
</script>
