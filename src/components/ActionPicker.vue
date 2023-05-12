<template>

  <el-collapse
    v-model="value"
    accordion
    class="br-base b-solid"
  >
    <el-collapse-item
      v-for="(action, idx) in actions"
      :key="action.id"
      :class="{ 'bt-solid': idx !== 0 }"
    >
      <template #title>
        <div class="p-3">
          <b>{{ action.name }}</b>
          <br />
          0x{{ action.hash }}
        </div>
      </template>

      <div class="p-3 bt-solid">
        <div class="d-flex w-100">
          <div class="ml-2 my-auto pb-3">
            <el-checkbox v-model="allowLimit" class="ml-1">&nbsp;</el-checkbox>
          </div>

          <el-form-item class="w-100" label="Minimum transaction limit">
            <el-input v-model="limit" :disabled="!allowLimit" />
            <sup class="text-secondary">
              Set minimum amount of transactions to count towards the reward.
            </sup>
          </el-form-item>
        </div>

        <div class="d-flex w-100">
          <div class="ml-2 my-auto pb-3">
            <el-checkbox v-model="allowAmount" class="ml-1">&nbsp;</el-checkbox>
          </div>

          <el-form-item class="w-100" label="Minimum transaction amount">
            <el-input v-model="amount" :disabled="!allowAmount" />
            <sup class="text-secondary">
              Set minimum amount of tokens to count towards the reward.
            </sup>
          </el-form-item>
        </div>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<script>

export default {
  props: {
    activity: {
      type: [String, null],
      default: null,
    },
    filterString: {
      type: String,
      default: "",
    },
    modelValue: {
      type: [String, null],
      default: null,
    },
    modelLimit: {
      type: [BigInt, String, null],
      default: null,
    },
    modelAmount: {
      type: [Number, null],
      default: null,
    },
  },
  emits: ["update:modelAmount", "update:modelLimit", "update:modelValue"],
  data() {
    return {
      allowLimit: false,
      allowAmount: false,
      amount: null,
      limit: null,
      value: this.modelValue,
    };
  },
  computed: {
    actions() {
      return this.$store.getters["Activity/queryActions"]({
        activity: this.activity,
        queryString: this.filterString,
      });
    },
  },
  watch: {
    modelAmount() {
      this.amount = this.modelAmount;
    },
    modelLimit() {
      this.limit = this.modelLimit;
    },
    modelValue() {
      this.value = this.modelValue;
    },
    amount() {
      this.$emit("update:modelAmount", this.amount);
    },
    limit() {
      this.$emit("update:modelLimit", this.limit);
    },
    value() {
      this.$emit("update:modelValue", this.value);
    },
  },
};
</script>
