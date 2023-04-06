<template>
  <page-wrapper>
    <el-row>
      <el-col>
        <h2>Step 1</h2>

        <box-wrapper class="p-medium">
          <rewarded-activity-form
            :ref="
              (el) => {
                rewardedActivityForm = el;
              }
            "
          />

          <el-row justify="end">
            <el-col :span="-1">
              <el-button
                type="primary"
                @click="addedRewardedActivities.push(new RewardedActivity())"
              >
                Add
              </el-button>
            </el-col>
          </el-row>
        </box-wrapper>

        <box-wrapper
          v-for="(rewardedActivity, idx) in addedRewardedActivities"
          class="p-medium"
        >
          <el-row justify="end">
            <el-col :span="-1">
              <el-button
                type="danger"
                @click="addedRewardedActivities.splice(idx, 1)"
              >
                Remove
              </el-button>
            </el-col>
          </el-row>

          <el-row>
            <el-col>
              <pre>{{ rewardedActivity }}</pre>
            </el-col>
          </el-row>
        </box-wrapper>

        <el-button type="success"> Go to step 2 </el-button>
      </el-col>
    </el-row>

    <el-row>
      <el-col>
        <h2>Step 2</h2>

        <campaign-form
          :ref="
            (el) => {
              campaignForm = el;
            }
          "
        />
      </el-col>
    </el-row>
  </page-wrapper>
</template>

<script setup lang="ts">
import PageWrapper from "@/components/PageWrapper.vue";
import CampaignForm from "@/components/Campaign/CampaignForm.vue";
import RewardedActivityForm from "@/components/Campaign/RewardedActivityForm.vue";
import BoxWrapper from "@/components/BoxWrapper.vue";
import RewardedActivity from "@/store/entity/RewardedActivity";
import type { Ref } from "vue";
import { ref } from "vue";

const rewardedActivityForm: Ref<RewardedActivityForm> = ref();
const campaignForm: Ref<CampaignForm> = ref();

const addedRewardedActivities: Ref<Array<RewardedActivity>> = ref([]);

function addRewardedActivity(idx: number): void {}
</script>
