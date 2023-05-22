<template>
  <box-wrapper class="mb-3">
    <h2><b>Set target</b></h2>

    <el-row :gutter="12">
      <el-col :md="12">
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
      </el-col>

      <el-col :md="12">
        <el-form-item label="Network">
          <network-select-field v-model="campaign.network" class="w-100" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item
      label="Smart Contract address or name"
      v-bind="ValidationHelper.getFormItemErrorAttributes(validate['activity'])"
    >
      <activity-select-field
        v-model="activity.activity"
        :network-id="campaign.network"
        class="w-100"
      />
    </el-form-item>

    <el-form-item label="Categories">
      <category-select-field
        v-model="campaign.categories"
        class="w-100"
        multiple
      />
    </el-form-item>
  </box-wrapper>

  <box-wrapper v-if="activity.activity">
    <h2><b>Create activities</b></h2>

    <el-form-item
      label="Action"
      v-bind="ValidationHelper.getFormItemErrorAttributes(validate['action'])"
    >
      <el-input v-model="actionSearch" />
    </el-form-item>

    <action-picker
      v-model="activity.action"
      v-model:modelTrxValue="activity.minimumTransactionLimit"
      v-model:modelTrxCount="activity.minimumTransactionCount"
      :activity="activity.activity"
      :filter-string="actionSearch"
    />
  </box-wrapper>
</template>

<script setup>
import BoxWrapper from "@/components/BoxWrapper.vue";
import NetworkSelectField from "@/components/NetworkSelectField.vue";
import CategorySelectField from "@/components/CategorySelectField.vue";
import ActivityActionSelect from "@/components/ActivityActionSelect.vue";
import ActivitySelectField from "@/components/ActivitySelectField.vue";
import ActionPicker from "@/components/ActionPicker.vue";
import ValidationHelper from "@/common/validation/ValidationHelper.js";
</script>

<script>
import CampaignFormObject from "@/common/Form/CampaignFormObject.js";
import RewardedActivityFormObject from "@/common/Form/RewardedActivityFormObject.js";
import RewardedActivityValidationBuilder from "@/common/validation/RewardedActivityValidationBuilder.js";

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
  },
  emits: ["update:campaignForm"],
  data() {
    return {
      actionSearch: "",
      campaign: this.campaignForm,
      activity: this.activityForm,
    };
  },
  computed: {
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
        this.activity = activity;
      },
    },
  },
};
</script>
