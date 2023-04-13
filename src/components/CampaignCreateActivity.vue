<template>
  <el-form>
    <el-form-item label="Select Product">
      <el-form-item label="Categories">
        <category-select-field v-model="campaignObject.categories" multiple />
      </el-form-item>

      <el-form-item label="Network">
        <network-select-field v-model="campaignObject.network" />
      </el-form-item>

      <el-form-item label="Product">
        <product-select-field
          v-model="campaignObject.product"
          :filters="{
            network: campaignObject.network,
            categories: campaignObject.categories,
          }"
        />
      </el-form-item>
    </el-form-item>

    <el-form-item
      v-if="campaignObject.product"
      v-bind="ValidationHelper.getFormItemErrorAttributes(validate['activity'])"
      label="Select activity"
    >
      <activity-picker
        v-model:activity="rewardedActivity.activity"
        v-model:action="rewardedActivity.action"
        :filters="{ product: campaignObject.product }"
      />
    </el-form-item>

    <el-form-item v-if="rewardedActivity.action" label="Set requirements">
      <el-form-item
        v-bind="
          ValidationHelper.getFormItemErrorAttributes(
            validate['minimumTransactionLimit']
          )
        "
        label="Set minimum transaction limit"
      >
        <el-input-number v-model="rewardedActivity.minimumTransactionLimit" />
      </el-form-item>
    </el-form-item>
  </el-form>

  <debug-wrapper>{{ rewardedActivity }}</debug-wrapper>
</template>

<script>
import CategorySelectField from "@/components/CategorySelectField.vue";
import NetworkSelectField from "@/components/NetworkSelectField.vue";
import ProductSelectField from "@/components/ProductSelectField.vue";
import RewardedActivity from "@/state/models/RewardedActivity.js";
import RewardedActivityValidationBuilder from "@/common/validation/RewardedActivityValidationBuilder.js";
import ValidationHelper from "@/common/validation/ValidationHelper.js";
import Campaign from "@/state/models/Campaign.js";
import ActivityPicker from "@/components/ActivityPicker.vue";

export default {
  components: {
    CategorySelectField,
    NetworkSelectField,
    ProductSelectField,
    ActivityPicker,
  },
  props: {
    campaign: {
      type: Campaign,
      default: () => new Campaign(),
    },
    modelValue: {
      type: RewardedActivity,
      default: () => new RewardedActivity(),
    },
    validation: {
      type: Object,
      default: () => null,
    },
  },
  emits: ["submit", "update:modelValue", "update:campaign"],
  /**
   * @returns {{rewardedActivity: RewardedActivity, validate: Object}}
   */
  data() {
    return {
      rewardedActivity: this.modelValue,
      campaignObject: this.campaign,
    };
  },
  computed: {
    ValidationHelper: () => ValidationHelper,
    validate() {
      if (this.validation) {
        return this.validation;
      }

      const validation = RewardedActivityValidationBuilder.createValidation(
        this.rewardedActivity
      );

      validation.$lazy = true;

      return validation;
    },
  },
  watch: {
    modelValue() {
      this.rewardedActivity = this.modelValue;
    },
    rewardedActivity: {
      deep: true,
      handler() {
        this.$emit("update:modelValue", this.rewardedActivity);
      },
    },
    campaignObject: {
      deep: true,
      handler() {
        this.$emit("update:campaign", this.campaignObject);
      },
    },
  },
};
</script>
