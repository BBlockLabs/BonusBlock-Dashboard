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
  },
  emits: ["update:modelValue"],
  data() {
    return {
      value: null,
    };
  },
  computed: {
    options: () => Object.values(ActivityAction),
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
      this.$emit(
        "update:modelValue",
        this.options.find((action) => action.getName() === val) || null
      );
    },
  },
};
</script>
