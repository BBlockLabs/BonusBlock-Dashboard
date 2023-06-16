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

export default {
  props: {
    modelValue: {
      type: [ActivityAction, null],
      default: null,
    },
    options: {
      type: Array,
      default: Object.values(ActivityAction),
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      value: null,
    };
  },
  watch: {
    modelValue: "setValue",
    value: "valueChange",
    options: "setValue",
  },
  created() {
    this.setValue();
  },
  methods: {
    setValue() {
      if (this.modelValue) {
        const found = this.options.find((action) => action.getName() === this.modelValue.getName());
        this.value = found ? found.getName() : null;
      } else {
        this.value = null;
      }
    },
    valueChange(val) {
      this.$emit(
        "update:modelValue",
        this.options.find((action) => action.getName() === val) || null
      );
    },
  },
};
</script>
