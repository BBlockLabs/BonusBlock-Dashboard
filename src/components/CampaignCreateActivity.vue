<template>
  <el-form
    label-position="top"
    @submit.prevent="() => $emit('submit', ...arguments)"
  >
    <el-row justify="space-between">
      <el-col :span="-1">
        <h1 class="mt-0"><b>Activity Creation</b></h1>
      </el-col>

      <el-col :span="-1">
        Advanced mode <el-switch v-model="advanced" />
      </el-col>
    </el-row>

    <activity-create-simple
      v-if="!advanced"
      v-model:activity-form="rewardedActivityFormObject"
      v-model:campaign-form="campaignFormObject"
    />

    <activity-create-advanced
      v-if="advanced"
      v-model:activity-form="rewardedActivityFormObject"
      v-model:campaign-form="campaignFormObject"
    />
  </el-form>

  <pre>{{ campaignFormObject }}</pre>
  <pre>{{ rewardedActivityFormObject }}</pre>

  <debug-wrapper>{{ rewardedActivityFormObject }}</debug-wrapper>
</template>

<script>
import ActivityCreateAdvanced from "@/components/ActivityCreateAdvanced.vue";
import ActivityCreateSimple from "@/components/ActivityCreateSimple.vue";
import CampaignFormObject from "@/common/Form/CampaignFormObject.js";
import ProductFilters from "@/common/Http/ProductFilters.js";
import RewardedActivityFormObject from "@/common/Form/RewardedActivityFormObject.js";
import RewardedActivityValidationBuilder from "@/common/validation/RewardedActivityValidationBuilder.js";
import ValidationHelper from "@/common/validation/ValidationHelper.js";
import { Formatter } from "@/common/Formatter.js";

export default {
  components: {
    ActivityCreateAdvanced,
    ActivityCreateSimple,
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
      advanced: false,
    };
  },
  computed: {
    contract() {
      return this.$store.getters["Contract/getContract"](
        this.campaignFormObject.rewardPoolContract
      );
    },
    Formatter() {
      return Formatter;
    },
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
    advanced() {
      this.rewardedActivityFormObject = new RewardedActivityFormObject();
    },
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
