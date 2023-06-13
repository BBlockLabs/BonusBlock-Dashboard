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
      :campaign-validation="campaignValidate"
      :activities-available="activitiesAvailable"
    />

    <activity-create-advanced
      v-if="advanced"
      v-model:activity-form="rewardedActivityFormObject"
      v-model:campaign-form="campaignFormObject"
      :validation="validate"
      :campaign-validation="campaignValidate"
      :activities-available="activitiesAvailable"
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

  <debug-wrapper>campaignFormObject: {{ campaignFormObject }}</debug-wrapper>
  <debug-wrapper
    >rewardedActivityFormObject: {{ rewardedActivityFormObject }}</debug-wrapper
  >
  <debug-wrapper>campaignValidate: {{ campaignValidate }}</debug-wrapper>
  <debug-wrapper>validate: {{ validate }}</debug-wrapper>
</template>

<script>
import ActivityCreateAdvanced from "@/components/ActivityCreateAdvanced.vue";
import ActivityCreateSimple from "@/components/ActivityCreateSimple.vue";
import CampaignFormObject from "@/common/Form/CampaignFormObject.js";
import RewardedActivityFormObject from "@/common/Form/RewardedActivityFormObject.js";
import RewardedActivityValidationBuilder from "@/common/validation/RewardedActivityValidationBuilder.js";
import CampaignStep2ValidationBuilder from "@/common/validation/CampaignStep2ValidationBuilder.js";
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
    campaignValidation: {
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
    activitiesAvailable() {
      const product = this.$store.getters["Product/getProduct"](this.campaign.product);
      if (!product) {
        return [];
      }
      return Object.values(ActivityAction).filter(action => product.actions.indexOf(action.getName()) !== -1);
    },
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
    campaignValidate() {
      if (this.campaignValidation) {
        return this.campaignValidation;
      }

      const campaignValidation =
        CampaignStep2ValidationBuilder.createValidation(
          this.campaignFormObject
        );

      campaignValidation.$lazy = true;

      return campaignValidation;
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
        const product = this.$store.getters["Product/getProduct"](productId);

        if (product === null) {
          return;
        }
      }

      this.campaignFormObject.categories = product.categories;
    },
    modelValue() {
      this.rewardedActivityFormObject = this.modelValue;

      this.campaignFormObject.advanced = this.advanced;
      this.rewardedActivityFormObject.advanced = this.advanced;
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
    if (this.rewardedActivityFormObject.actions.length > 0) {
      this.advanced = true;
      this.campaignFormObject.advanced = this.advanced;
      this.rewardedActivityFormObject.advanced = this.advanced;

      this.rewardedActivityFormObject.activityAction = this.advanced
        ? ActivityAction.INTERACT
        : ActivityAction.SWAP;
    }
  },
  methods: {
    clear() {
      this.rewardedActivityFormObject.activity = null;
      this.rewardedActivityFormObject.actions = [];
      this.rewardedActivityFormObject.type = null;
      this.rewardedActivityFormObject.minimumTransactionLimit = "0";
      this.rewardedActivityFormObject.minimumTransactionCount = 0;
      this.rewardedActivityFormObject.activityAction = this.advanced
        ? ActivityAction.INTERACT
        : ActivityAction.SWAP;

      this.campaignFormObject.product = null;
      this.campaignFormObject.advanced = this.advanced;
      this.rewardedActivityFormObject.advanced = this.advanced;
    },
    changeAdvanced(advanced) {
      this.advanced = advanced;
      this.campaignFormObject.advanced = this.advanced;
      this.rewardedActivityFormObject.advanced = this.advanced;

      this.clear();
    },
  },
};
</script>
