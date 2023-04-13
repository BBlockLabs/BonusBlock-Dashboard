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
    </el-main>

    <el-aside class="bl-solid" width="200px">
      <debug-wrapper>{{ campaign }}</debug-wrapper>
      <debug-wrapper>{{ rewardedActivities }}</debug-wrapper>

      <el-button @click="goToNextStep"> Continue </el-button>
    </el-aside>
  </el-container>
</template>

<script>
import CampaignSetDetails from "@/components/CampaignSetDetails.vue";
import Campaign from "@/state/models/Campaign.js";
import DebugWrapper from "@/components/DebugWrapper.vue";
import CampaignValidationBuilder from "@/common/validation/CampaignValidationBuilder.js";
import CampaignCreateActivity from "@/components/CampaignCreateActivity.vue";
import RewardedActivity from "@/state/models/RewardedActivity.js";
import RewardedActivityValidationBuilder from "@/common/validation/RewardedActivityValidationBuilder.js";
import Toast from "@/mixins/Toast.js";
import MessageBox from "@/mixins/MessageBox.js";
import CampaignFormObject from "@/common/Form/CampaignFormObject.js";
import RewardedActivityFormObject from "@/common/Form/RewardedActivityFormObject.js";

export default {
  components: {
    DebugWrapper,
    CampaignSetDetails,
    CampaignCreateActivity,
  },
  mixins: [Toast, MessageBox],
  data() {
    return {
      lastActiveStep: 1,
      step: 1,
      campaign: new Campaign(),
      campaignFormObject: new CampaignFormObject(),
      rewardedActivityFormObject: new RewardedActivityFormObject(),
      campaignValidation: null,
      rewardedActivityValidation: null,
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

    this.campaignValidation = CampaignValidationBuilder.createValidation(
      this.campaignFormObject
    );

    this.rewardedActivityValidation =
      RewardedActivityValidationBuilder.createValidation(
        this.rewardedActivityFormObject
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

      this.$store.commit('Campaign/setCampaign', this.campaign);

      const response = await this.$store.dispatch(
        "Campaign/storeCampaign",
        this.campaign.id
      );

      if (!response.success) {
        this.Toast("Failed to save campaign", "", "error");
        console.error(response.errors);

        return false;
      }

      this.campaign = this.$store.getters['Campaign/getCampaign'](response.data);

      this.campaignFormObject.setValuesFromCampaign(this.campaign);
      this.campaignFormObject.reset();

      return true;
    },
    /**
     * @return {Promise<boolean>}
     */
    async goToNextStep() {
      switch (this.step) {
        case 1:
          {
            if (!(await this.campaignValidation.$validate())) {
              this.Toast("Form contains errors", null, "error");
              return false;
            }

            if (!(await this.storeCampaign())) {
              return false;
            }
          }
          break;
        case 2:
          {
            if (this.rewardedActivities.length === 0) {
              await this.MessageBoxInfo(
                "Add at least one activity to continue"
              );

              return false;
            }

            if (!(await this.storeCampaign())) {
              return false;
            }
          }
          break;
        case 3:
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
