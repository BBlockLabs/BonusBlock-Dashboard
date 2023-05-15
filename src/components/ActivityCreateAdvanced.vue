<template>
  <box-wrapper class="mb-3">
    <h2><b>Set target</b></h2>

    <el-row :gutter="12">
      <el-col :md="12">
        <el-form-item label="Select Action">
          <activity-action-select v-model="action" disabled class="w-100" />
        </el-form-item>
      </el-col>

      <el-col :md="12">
        <el-form-item label="Network">
          <network-select-field
            v-model="campaign.network"
            class="w-100"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="Activity">
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

    <el-form-item label="Action">
      <el-input />
    </el-form-item>

    <action-picker
      v-model="activity.action"
      v-model:modelTrxValue="activity.minimumTransactionLimit"
      v-model:modelTrxCount="activity.minimumTransactionCount"
      :activity="activity.activity"
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
      action: ActivityAction.INTERACT,
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
        this.activity = activity;
      },
    },
  },
};
</script>
