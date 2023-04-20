<template>
  <el-form>
    <el-form-item label="Select Product">
      <el-form-item label="Categories">
        <category-select-field
          v-model="campaignFormObject.categories"
          multiple
        />
      </el-form-item>

      <el-form-item label="Network">
        <network-select-field v-model="campaignFormObject.network" />
      </el-form-item>

      <el-form-item
        v-if="
          campaignFormObject.network &&
          campaignFormObject.categories.length >= 1
        "
        label="Product"
      >
        <product-select-field
          v-model="campaignFormObject.product"
          :filters="
            new ProductFilters(campaignFormObject.categories, [
              campaignFormObject.network,
            ])
          "
        />
      </el-form-item>
    </el-form-item>

    <el-form-item
      v-if="campaignFormObject.product && campaignFormObject.network"
      v-bind="ValidationHelper.getFormItemErrorAttributes(validate['activity'])"
      label="Select activity"
    >
      <activity-picker
        v-model:activity="rewardedActivityFormObject.activity"
        v-model:action="rewardedActivityFormObject.action"
        :product="campaignFormObject.product"
        :network="campaignFormObject.network"
      />
    </el-form-item>

    <el-form-item
      v-if="rewardedActivityFormObject.action"
      label="Set requirements"
    >
      <el-form-item
        v-bind="
          ValidationHelper.getFormItemErrorAttributes(
            validate['minimumTransactionLimit']
          )
        "
        label="Set minimum transaction limit"
      >
        <el-input
          v-model="rewardedActivityFormObject.minimumTransactionLimit"
        />
      </el-form-item>
    </el-form-item>
  </el-form>

  <debug-wrapper>{{ rewardedActivityFormObject }}</debug-wrapper>
</template>

<script>
import CategorySelectField from "@/components/CategorySelectField.vue";
import NetworkSelectField from "@/components/NetworkSelectField.vue";
import ProductSelectField from "@/components/ProductSelectField.vue";
import RewardedActivityValidationBuilder from "@/common/validation/RewardedActivityValidationBuilder.js";
import ValidationHelper from "@/common/validation/ValidationHelper.js";
import ActivityPicker from "@/components/ActivityPicker.vue";
import CampaignFormObject from "@/common/Form/CampaignFormObject.js";
import RewardedActivityFormObject from "@/common/Form/RewardedActivityFormObject.js";
import ProductFilters from "@/common/Http/ProductFilters.js";

export default {
  components: {
    CategorySelectField,
    NetworkSelectField,
    ProductSelectField,
    ActivityPicker,
  },
  props: {
    campaign: {
      type: CampaignFormObject,
      default: () => new CampaignFormObject(),
    },
    modelValue: {
      type: RewardedActivityFormObject,
      default: () => new RewardedActivityFormObject(),
    },
    validation: {
      type: Object,
      default: () => null,
    },
  },
  emits: ["submit", "update:modelValue", "update:campaign"],
  /**
   * @returns {{
   *  rewardedActivityFormObject: RewardedActivity,
   *  campaignFormObject: CampaignFormObject
   * }}
   */
  data() {
    return {
      rewardedActivityFormObject: this.modelValue,
      campaignFormObject: this.campaign,
    };
  },
  computed: {
    ProductFilters: () => ProductFilters,
    ValidationHelper: () => ValidationHelper,
    validate() {
      if (this.validation) {
        return this.validation;
      }

      const validation = RewardedActivityValidationBuilder.createValidation(
        this.rewardedActivityFormObject
      );

      validation.$lazy = true;

      return validation;
    },
  },
  watch: {
    modelValue() {
      this.rewardedActivityFormObject = this.modelValue;
    },
    rewardedActivityFormObject: {
      deep: true,
      handler() {
        this.$emit("update:modelValue", this.rewardedActivityFormObject);
      },
    },
    campaignFormObject: {
      deep: true,
      handler() {
        this.$emit("update:campaign", this.campaignFormObject);
      },
    },
  },
};
</script>
