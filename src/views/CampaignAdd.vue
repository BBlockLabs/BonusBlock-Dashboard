<template>
  <el-container v-loading="loading" class="h-100">
    <el-main class="pos-relative">
      <div class="pos-absolute w-100">
        <div class="p-4">
          <el-row class="mb-5">
            <el-col :span="1">
              <el-button link @click="back" style="margin-left: -0.5em">
                <svg-nav-arrow-left class="icon" />
              </el-button>
            </el-col>

            <el-col v-if="$mq.sm" :span="3" class="align-center">
              <el-button link @click="gotoStep(step + 1)" style="margin-left: 0.5em">
                <svg-nav-arrow-right class="icon" />
              </el-button>
            </el-col>

            <el-col :span="$mq.sm ? 18 : 22">
              <div class="d-flex w-100 align-items-center stepper" :class="{'stepper-mobile': $mq.sm}">
                <template v-for="(stepData, idx) in steps" :key="idx">
                  <svg-nav-arrow-right v-if="idx > 0" class="delimiter-icon flex-grow" />
                  <div
                    class="d-flex align-items-center flex-grow justify-content-center stepper-item pointer"
                    :class="{ active: step > idx, current: step === idx + 1 }"
                    @click="gotoStep(idx + 1)"
                  >
                    <component :is="stepData.icon" class="mr-2 icon" />
                    <div>{{ stepData.name }}</div>
                  </div>
                </template>
              </div>
            </el-col>

            <el-col :span="$mq.sm ? 2 : 1" class="align-right">
              <el-dropdown trigger="click">
                <el-button link>
                  <svg-ellipsis-v class="icon" />
                </el-button>

                <template #dropdown>
                  <el-dropdown-item @click="saveAndExit()">
                    <svg-add-page-icon /> Save and exit
                  </el-dropdown-item>
                  <el-dropdown-item v-if="$route.params.id" class="text-danger" @click="deleteCampaign($route.params.id)">
                    <svg-trash /> Delete
                  </el-dropdown-item>
                </template>
              </el-dropdown>
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
              :campaign-validation="campaignStep2Validation"
            />
          </div>

          <announcement-form
            v-if="step === 3"
            v-model="announcementFormObject"
            :validation="announcementFormValidation"
          />

          <campaign-summary v-if="step === 4" :campaign-id="campaign.id" />

          <template v-if="$mq.lg">
            <div class="bt-solid w-100 mt-auto">
              <div class="d-flex py-4">
                <el-button v-if="step !== 4" type="primary" class="ml-auto" @click="goToNextStep">
                  Continue
                </el-button>
                <el-button type="secondary" class="ml-3" @click="previewOpened = true">
                  Preview
                </el-button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </el-main>

    <component
      :is="$mq.lg ? 'el-drawer' : 'el-aside'"
      v-model="previewOpened"
      :direction="'rtl'"
      class="bl-solid h-100 no-body-x-padding no-body-bottom-padding"
      width="360px"
      size="360"
      style="background: #FFF"
    >
      <div class="pos-relative w-100 h-100">
        <div class="pos-absolute d-flex flex-column" style="inset: 0">
          <div class="of-auto p-4" :class="$mq.lg ? 'pt-0' : ''">
            <campaign-side-summary
              v-if="step !== 4"
              :temporary-campaign-name="temporaryCampaignName"
              :campaign-id="campaign.id"
              :class="$mq.lg ? 'mt-n2' : ''"
            />

            <campaign-side-launch v-else :campaign-id="campaign.id" />
          </div>

          <div v-if="step !== 4" class="bt-solid w-100 mt-auto">
            <div class="d-flex p-4">
              <el-button type="primary" class="ml-auto" @click="previewOpened = false; goToNextStep()">
                Continue
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </component>
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
import SvgNavArrowRight from "@/assets/icons/nav-arrow-right.svg";
import Toast from "@/mixins/Toast.js";
import CampaignStatus from "@/common/CampaignStatus.js";
import { toRaw } from "vue";
import CampaignStep2ValidationBuilder from "@/common/validation/CampaignStep2ValidationBuilder.js";
import ValidationHelper from "@/common/validation/ValidationHelper.js";
import SvgMegaphone from "@/assets/icons/megaphone-bolder.svg";
import SvgStar from "@/assets/icons/star.svg";
import SvgMediaImage from "@/assets/icons/media-image.svg";
import SvgCheck from "@/assets/icons/check.svg";
import SvgEllipsisV from "@/assets/icons/ellipsis-v.svg";
import SvgAddPageIcon from "@/assets/icons/add-page-alt.svg";
import SvgTrash from "@/assets/icons/trash.svg";

const defaultData = () => {
  return {
    previewOpened: false,
    temporaryCampaignName: null,
    loading: true,
    step: 1,
    campaign: new Campaign(),
    announcement: new Announcement(),
    announcementId: new Announcement(),
    campaignFormObject: new CampaignFormObject(),
    rewardedActivityFormObject: new RewardedActivityFormObject(),
    announcementFormObject: new AnnouncementFormObject(),
    campaignValidation: null,
    campaignStep2Validation: null,
    rewardedActivityValidation: null,
    announcementFormValidation: null,
    steps: [
      { name: "Campaign", icon: SvgMegaphone },
      { name: "Activities", icon: SvgStar },
      { name: "Announcement", icon: SvgMediaImage },
      { name: "Launch", icon: SvgCheck },
    ],
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
    SvgNavArrowRight,
    SvgEllipsisV,
    SvgAddPageIcon,
    SvgTrash,
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
    id(newValue) {
      if (newValue !== this.campaign.getId()) {
        this.setupForCampaign();
      }
    },
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
      if (this.status.name !== this.CampaignStatus.DRAFT.name) {
        return;
      }

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

      this.campaignStep2Validation =
        CampaignStep2ValidationBuilder.createValidation(
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
        await this.$store.dispatch(
          "Campaign/loadCampaign",
          this.$route.params.id
        );

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

        const activities = this.$store.getters[
          "RewardedActivity/getByCampaign"
        ](this.campaign.id);

        if (activities.length) {
          this.rewardedActivityFormObject.setValuesFromRewardedActivity(
            activities
          );
          this.rewardedActivityFormObject.reset();
        }

        if (this.step === 1) {
          this.step = await this.guessCurrentStep();
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
        console.error("Failed to save campaign", response.errors);

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
        console.error("Failed to save announcement", response.errors);

        return false;
      }

      this.announcement = this.$store.getters["Announcement/getAnnouncement"](
        response.data
      );

      this.announcementFormObject.setValuesFromAnnouncement(this.announcement);
      this.announcementFormObject.reset();

      return true;
    },
    async guessCurrentStep() {
      if (!(await ValidationHelper.validateSilently(this.campaignValidation))) {
        return 1;
      }
      if (
        !(await ValidationHelper.validateSilently(this.campaignStep2Validation)) ||
        !(await ValidationHelper.validateSilently(this.rewardedActivityValidation))
      ) {
        return 2;
      }
      return 3;
    },
    /**
     * @return {Promise<boolean>}
     */
    async goToNextStep() {
      this.loading = true;
      this.dismissToast("validation-error");

      switch (this.step) {
        case 1:
          if (!(await this.campaignValidation.$validate())) {
            this.Toast(
              "Form contains errors on step " + this.step,
              ValidationHelper.getAllErrors(this.campaignValidation),
              "error",
              5000,
              "validation-error"
            );
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

          if (!this.$route.params.id) {
            this.$router.push("/campaign/" + this.campaign.getId() + "/edit");
          }

          break;
        case 2: {
          if (!(await this.campaignStep2Validation.$validate())) {
            this.Toast(
              "Form contains errors on step " + this.step,
              ValidationHelper.getAllErrors(this.campaignStep2Validation),
              "error",
              5000,
              "validation-error"
            );
            this.loading = false;

            return false;
          }

          if (!(await this.rewardedActivityValidation.$validate())) {
            this.Toast(
              "Form contains errors on step " + this.step,
              ValidationHelper.getAllErrors(this.rewardedActivityValidation),
              "error",
              5000,
              "validation-error"
            );
            this.loading = false;

            return false;
          }

          const oldActivities = this.$store.getters[
            "RewardedActivity/getByCampaign"
          ](this.campaign.id);

          const rewardedActivities = [];

          if (this.rewardedActivityFormObject.actions.length === 0) {
            rewardedActivities.push(new RewardedActivity());
          } else {
            this.rewardedActivityFormObject.actions.forEach(() => {
              rewardedActivities.push(new RewardedActivity());
            });
          }

          this.rewardedActivityFormObject.setRewardedActivityValues(
            rewardedActivities
          );

          for (const rewardedActivity of rewardedActivities) {
            rewardedActivity.campaign = this.campaign.id;
            this.$store.commit("Campaign/setDirty", true);

            this.$store.commit(
              "RewardedActivity/setRewardedActivity",
              rewardedActivity
            );
          }

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
            this.Toast(
              "Form contains errors on step " + this.step,
              ValidationHelper.getAllErrors(this.announcementFormValidation),
              "error",
              5000,
              "validation-error"
            );
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

      if (this.step < 4) {
        this.step++;
      }

      return true;
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
      this.Toast("Campaign deleted successfully", null, "success", 1500);

      return true;
    },
    async saveAndExit() {
      if (await this.goToNextStep()) {
        this.$router.push("/campaign");
      }
    },
  },
};
</script>
