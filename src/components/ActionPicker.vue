<template>
  <el-collapse v-model="value" accordion class="br-base b-solid">
    <el-collapse-item
      v-for="(action, idx) in actions"
      :key="action.id"
      :class="{ 'bt-solid': idx !== 0 }"
      :name="action.id"
    >
      <template #title>
        <div class="p-3">
          <b>{{ action.name || "Unnamed" }}</b>
          <br />
          0x{{ action.hash }}
        </div>
      </template>

      <div class="p-3 bt-solid">
        <div class="d-flex w-100">
          <div class="ml-2 my-auto pb-3">
            <el-checkbox
              :model-value="allowCount"
              class="ml-1"
              @update:model-value="changeAllowCount"
            >
              &nbsp;
            </el-checkbox>
          </div>

          <el-form-item class="w-100" label="Minimum transaction limit">
            <el-input v-model="transactionCount" :disabled="!allowCount" />
            <sup class="text-secondary">
              Set minimum amount of transactions to count towards the reward.
            </sup>
          </el-form-item>
        </div>

        <div class="d-flex w-100">
          <div class="ml-2 my-auto pb-3">
            <el-checkbox
              :model-value="allowValue"
              class="ml-1"
              @update:model-value="changeAllowValue"
            >
              &nbsp;
            </el-checkbox>
          </div>

          <el-form-item class="w-100" label="Minimum transaction amount">
            <token-input
              v-model="transactionValue"
              :disabled="!allowValue"
              :contract="$store.getters['Contract/getContract']('USD')"
            />
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
import TokenInput from "@/components/TokenInput.vue";

export default {
  components: {
    TokenInput,
  },
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
    modelTrxValue: {
      type: [BigInt, String, null],
      default: null,
    },
    modelTrxCount: {
      type: [Number, String, null],
      default: null,
    },
  },
  emits: ["update:modelValue", "update:modelTrxCount", "update:modelTrxValue"],
  data() {
    return {
      allowCount: false,
      allowValue: false,
      transactionValue: this.modelTrxValue,
      transactionCount: this.modelTrxCount,
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
    modelAmount: "setValuesFromProps",
    modelTrxCount: "setValuesFromProps",
    modelTrxValue: "setValuesFromProps",
    transactionValue() {
      this.$emit("update:modelTrxValue", this.transactionValue);
    },
    transactionCount() {
      this.$emit("update:modelTrxCount", this.transactionCount);
    },
    value() {
      this.$emit("update:modelValue", this.value);
    },
  },
  created() {
    this.setValuesFromProps();
  },
  methods: {
    changeAllowValue(allow) {
      this.allowValue = allow;

      if (!this.allowValue) {
        this.transactionValue = "";
      }
    },
    changeAllowCount(allow) {
      this.allowCount = allow;

      if (!this.allowCount) {
        this.transactionCount = "";
      }
    },
    setValuesFromProps() {
      this.transactionValue = this.modelTrxValue;
      this.transactionCount = this.modelTrxCount;
      this.value = this.modelValue;

      this.allowCount = !!this.modelTrxCount;
      this.allowValue = !!this.modelTrxValue;
    },
  },
};
</script>
