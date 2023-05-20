<template>
  <el-container v-loading="loading" class="h-100">
    <el-main class="pos-relative">
      <div class="pos-absolute w-100">
        <div class="p-4">
          <el-row>
            <el-col :span="1">
              <el-button link @click="back">
                <svg-nav-arrow-left class="icon" />
              </el-button>
            </el-col>

            <el-col :span="23">
              <el-steps :active="step - 1" align-center class="mb-5">
                <el-step
                  v-for="(stepName, idx) in [
                    'Set campaign',
                    'Create activities',
                    'Create your announcement',
                    'Launch!',
                  ]"
                  :key="stepName"
                  :title="stepName"
                >
                  <template v-if="status === CampaignStatus.DRAFT" #title>
                    <el-link
                      :type="step > idx ? 'primary' : 'default'"
                      @click="gotoStep(idx + 1)"
                    >
                      {{ stepName }}
                    </el-link>
                  </template>
                </el-step>
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
            <campaign-create-activity
              v-model:campaign="campaignFormObject"
              v-model="rewardedActivityFormObject"
              :validation="rewardedActivityValidation"
            />
          </div>

          <announcement-form
            v-if="step === 3"
            v-model="announcementFormObject"
            :validation="announcementFormValidation"
          />

          <campaign-summary v-if="step === 4" :campaign-id="campaign.id" />
        </div>
      </div>
    </el-main>

    <el-aside class="bl-solid h-100 pos-relative" width="360px">
      <div class="pos-absolute d-flex flex-column h-100 w-100">
        <div class="of-auto p-4">
          <campaign-side-summary
            v-if="step !== 4"
            :temporary-campaign-name="temporaryCampaignName"
            :campaign-id="campaign.id"
          />

          <campaign-side-launch v-else :campaign-id="campaign.id" />
        </div>

        <div v-if="step !== 4" class="bt-solid w-100 mt-auto">
          <div class="d-flex p-4">
            <el-button type="primary" class="ml-auto" @click="goToNextStep">
              Continue
            </el-button>
          </div>
        </div>
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
import CampaignStatus from "@/common/CampaignStatus.js";
import { toRaw } from "vue";

const defaultData = () => {
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
};

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
  data: defaultData,
  computed: {
    CampaignStatus() {
      return CampaignStatus;
    },
    id() {
      return this.$route.params.id || null;
    },
    status() {
      return toRaw(
        this.$store.getters["Campaign/getCampaign"](this.$route.params.id)
          ?.status || CampaignStatus.DRAFT
      );
    },
  },
  watch: {
    id: "setupForCampaign",
    announcementFormObject: {
      deep: true,
      handler() {
        this.announcementFormObject.setAnnouncementValues(this.announcement);
        this.announcement.campaign = this.campaign.id;
        this.$store.commit("Announcement/setAnnouncement", this.announcement);
      },
    },
  },
  created() {
    this.setupForCampaign();
  },
  methods: {
    async gotoStep(stepNumber) {
      if (this.step === stepNumber) {
        return;
      }

      if (this.step > stepNumber) {
        this.step = stepNumber;

        return;
      }

      while (this.step < stepNumber) {
        if (!(await this.goToNextStep())) {
          break;
        }
      }
    },
    setupForCampaign() {
      this.step = 1;

      this.$store.commit("Campaign/setDirty", false);
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

        if (this.status !== CampaignStatus.DRAFT) {
          this.step = 4;
        }

        this.campaignFormObject.setValuesFromCampaign(this.campaign);
        this.campaignFormObject.reset();

        const activity =
          this.$store.getters["RewardedActivity/getByCampaign"](
            this.campaign.id
          )[0] || null;

        if (activity) {
          this.rewardedActivityFormObject.setValuesFromRewardedActivity(
            activity
          );
          this.rewardedActivityFormObject.reset();
        }

        promises.push(this.loadAnnouncement());
      }

      await Promise.all(promises);

      this.loading = false;
    },
    back() {
      if (this.step > 1 && this.status === CampaignStatus.DRAFT) {
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
    async storeCampaign() {
      this.campaignFormObject.setCampaignValues(this.campaign);

      this.$store.commit("Campaign/setCampaign", this.campaign);

      if (this.$store.getters["Campaign/isDirty"] === false) {
        return true;
      }

      const response = await this.$store.dispatch(
        "Campaign/storeCampaign",
        this.campaign.id
      );

      if (!response.success) {
        this.Toast("Failed to save campaign", "", "error", 1500);
        console.error(response.errors);

        return false;
      }

      this.campaign = this.$store.getters["Campaign/getCampaign"](
        response.data
      );

      this.campaignFormObject.setValuesFromCampaign(this.campaign);
      this.campaignFormObject.reset();

      this.$store.commit("Campaign/setDirty", false);

      this.Toast("Campaign saved", null, "success", 5);

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
            this.Toast("Form contains errors", null, "error", 1500);
            this.loading = false;

            return false;
          }

          if (this.campaignFormObject.dirty()) {
            this.$store.commit("Campaign/setDirty", true);
          }

          if (!(await this.storeCampaign())) {
            this.loading = false;

            return false;
          }

          break;
        case 2: {
          if (!(await this.rewardedActivityValidation.$validate())) {
            this.Toast("Form contains errors", null, "error", 1500);
            this.loading = false;

            return false;
          }

          const oldActivities = this.$store.getters[
            "RewardedActivity/getByCampaign"
          ](this.campaign.id);

          const rewardedActivity = new RewardedActivity();

          this.rewardedActivityFormObject.setRewardedActivityValues(
            rewardedActivity
          );

          rewardedActivity.campaign = this.campaign.id;
          this.$store.commit("Campaign/setDirty", true);

          this.$store.commit(
            "RewardedActivity/setRewardedActivity",
            rewardedActivity
          );

          oldActivities.forEach((revActivity) => {
            this.$store.commit(
              "RewardedActivity/removeRewardedActivity",
              revActivity.id
            );
          });

          this.rewardedActivityValidation.$reset();

          if (!(await this.storeCampaign())) {
            this.loading = false;

            return false;
          }

          break;
        }
        case 3:
          if (!(await this.announcementFormValidation.$validate())) {
            this.Toast("Form contains errors", null, "error", 1500);
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
