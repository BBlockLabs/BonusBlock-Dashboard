<template>
  <el-form
    label-position="top"
    @submit.prevent="() => $emit('submit', ...arguments)"
  >
    <h1 class="mt-0"><b>Select Product</b></h1>

    <el-form-item label="Categories">
      <category-select-field
        v-model="campaignFormObject.categories"
        class="w-100"
        multiple
      />
    </el-form-item>

    <el-form-item label="Network">
      <network-select-field
        v-model="campaignFormObject.network"
        class="w-100"
      />
    </el-form-item>

    <el-form-item
      v-if="
        campaignFormObject.network && campaignFormObject.categories.length >= 1
      "
      label="Product"
    >
      <product-select-field
        v-model="campaignFormObject.product"
        class="w-100"
        :filters="
          new ProductFilters(campaignFormObject.categories, [
            campaignFormObject.network,
          ])
        "
      />
    </el-form-item>

    <div v-if="campaignFormObject.product && campaignFormObject.network">
      <h1><b>Select activity</b></h1>

      <el-form-item
        v-if="campaignFormObject.product && campaignFormObject.network"
        v-bind="
          ValidationHelper.getFormItemErrorAttributes(validate['activity'])
        "
      >
        <activity-picker
          v-model:activity="rewardedActivityFormObject.activity"
          v-model:action="rewardedActivityFormObject.action"
          :product="campaignFormObject.product"
          :network="campaignFormObject.network"
        />
      </el-form-item>
    </div>

    <div v-if="rewardedActivityFormObject.action">
      <h1>
        <b>
          Set requirements for
          {{
            $store.getters["Activity/getAction"](
              rewardedActivityFormObject.action
            ).name
          }}
        </b>
      </h1>

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
        <sup class="text-secondary"
          >Set minimum amount of tokens for the activity to count towards the
          reward.</sup
        >
      </el-form-item>

      <!--el-form-item
        v-bind="
          ValidationHelper.getFormItemErrorAttributes(
            validate['additionalRewardTransactionLimit']
          )
        "
        label="Set additional reward transaction limit"
      >
        <el-input
          v-model="rewardedActivityFormObject.additionalRewardTransactionLimit"
        />
        <sup class="text-secondary"
          >Set an amount of tokens for which the user gets an additional
          reward.</sup
        >
      </el-form-item-->

      <el-form-item
        v-bind="
          ValidationHelper.getFormItemErrorAttributes(
            validate['minimumTransactionCount']
          )
        "
        label="Set minimum transaction amount"
      >
        <el-input v-model="minimumTransactionCountDisplayValue" />
        <sup class="text-secondary"
          >Set minimum amount of transactions for the activity to count towards
          the reward.</sup
        >
      </el-form-item>

      <!--el-form-item
        v-bind="
          ValidationHelper.getFormItemErrorAttributes(
            validate['additionalRewardTransactionCount']
          )
        "
        label="Set additional reward transaction amount"
      >
        <el-input
          v-model="this.rewardedActivityFormObject.additionalRewardTransactionCount"
        />
        <sup class="text-secondary"
          >Set an amount of transactions for which the user gets an additional
          reward.</sup
        >
      </el-form-item-->
    </div>
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
    minimumTransactionCountDisplayValue: {
      get: function () {
        return this.rewardedActivityFormObject.minimumTransactionCount + " $";
      },
      set: function (modifiedValue) {
        // Recalculate value after ignoring "$" and "," in user input
        let newValue = parseFloat(modifiedValue.replace(/[^\d.]/g, ""));
        // Ensure that it is not NaN
        if (isNaN(newValue)) {
          newValue = 0;
        }
        this.rewardedActivityFormObject.minimumTransactionCount = newValue;
      },
    },
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
