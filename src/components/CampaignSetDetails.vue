<template>
  <el-form
    label-position="top"
    @submit.prevent="() => $emit('submit', ...arguments)"
  >
    <h1>Set your Campaign Details</h1>

    <el-form-item
      v-bind="ValidationHelper.getFormItemErrorAttributes(validate['name'])"
      label="Campaign Name"
    >
      <el-input v-model="campaignFormObject.name" />
    </el-form-item>

    <el-form-item
      v-bind="
        ValidationHelper.getFormItemErrorAttributes(validate['timeFrame'])
      "
      label="Campaign Period"
    >
      <el-date-picker v-model="campaignFormObject.timeFrame" type="daterange" />
    </el-form-item>

    <h1>Set rewards</h1>

    <el-form-item
      v-bind="
        ValidationHelper.getFormItemErrorAttributes(
          validate['rewardPoolTokenCount']
        )
      "
      label="Reward Pool"
    >
      <el-row class="w-100" :gutter="12">
        <el-col :span="12">
          <contract-select-field
            v-model="campaignFormObject.rewardPoolContract"
            class="w-100"
          />
        </el-col>

        <el-col :span="12">
          <el-input v-model="campaignFormObject.rewardPoolTokenCount" />
        </el-col>
      </el-row>
    </el-form-item>

    <h3>Reward frequency ratio</h3>

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

    <el-form-item
      v-bind="
        ValidationHelper.getFormItemErrorAttributes(
          validate['minimumPerUserAward']
        )
      "
      label="Minimum reward per user"
    >
      <el-input v-model="campaignFormObject.minimumPerUserAward" />
    </el-form-item>

    <el-form-item
      v-bind="
        ValidationHelper.getFormItemErrorAttributes(
          validate['maximumPerUserAward']
        )
      "
      label="Maximum reward per user"
    >
      <el-input v-model="campaignFormObject.maximumPerUserAward" />
    </el-form-item>

    <h1>Other</h1>

    <el-row :gutter="12">
      <el-col :span="13">
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
      </el-col>

      <el-col :span="11">
        <el-form-item class="m-0">
          <el-switch
            v-model="campaignFormObject.weeklyEqualDistribution"
            active-text="Weekly equal distribution"
          />
        </el-form-item>

        <el-form-item>
          <el-switch
            v-model="campaignFormObject.qualityAudience"
            active-text="Quality Audience (Verified by Cookie3)"
          />
        </el-form-item>
      </el-col>
    </el-row>

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
