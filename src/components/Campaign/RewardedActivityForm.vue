<template>
  <el-form v-model="campaign" @submit.prevent="onSubmit">
    <el-form-item
      v-bind="ValidationHelper.getFormItemErrorAttributes(validate.product)"
      label="Product"
    >
      <el-input v-model="rewardedActivity.product" placeholder="Product" />
    </el-form-item>

    <el-form-item
      v-bind="ValidationHelper.getFormItemErrorAttributes(validate.action)"
      label="Action"
    >
      <el-input v-model="rewardedActivity.action" placeholder="Action" />
    </el-form-item>

    <el-form-item
      v-bind="
        ValidationHelper.getFormItemErrorAttributes(validate.minimumAmount)
      "
      label="Minimum amount"
    >
      <el-input
        v-model="rewardedActivity.minimumAmount"
        placeholder="Minimum amount"
      />
    </el-form-item>

    <el-form-item
      v-bind="ValidationHelper.getFormItemErrorAttributes(validate.bonusAmount)"
      label="Bonus amount"
    >
      <el-input
        v-model="rewardedActivity.bonusAmount"
        placeholder="Bonus amount"
      />
    </el-form-item>
    <!--    <pre>{{ rewardedActivity }}</pre>-->
    <!--    <pre>{{ validate }}</pre>-->
  </el-form>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import { ref } from "vue";
import { integer, required, minValue } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import ValidationHelper from "@/common/ValidationHelper";
import RewardedActivity from "@/store/entity/RewardedActivity";

const rules = {
  product: {
    required,
  },
  action: {
    required,
  },
  minimumAmount: {
    required,
    integer,
    minValue: minValue(1),
  },
  bonusAmount: {
    required,
    integer,
    minValue: minValue(1),
  },
};

const rewardedActivity: Ref<RewardedActivity> = ref(new RewardedActivity());

const validate = useVuelidate(rules, rewardedActivity);

validate.value.$touch();

console.log(validate.value);

function onSubmit(): void {
  // emit
}
</script>
