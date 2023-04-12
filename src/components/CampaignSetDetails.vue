<template>
  <el-form @submit="() => $emit('submit', ...arguments)">
    <el-form-item
      v-bind="ValidationHelper.getFormItemErrorAttributes(validate['name'])"
      label="Campaign Name"
    >
      <el-input v-model="campaign.name" />
    </el-form-item>

    <el-form-item label="Frequency ratio">
      <el-form-item
        v-bind="
          ValidationHelper.getFormItemErrorAttributes(
            validate['frequencyRatioDaily']
          )
        "
        label="Daily"
      >
        <el-input-number
          v-model="campaign.frequencyRatioDaily"
          :max="1"
          :min="0"
          :precision="10"
          :controls="false"
        />
      </el-form-item>

      <el-form-item
        v-bind="
          ValidationHelper.getFormItemErrorAttributes(
            validate['frequencyRatioWeekly']
          )
        "
        label="Weekly"
      >
        <el-input-number
          v-model="campaign.frequencyRatioWeekly"
          :max="1"
          :min="0"
          :precision="10"
          :controls="false"
        />
      </el-form-item>

      <el-form-item
        v-bind="
          ValidationHelper.getFormItemErrorAttributes(
            validate['frequencyRatioMonthly']
          )
        "
        label="Monthly"
      >
        <el-input-number
          v-model="campaign.frequencyRatioMonthly"
          :max="1"
          :min="0"
          :precision="10"
          :controls="false"
        />
      </el-form-item>
    </el-form-item>

    <el-form-item
      v-bind="
        ValidationHelper.getFormItemErrorAttributes(
          validate['rewardPoolTokenCount']
        )
      "
      label="Reward Pool"
    >
      <token-select-field v-model="campaign.rewardPoolContract" />
      <el-input v-model="campaign.rewardPoolTokenCount" />
    </el-form-item>

    <el-form-item
      label="Campaign Period"
      v-bind="{
        ...ValidationHelper.getFormItemErrorAttributes(
          validate['timeFrameFrom']
        ),
        ...ValidationHelper.getFormItemErrorAttributes(
          validate['timeFrameTill']
        ),
      }"
    >
      <el-date-picker v-model="timeFrame" type="daterange" />
    </el-form-item>

    <el-form-item label="Other">
      <el-form-item
        v-bind="
          ValidationHelper.getFormItemErrorAttributes(
            validate['expectedReturnOfInvestment']
          )
        "
        label="Expected ROI"
      >
        <el-input v-model="campaign.expectedReturnOfInvestment" />
      </el-form-item>

      <el-form-item
        v-bind="
          ValidationHelper.getFormItemErrorAttributes(
            validate['weeklyEqualDistribution']
          )
        "
        label="Weekly equal distribution"
      >
        <el-switch v-model="campaign.weeklyEqualDistribution" />
      </el-form-item>

      <el-form-item
        v-bind="
          ValidationHelper.getFormItemErrorAttributes(
            validate['qualityAudience']
          )
        "
        label="Quality Audience (Verified by Cookie3)"
      >
        <el-switch v-model="campaign.qualityAudience" />
      </el-form-item>
    </el-form-item>

    <debug-wrapper>{{ campaign }}</debug-wrapper>
  </el-form>
</template>

<script>
import Campaign from "@/state/models/Campaign.js";
import CampaignValidationBuilder from "@/common/validation/CampaignValidationBuilder.js";
import ValidationHelper from "@/common/validation/ValidationHelper.js";
import TokenSelectField from "@/components/TokenSelectField.vue";

export default {
  components: {
    TokenSelectField,
  },
  props: {
    modelValue: {
      type: Campaign,
      default: () => new Campaign(),
    },
    validation: {
      type: Object,
      default: () => null,
    },
  },
  emits: ["submit", "update:modelValue"],
  /**
   * @returns {{campaign: Campaign, validate: Object}}
   */
  data() {
    return {
      campaign: this.modelValue,
    };
  },
  computed: {
    ValidationHelper: () => ValidationHelper,
    validate() {
      if (this.validation) {
        return this.validation;
      }

      const validation = CampaignValidationBuilder.createValidation(
        this.campaign
      );

      validation.$lazy = true;

      return validation;
    },
    timeFrame: {
      /**
       * @returns {[Date, Date]}
       */
      get() {
        return [this.campaign.timeFrameFrom, this.campaign.timeFrameTill];
      },
      /**
       * @param {[Date, Date]} val
       */
      set(val) {
        this.campaign.timeFrameFrom = val[0];
        this.campaign.timeFrameTill = val[1];
      },
    },
  },
  watch: {
    modelValue() {
      this.campaign = this.modelValue;
    },
    campaign: {
      deep: true,
      handler() {
        this.$emit("update:modelValue", this.campaign);
      },
    },
  },
};
</script>
