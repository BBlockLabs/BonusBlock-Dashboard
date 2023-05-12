<template>
  <box-wrapper>
    <h2>Select target product</h2>

    <el-row>
      <el-col :md="12">
        <el-form-item label="Network">
          <network-select-field v-model="campaign.network" class="w-100"/>
        </el-form-item>
      </el-col>

      <el-col :md="12">
        <el-form-item label="Product">
          <product-select-field
            class="w-100"
            v-model="campaign.product"
            :filters="new ProductFilters([], [campaign.network])"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="Categories">
      <category-select-field
        class="w-100"
        v-model="campaign.categories"
        multiple
      />
    </el-form-item>
  </box-wrapper>

  <box-wrapper v-if="campaign.product">
    <h2>Create activity</h2>

    <el-form-item label="Select Action">
      <activity-action-select v-model="action" disabled class="w-100"/>
    </el-form-item>

    <div v-if="action !== null">
      <el-form-item :label="`${action.getLabel()} Type`">
        <activity-type-select v-model="type" v-model:action="action" class="w-100" />
      </el-form-item>

      <div v-if="type !== null">
        <el-form-item :label="type.getLabel()">
          <el-input
            v-model="filterString"
            placeholder="Search for activity"
            class="mb-3"
          />
        </el-form-item>

        <activity-picker
          :product="campaign.product"
          :type="type"
          :network="campaign.network"
          :filter-string="filterString"
        />

        <el-form-item
          label="Minimum transaction amount"
        >
          <token-input
            v-model="activity.minimumTransactionCount"
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
import ActivityType from "@/common/ActivityType.js";
import ActivityTypeSelect from "@/components/ActivityTypeSelect.vue";
import BoxWrapper from "@/components/BoxWrapper.vue";
import CategorySelectField from "@/components/CategorySelectField.vue";
import NetworkSelectField from "@/components/NetworkSelectField.vue";
import ProductFilters from "@/common/Http/ProductFilters.js";
import ProductSelectField from "@/components/ProductSelectField.vue";
import TokenInput from "@/components/TokenInput.vue";
import ValidationHelper from "@/common/validation/ValidationHelper.js";
</script>

<script>
import ActivityAction from "@/common/ActivityAction.js";
import CampaignFormObject from "@/common/Form/CampaignFormObject.js";
import RewardedActivityFormObject from "@/common/Form/RewardedActivityFormObject.js";

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
  },
  emits: ["update:campaignForm"],
  data() {
    return {
      campaign: this.campaignForm,
      activity: this.activityForm,
      filterString: "",
      action: ActivityAction.SWAP,
      type: null,
    };
  },
  watch: {
    campaignForm: {
      deep: true,
      handler(campaignForm) {
        this.campaign = campaignForm;
      },
    },
    activityForm: {
      deep: true,
      handler(activity) {
        this.campaign = activity;
      },
    },
  },
};
</script>
