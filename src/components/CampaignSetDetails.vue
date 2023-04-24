<template>
  <el-form label-position="top" @submit="() => $emit('submit', ...arguments)">
    <el-form-item
      v-bind="ValidationHelper.getFormItemErrorAttributes(validate['name'])"
      label="Campaign Name"
    >
      <el-input v-model="campaignFormObject.name" />
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
        <el-input v-model="campaignFormObject.frequencyRatioDaily" />
      </el-form-item>

      <el-form-item
        v-bind="
          ValidationHelper.getFormItemErrorAttributes(
            validate['frequencyRatioWeekly']
          )
        "
        label="Weekly"
      >
        <el-input v-model="campaignFormObject.frequencyRatioWeekly" />
      </el-form-item>

      <el-form-item
        v-bind="
          ValidationHelper.getFormItemErrorAttributes(
            validate['frequencyRatioMonthly']
          )
        "
        label="Monthly"
      >
        <el-input v-model="campaignFormObject.frequencyRatioMonthly" />
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
      <contract-select-field v-model="campaignFormObject.rewardPoolContract" />
      <el-input v-model="campaignFormObject.rewardPoolTokenCount" />
    </el-form-item>

    <el-form-item
      v-bind="
        ValidationHelper.getFormItemErrorAttributes(validate['timeFrame'])
      "
      label="Campaign Period"
    >
      <el-date-picker v-model="campaignFormObject.timeFrame" type="daterange" />
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
        <el-input v-model="campaignFormObject.expectedReturnOfInvestment" />
      </el-form-item>

      <el-form-item
        v-bind="
          ValidationHelper.getFormItemErrorAttributes(
            validate['weeklyEqualDistribution']
          )
        "
        label="Weekly equal distribution"
      >
        <el-switch v-model="campaignFormObject.weeklyEqualDistribution" />
      </el-form-item>

      <el-form-item
        v-bind="
          ValidationHelper.getFormItemErrorAttributes(
            validate['qualityAudience']
          )
        "
        label="Quality Audience (Verified by Cookie3)"
      >
        <el-switch v-model="campaignFormObject.qualityAudience" />
      </el-form-item>
    </el-form-item>

    <debug-wrapper>{{ campaignFormObject }}</debug-wrapper>
  </el-form>
</template>

<script>
import CampaignValidationBuilder from "@/common/validation/CampaignValidationBuilder.js";
import ValidationHelper from "@/common/validation/ValidationHelper.js";
import ContractSelectField from "@/components/ContractSelectField.vue";
import CampaignFormObject from "@/common/Form/CampaignFormObject.js";

export default {
  components: {
    ContractSelectField,
  },
  props: {
    modelValue: {
      type: CampaignFormObject,
      default: () => new CampaignFormObject(),
    },
    validation: {
      type: Object,
      default: () => null,
    },
  },
  emits: ["submit", "update:modelValue"],
  /**
   * @returns {{campaignFormObject: CampaignFormObject, validate: Object}}
   */
  data() {
    return {
      campaignFormObject: this.modelValue,
    };
  },
  computed: {
    ValidationHelper: () => ValidationHelper,
    validate() {
      if (this.validation) {
        return this.validation;
      }

      const validation = CampaignValidationBuilder.createValidation(
        this.campaignFormObject
      );

      validation.$lazy = true;

      return validation;
    },
  },
  watch: {
    modelValue() {
      this.campaignFormObject = this.modelValue;
    },
    campaignFormObject: {
      deep: true,
      handler() {
        this.$emit("update:modelValue", this.campaignFormObject);
      },
    },
  },
};
</script>
