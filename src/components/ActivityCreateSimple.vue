<template>
  <box-wrapper class="mb-3">
    <h2>Select target product</h2>

    <el-row :gutter="12">
      <el-col :md="12">
        <el-form-item
          label="Network"
          v-bind="
            ValidationHelper.getFormItemErrorAttributes(
              campaignValidation['network']
            )
          "
        >
          <network-select-field v-model="campaign.network" class="w-100" />
        </el-form-item>
      </el-col>

      <el-col :md="12">
        <el-form-item
          label="Product"
          v-bind="
            ValidationHelper.getFormItemErrorAttributes(
              campaignValidation['product']
            )
          "
        >
          <product-select-field
            v-model="campaign.product"
            class="w-100"
            :filters="productSelectFilter"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="Categories">
      <category-select-field
        v-model="campaign.categories"
        class="w-100"
        multiple
      />
    </el-form-item>
  </box-wrapper>

  <box-wrapper v-if="campaign.product">
    <h2>Create activity</h2>

    <el-form-item
      label="Select Action"
      v-bind="
        ValidationHelper.getFormItemErrorAttributes(validate['activityAction'])
      "
    >
      <activity-action-select
        v-model="activity.activityAction"
        disabled
        class="w-100"
      />
    </el-form-item>

    <div v-if="activity.activityAction !== null">
      <el-form-item
        :label="`${activity.activityAction.getLabel()} Type`"
        v-bind="ValidationHelper.getFormItemErrorAttributes(validate['type'])"
      >
        <activity-type-select
          v-model="activity.type"
          v-model:action="activity.activityAction"
          class="w-100"
        />
      </el-form-item>

      <div v-if="activity.type !== null">
        <el-form-item
          v-bind="
            ValidationHelper.getFormItemErrorAttributes(validate['activity'])
          "
          :label="activity.type.getLabel()"
        >
          <el-input
            v-model="filterString"
            placeholder="Search for activity"
            class="mb-3"
          />
        </el-form-item>

        <activity-picker
          v-model="activity.activity"
          :product="campaign.product"
          :type="activity.type"
          :network="campaign.network"
          :filter-string="filterString"
        />

        <el-form-item label="Minimum transaction amount">
          <token-input
            v-model="activity.minimumTransactionLimit"
            :contract="$store.getters['Contract/getContract']('USD')"
          />
          <sup class="text-secondary">
            Set minimum amount of tokens to count towards the reward.
          </sup>
        </el-form-item>
      </div>
    </div>
  </box-wrapper>
</template>

<script setup>
import ActivityActionSelect from "@/components/ActivityActionSelect.vue";
import ActivityPicker from "@/components/ActivityPicker.vue";
import ActivityTypeSelect from "@/components/ActivityTypeSelect.vue";
import BoxWrapper from "@/components/BoxWrapper.vue";
import CategorySelectField from "@/components/CategorySelectField.vue";
import NetworkSelectField from "@/components/NetworkSelectField.vue";
import ProductSelectField from "@/components/ProductSelectField.vue";
import TokenInput from "@/components/TokenInput.vue";
import ValidationHelper from "@/common/validation/ValidationHelper.js";
</script>

<script>
import CampaignFormObject from "@/common/Form/CampaignFormObject.js";
import RewardedActivityFormObject from "@/common/Form/RewardedActivityFormObject.js";
import ProductFilters from "@/common/Http/ProductFilters.js";
import RewardedActivityValidationBuilder from "@/common/validation/RewardedActivityValidationBuilder.js";
import CampaignStep2ValidationBuilder from "@/common/validation/CampaignStep2ValidationBuilder.js";

export default {
  props: {
    campaignForm: {
      type: CampaignFormObject,
      default: new CampaignFormObject(),
    },
    activityForm: {
      type: RewardedActivityFormObject,
      default: new RewardedActivityFormObject(),
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
  emits: ["update:campaignForm"],
  data() {
    return {
      campaign: this.campaignForm,
      activity: this.activityForm,
      filterString: "",
    };
  },
  computed: {
    productSelectFilter() {
      const networkIds = this.campaign.network ? [this.campaign.network] : [];
      return new ProductFilters([], networkIds);
    },
    validate() {
      if (this.validation) {
        return this.validation;
      }

      const validation = RewardedActivityValidationBuilder.createValidation(
        this.activity
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
    campaignForm: {
      deep: true,
      handler(campaignForm) {
        this.campaign = campaignForm;
      },
    },
    campaign: {
      deep: true,
      handler(campaign) {
        this.$emit("update:campaignForm", campaign);
      },
    },
    activityForm: {
      deep: true,
      handler(activity) {
        this.activity = activity;
      },
    },
  },
};
</script>
