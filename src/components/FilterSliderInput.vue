<template>
  <el-row>
    <el-slider
      v-model="range"
      range
      :show-tooltip="false"
      :min="min"
      :max="max"
      :step="step"
    />
    <el-space :size="10">
      <el-input v-model="rangeMin" placeholder="From" size="small" />
      <el-input v-model="rangeMax" placeholder="To" size="small" />
    </el-space>
  </el-row>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Array,
      required: true,
    },
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
    step: {
      type: Number,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      rangeMin: this.modelValue[0] || this.min,
      rangeMax: this.modelValue[1] || this.max,
      range: [this.modelValue[0] || this.min, this.modelValue[1] || this.max],
    };
  },
  watch: {
    range() {
      this.rangeMin = this.range[0];
      this.rangeMax = this.range[1];
      this.$emit("update:modelValue", this.range);
    },
    rangeMin() {
      if (this.rangeMin === "") {
        this.rangeMin = this.min;
      }
      this.range[0] = parseInt(this.rangeMin);
    },
    rangeMax() {
      if (this.rangeMax === "") {
        this.rangeMax = this.max;
      }
      this.range[1] = parseInt(this.rangeMax);
    },
  },
};
</script>
