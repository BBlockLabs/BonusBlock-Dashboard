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
        Advanced mode
        <el-switch
          :model-value="advanced"
          @update:model-value="changeAdvanced"
        />
      </el-col>
    </el-row>

    <activity-create-simple
      v-if="!advanced"
      v-model:activity-form="rewardedActivityFormObject"
      v-model:campaign-form="campaignFormObject"
      :validation="validate"
    />

    <activity-create-advanced
      v-if="advanced"
      v-model:activity-form="rewardedActivityFormObject"
      v-model:campaign-form="campaignFormObject"
      :validation="validate"
    />

    <div class="d-flex">
      <el-button
        v-if="rewardedActivityFormObject.activity || campaignFormObject.product"
        class="ml-auto mt-2"
        @click="clear"
      >
        Clear
      </el-button>
    </div>
  </el-form>

  <debug-wrapper>{{ campaignFormObject }}</debug-wrapper>
  <debug-wrapper>{{ rewardedActivityFormObject }}</debug-wrapper>
  <debug-wrapper>{{ validate }}</debug-wrapper>
</template>

<script>
import ActivityCreateAdvanced from "@/components/ActivityCreateAdvanced.vue";
import ActivityCreateSimple from "@/components/ActivityCreateSimple.vue";
import CampaignFormObject from "@/common/Form/CampaignFormObject.js";
import RewardedActivityFormObject from "@/common/Form/RewardedActivityFormObject.js";
import RewardedActivityValidationBuilder from "@/common/validation/RewardedActivityValidationBuilder.js";
import ActivityAction from "@/common/ActivityAction.js";

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
    "campaignFormObject.product"(productId) {
      if (!productId) {
        return;
      }

      const product = this.$store.getters["Product/getProduct"](productId);

      if (product === null) {
        return;
      }

      this.campaignFormObject.categories = product.categories;
    },
    modelValue() {
      this.rewardedActivityFormObject = this.modelValue;

      this.rewardedActivityFormObject.activityAction = this.advanced
        ? ActivityAction.INTERACT
        : ActivityAction.SWAP;
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
  created() {
    if (this.rewardedActivityFormObject.action) {
      this.advanced = true;

      this.rewardedActivityFormObject.activityAction = this.advanced
        ? ActivityAction.INTERACT
        : ActivityAction.SWAP;
    }
  },
  methods: {
    clear() {
      this.rewardedActivityFormObject.activity = null;
      this.rewardedActivityFormObject.action = null;
      this.rewardedActivityFormObject.type = null;
      this.rewardedActivityFormObject.minimumTransactionLimit = "0";
      this.rewardedActivityFormObject.minimumTransactionCount = 0;
      this.rewardedActivityFormObject.activityAction = this.advanced
        ? ActivityAction.INTERACT
        : ActivityAction.SWAP;

      this.campaignFormObject.product = null;
    },
    changeAdvanced(advanced) {
      this.advanced = advanced;

      this.clear();
    },
  },
};
</script>
