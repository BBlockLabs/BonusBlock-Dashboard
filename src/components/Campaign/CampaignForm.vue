<template>
  <el-form v-model="campaign" @submit.prevent="onSubmit">
    <el-form-item
      v-bind="ValidationHelper.getFormItemErrorAttributes(validate.name)"
      label="Name"
    >
      <el-input v-model="campaign.name" placeholder="Name"/>
    </el-form-item>

    <el-form-item label="Set frequency ratio">
      <el-form-item
        v-bind="ValidationHelper.getFormItemErrorAttributes(validate.frequencyRatioDaily)"
        label="Daily"
      >
        <el-input
          v-model="campaign.frequencyRatioDaily"
          placeholder="Daily frequency ratio"
        />
      </el-form-item>

      <el-form-item
        v-bind="ValidationHelper.getFormItemErrorAttributes(validate.frequencyRatioWeekly)"
        label="Weekly"
      >
        <el-input
          v-model="campaign.frequencyRatioWeekly"
          placeholder="Weekly frequency ratio"/>
      </el-form-item>

      <el-form-item
        v-bind="ValidationHelper.getFormItemErrorAttributes(validate.frequencyRatioMonthly)"
        label="Monthly"
      >
        <el-input
          v-model="campaign.frequencyRatioMonthly"
          placeholder="Monthly frequency ratio"/>
      </el-form-item>
    </el-form-item>

    <el-form-item
      v-bind="ValidationHelper.getFormItemErrorAttributes(validate.rewardPool)"
      label="Reward pool"
    >
      <el-input
        v-model="campaign.rewardPool"
        placeholder="Reward pool"
      />
    </el-form-item>

    <el-form-item
      v-bind="{
        ...ValidationHelper.getFormItemErrorAttributes(validate.timeFrameFrom),
        ...ValidationHelper.getFormItemErrorAttributes(validate.timeFrameTill),
      }"
      label="Time frame"
    >
      <el-date-picker
        v-model="timeFrame"
        type="daterange"
      />
    </el-form-item>

    <el-form-item
      v-bind="ValidationHelper.getFormItemErrorAttributes(validate.weeklyEqualDistribution)"
      label="Weekly equal distribution?"
    >
      <el-switch
        v-model="campaign.weeklyEqualDistribution"
      />
    </el-form-item>

    <el-form-item
      v-bind="ValidationHelper.getFormItemErrorAttributes(validate.expectedRoi)"
      label="Expected ROI"
    >
      <el-input
        v-model="campaign.expectedRoi"
        placeholder="Expected ROI"
      />
    </el-form-item>

<!--    <pre>{{ campaign }}</pre>-->
<!--    <pre>{{ validate }}</pre>-->
  </el-form>
</template>

<script setup lang="ts">
import type {Ref, WritableComputedRef} from "vue";
import { computed, ref } from "vue";
import Campaign from "@/store/entity/Campaign";
import { numeric, integer, required, between, minLength, maxLength } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import ValidationHelper from "@/common/ValidationHelper";

const rules = {
  name: {
    required,
    minLength: minLength(3),
    maxLength: maxLength(255),
  },
  frequencyRatioDaily: {
    required,
    numeric,
    between: between(0, 1)
  },
  frequencyRatioWeekly: {
    required,
    numeric,
    between: between(0, 1)
  },
  frequencyRatioMonthly: {
    required,
    numeric,
    between: between(0, 1)
  },
  rewardPool: {
    required,
    integer
  },
  timeFrameFrom: {
    required
  },
  timeFrameTill: {
    required
  },
  weeklyEqualDistribution: {
    required
  },
  expectedRoi: {
    required,
    integer
  },
}

const campaign: Ref<Campaign> = ref(new Campaign());

const validate = useVuelidate(rules, campaign)

const timeFrame: WritableComputedRef<[Date, Date]> = computed({
  get: (): [Date, Date] => [
    campaign.value.timeFrameFrom,
    campaign.value.timeFrameTill,
  ],
  set: (val: [Date, Date]): void => {
    campaign.value.timeFrameFrom = val[0];
    campaign.value.timeFrameTill = val[1];
  },
});

validate.value.$touch();

console.log(validate.value);

function onSubmit(): void {
  // emit
}

</script>
