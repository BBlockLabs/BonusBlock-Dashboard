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
        v-model="campaign"
        :validation="campaignValidation"
      />

      <div v-if="step === 2">
        <el-row>
          <el-col>
            <campaign-create-activity
              v-model="newRewardedActivity"
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

export default {
  components: {
    DebugWrapper,
    CampaignSetDetails,
    CampaignCreateActivity,
  },
  data() {
    return {
      lastActiveStep: 1,
      step: 1,
      campaign: new Campaign(),
      newRewardedActivity: new RewardedActivity(),
      rewardedActivities: [],
      campaignValidation: null,
      rewardedActivityValidation: null,
    };
  },
  created() {
    this.campaignValidation = CampaignValidationBuilder.createValidation(
      this.campaign
    );
    this.rewardedActivityValidation =
      RewardedActivityValidationBuilder.createValidation(
        this.newRewardedActivity
      );
  },
  methods: {
    addRewardedActivity() {
      this.rewardedActivityValidation.$touch();

      if (this.rewardedActivityValidation.$error) {
        return;
      }

      this.rewardedActivities.push(this.newRewardedActivity);

      const activity = this.newRewardedActivity.activity;
      const action = this.newRewardedActivity.action;

      this.clearRewardedActivity();

      this.newRewardedActivity.activity = activity;
      this.newRewardedActivity.action = action;
    },
    clearRewardedActivity() {
      this.newRewardedActivity = new RewardedActivity();
      this.rewardedActivityValidation =
        RewardedActivityValidationBuilder.createValidation(
          this.newRewardedActivity
        );
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
      const response = await this.$store.dispatch(
        "Campaign/storeCampaign",
        this.campaign
      );

      if (!response.success) {
        this.Toast("Failed to save campaign", "", "error");

        return false;
      }

      this.campaign = response.data;

      return true;
    },
    /**
     * @return {Promise<boolean>}
     */
    async goToNextStep() {
      switch (this.step) {
        case 1:
          {
            const dirty = this.campaignValidation.$dirty;

            if (!(await this.campaignValidation.$validate())) {
              return false;
            }

            this.campaignValidation.$reset();

            if (!dirty && this.campaign.id) {
              break;
            }

            this.campaign.normalizeFrequencyRatios();

            if (!(await this.storeCampaign())) {
              return false;
            }
          }
          break;
        case 2:
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
