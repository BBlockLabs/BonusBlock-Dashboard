<template>
  <el-form>
    <el-form-item label="Select Product">
      <el-form-item label="Categories">
        <category-select-field multiple />
      </el-form-item>

      <el-form-item label="Network">
        <network-select-field />
      </el-form-item>

      <el-form-item label="Product">
        <product-select-field />
      </el-form-item>
    </el-form-item>

    <el-form-item
      v-bind="ValidationHelper.getFormItemErrorAttributes(validate['activity'])"
      label="Select activity"
    >
      <el-collapse v-model="rewardedActivity.activity" accordion>
        <el-collapse-item
          v-for="activity in activities"
          :key="activity.hash"
          :name="activity.hash"
        >
          <template #title>
            {{ activity.name }} - {{ activity.hash }}
          </template>

          <el-row
            v-for="action in activity.actions"
            :key="action.hash"
            justify="space-between"
          >
            <el-col :span="-1">
              {{ action.name }}
              <br />
              {{ action.hash }} (function hash)
            </el-col>

            <el-col :span="-1">
              <input
                v-model="rewardedActivity.action"
                type="radio"
                :value="action.hash"
              />
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </el-form-item>

    <el-form-item label="Set requirements">
      <el-form-item
        v-bind="
          ValidationHelper.getFormItemErrorAttributes(
            validate['minimumTransactionLimit']
          )
        "
        label="Set minimum transaction limit"
      >
        <el-input-number v-model="rewardedActivity.minimumTransactionLimit" />
      </el-form-item>
    </el-form-item>
  </el-form>

  <debug-wrapper>{{ rewardedActivity }}</debug-wrapper>
</template>

<script>
import CategorySelectField from "@/components/CategorySelectField.vue";
import NetworkSelectField from "@/components/NetworkSelectField.vue";
import ProductSelectField from "@/components/ProductSelectField.vue";
import RewardedActivity from "@/state/models/RewardedActivity.js";
import RewardedActivityValidationBuilder from "@/common/validation/RewardedActivityValidationBuilder.js";
import ValidationHelper from "@/common/validation/ValidationHelper.js";

export default {
  components: {
    CategorySelectField,
    NetworkSelectField,
    ProductSelectField,
  },
  props: {
    modelValue: {
      type: RewardedActivity,
      default: () => new RewardedActivity(),
    },
    validation: {
      type: Object,
      default: () => null,
    },
  },
  emits: ["submit", "update:modelValue"],
  /**
   * @returns {{rewardedActivity: RewardedActivity, validate: Object}}
   */
  data() {
    return {
      rewardedActivity: this.modelValue,
      activities: [
        {
          name: "ETH - ANT",
          hash: "0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95",
          actions: [
            {
              name: "Swap",
              hash: "68027e43",
            },
          ],
        },
        {
          name: "ETH - DAI",
          hash: "0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d96",
          actions: [
            {
              name: "Swap",
              hash: "68027e43",
            },
          ],
        },
      ],
    };
  },
  computed: {
    ValidationHelper: () => ValidationHelper,
    validate() {
      if (this.validation) {
        return this.validation;
      }

      const validation = RewardedActivityValidationBuilder.createValidation(
        this.rewardedActivity
      );

      validation.$lazy = true;

      return validation;
    },
  },
  watch: {
    modelValue() {
      this.rewardedActivity = this.modelValue;
    },
    rewardedActivity: {
      deep: true,
      handler() {
        this.$emit("update:modelValue", this.rewardedActivity);
      },
    },
  },
};
</script>
