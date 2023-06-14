<template>
  <box-wrapper class="mb-3">
    <h2>Select target product</h2>

    <el-row :gutter="12">
      <el-col :md="12">
        <el-form-item
          label="Network"
          v-bind="ValidationHelper.getFormItemErrorAttributes(campaignValidation['network'])"
        >
          <network-select-field v-model="campaign.network" class="w-100" />
        </el-form-item>
      </el-col>

      <el-col :md="12">
        <el-form-item
          label="Product"
          v-bind="ValidationHelper.getFormItemErrorAttributes(campaignValidation['product'])"
        >
          <product-select-field
            v-model="campaign.product"
            :disabled="!campaign.network"
            class="w-100"
            :filters="productSelectFilter"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="Categories">
      <campaign-tag-select
        v-model="campaign.tags"
        :disabled="!campaign.product"
        :product-id="campaign.product"
        class="w-100"
      />
      <small class="text-muted">
        Categories are utilized for campaign filtering purposes. Ensure that you provide at least one category
      </small>
    </el-form-item>
  </box-wrapper>

  <box-wrapper v-if="campaign.product">
    <h2>Create activity</h2>

    <el-form-item
      label="Select Action"
      v-bind="ValidationHelper.getFormItemErrorAttributes(validate['activityAction'])"
    >
      <activity-action-select
        v-if="activitiesAvailable"
        v-model="activity.activityAction"
        :options="activitiesAvailable"
        class="w-100"
      />
    </el-form-item>

    <div v-if="activity.activityAction && activity.activityAction.name === ActivityAction.SWAP.name">
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
          v-bind="ValidationHelper.getFormItemErrorAttributes(validate['activity'])"
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

        <el-form-item
          v-bind="ValidationHelper.getFormItemErrorAttributes(validate['minimumTransactionLimit'])"
          class="mt-3"
          label="Minimum transaction amount"
        >
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

    <div v-else-if="activity.activityAction && activity.activityAction.name === ActivityAction.DEPOSIT.name">
      <el-form-item v-bind="ValidationHelper.getFormItemErrorAttributes(validate['vault'])">
        <template #label>
          <span class="font-normal">
            Deposit Vault <small class="ml-1 text-muted">Optional</small>
          </span>
        </template>
        <el-select v-model="activity.vault" class="w-100">
          <el-option label="Any vault" value="" />
        </el-select>
      </el-form-item>

      <el-form-item v-bind="ValidationHelper.getFormItemErrorAttributes(validate['minimumDepositLimit'])">
        <template #label>
          <span class="font-normal">
            Minimum deposit limit <small class="ml-1 text-muted">Optional</small>
          </span>
        </template>
        <el-input v-model="activity.minimumDepositLimit" placeholder="0" type="number" min="0" />
        <small class="text-muted">
          Set minimum amount of deposits to count towards the reward
        </small>
      </el-form-item>

      <el-form-item v-bind="ValidationHelper.getFormItemErrorAttributes(validate['depositAmount'])">
        <template #label>
          <span class="font-normal">
            Minimum deposit amount <small class="ml-1 text-muted">Optional</small>
          </span>
        </template>
        <el-input v-model="activity.depositAmount" placeholder="$ 0.00" type="number" min="0" />
        <small class="text-muted">
          Set minimum amount of tokens per deposits to count towards the reward
        </small>
      </el-form-item>

      <el-checkbox v-model="activity.newVaultsOnly" class="mb-4">
        Limit the analysis to newly created vaults only
      </el-checkbox>
    </div>

    <div v-else-if="activity.activityAction && activity.activityAction.name === ActivityAction.CREATE_VAULT.name">
      <el-form-item v-bind="ValidationHelper.getFormItemErrorAttributes(validate['vaultCount'])">
        <template #label>
          <span class="font-normal">
            Number of created vaults
          </span>
        </template>
        <el-input v-model="activity.vaultCount" placeholder="0" type="number" min="1" step="1" />
        <small class="text-muted">
          Set minimum amount of new user vaults to count towards the reward
        </small>
      </el-form-item>
    </div>

    <div v-else-if="activity.activityAction && activity.activityAction.name === ActivityAction.HOLDING.name">
      <el-form-item v-bind="ValidationHelper.getFormItemErrorAttributes(validate['vault'])">
        <template #label>
          <span class="font-normal">
            Holding Vault <small class="ml-1 text-muted">Optional</small>
          </span>
        </template>
        <el-select v-model="activity.vault">
          <el-option label="Any vault" value="" />
        </el-select>
      </el-form-item>

      <el-form-item v-bind="ValidationHelper.getFormItemErrorAttributes(validate['holdingAmount'])">
        <template #label>
          <span class="font-normal">
            Minimum holding amount <small class="ml-1 text-muted">Optional</small>
          </span>
        </template>
        <el-input v-model="activity.holdingAmount" placeholder="$ 0.00" type="number" min="0" />
        <small class="text-muted">
          Set minimum amount of deposits to count towards the reward
        </small>
      </el-form-item>

      <el-form-item v-bind="ValidationHelper.getFormItemErrorAttributes(validate['holdingPeriod'])">
        <template #label>
          <span class="font-normal">
            Holding period
          </span>
        </template>
        <el-input v-model="activity.holdingPeriod" placeholder="0 days" type="number" min="1" />
        <small class="text-muted">
          Set minimum amount of deposit days in order to count towards the reward
        </small>
      </el-form-item>

      <el-checkbox v-model="activity.newVaultsOnly" class="mb-4">
        Limit the analysis to newly created vaults only
      </el-checkbox>
    </div>

    <div v-if="activity.activityAction && campaign.product === 'enzyme'">
      <div class="font-bold">
        Use filtering <el-switch v-model="activity.useFiltering" class="ml-2" />
      </div>

      <el-radio-group
        v-model="activity.filteringType"
        :disabled="!activity.useFiltering"
        class="mt-3" style="flex-direction: column; align-items: flex-start; font-size: inherit; gap: 1.5em"
      >
        <el-radio label="preDate" size="large" style="height: auto; margin-right: 0">
          Pre-date targeting
          <el-form-item v-bind="ValidationHelper.getFormItemErrorAttributes(validate['preDate'])" class="mb-0">
            <el-date-picker
              v-model="activity.preDate"
              :disabled="!activity.useFiltering || activity.filteringType !== 'preDate'"
              :disabled-date="pickerDisableDates"
              class="my-1"
            />
          </el-form-item>
          <small class="text-muted">
            Restrict the campaign exclusively to users who have engaged with the product prior to the specified date
          </small>
        </el-radio>

        <el-radio label="postDate" size="large" style="height: auto">
          Post-date targeting
          <el-form-item v-bind="ValidationHelper.getFormItemErrorAttributes(validate['postDate'])" class="mb-0">
            <el-date-picker
              v-model="activity.postDate"
              :disabled="!activity.useFiltering || activity.filteringType !== 'postDate'"
              :disabled-date="pickerDisableDates"
              class="my-1"
            />
          </el-form-item>
          <small class="text-muted">
            Restrict the campaign exclusively to users who have engaged with the product subsequent to the specified date
          </small>
        </el-radio>
      </el-radio-group>
    </div>
  </box-wrapper>
</template>

<script setup>
import ActivityAction from "@/common/ActivityAction.js";
import ActivityActionSelect from "@/components/ActivityActionSelect.vue";
import ActivityPicker from "@/components/ActivityPicker.vue";
import ActivityTypeSelect from "@/components/ActivityTypeSelect.vue";
import BoxWrapper from "@/components/BoxWrapper.vue";
import CampaignTagSelect from "@/components/CampaignTagSelect.vue";
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
import moment from "moment";

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
    activitiesAvailable: {
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
  methods: {
    pickerDisableDates(date) {
      return moment(date).isSameOrAfter(this.campaign.timeFrame[0], "day");
    },
  },
};
</script>
