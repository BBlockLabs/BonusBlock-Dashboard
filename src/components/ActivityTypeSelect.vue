<template>
  <el-select v-bind="$attrs" v-model="value">
    <el-option
      v-for="option in options"
      :key="option.getName()"
      :label="option.getLabel()"
      :value="option.getName()"
    />
  </el-select>
</template>

<script>
import ActivityAction from "@/common/ActivityAction.js";
import ContractType from "@/common/ContractType.js";
import { toRaw } from "vue";

export default {
  props: {
    action: {
      type: [ActivityAction, null],
      default: null,
    },
    modelValue: {
      type: [ContractType, null],
      default: null,
    },
  },
  emits: ["update:modelValue", "update:action"],
  data() {
    return {
      value: null,
    };
  },
  computed: {
    options() {
      const options = Object.values(ContractType);

      if (!this.action) {
        return options;
      }

      const action = toRaw(this.action);

      return options.filter((type) => type.getAction() === action);
    },
  },
  watch: {
    modelValue: "setValue",
    value: "valueChange",
  },
  created() {
    this.setValue();
  },
  methods: {
    setValue() {
      this.value = this.modelValue?.getName() || null;
    },
    valueChange(val) {
      const type = this.options.find((type) => type.getName() === val) || null;

      this.$emit("update:modelValue", type);

      if (type === null) {
        return;
      }

      this.$emit("update:action", type.getAction());
    },
  },
};
</script>
