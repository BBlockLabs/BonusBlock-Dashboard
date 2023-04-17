<template>
  <el-input
    v-model="value.link"
    placeholder="Please input"
    class="input-with-select"
  >
    <template #prepend>
      <el-select v-model="value.type" placeholder="Select">
        <el-option label="Discord" value="discord" />
        <el-option label="Twitter" value="twitter" />
      </el-select>
    </template>
  </el-input>
</template>

<script>
import Social from "@/state/models/Social.js";

export default {
  props: {
    modelValue: {
      type: Social,
      default: () => new Social(),
    },
  },
  emits: ["modelValue:update"],
  data() {
    return {
      value: this.modelValue,
    };
  },
  watch: {
    value: {
      deep: true,
      handler() {
        this.$emit("modelValue:update", this.value);
      },
    },
    modelValue: {
      deep: true,
      handler() {
        this.value = this.modelValue;
      },
    },
  },
};
</script>
