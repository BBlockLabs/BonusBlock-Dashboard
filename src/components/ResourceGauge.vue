<template>
  <el-row justify="space-between" align="bottom" class="pb-3">
    <el-col :span="-1">
      <component :is="typeProps.icon" class="gauge-icon icon" />
      {{ title }}
    </el-col>
    <el-col :span="-1">
      <b>
        {{ typeProps.valueFunction(current) }}
        /
        {{ typeProps.valueFunction(max) }}
      </b>
    </el-col>
  </el-row>

  <el-progress
    :show-text="false"
    :status="typeProps.color"
    :percentage="percentage"
    :class="$props.class"
  />
</template>

<script>
import { DashboardSpeed, Cpu, Server } from "iconoir-vue";
import { Formatter } from "@/common/Formatter";

export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      validator: (value) => ["cpu", "ram", "storage"].indexOf(value) >= 0,
    },
    current: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
    class: {
      type: String,
      default: "",
    },
  },
  computed: {
    /**
     * @return {{
     *  valueFunction: ((function(Number): string)),
     *  icon: RenderFunction,
     *  color: string
     * }}
     */
    typeProps() {
      switch (this.type) {
        case "ram":
          return {
            color: "success",
            icon: DashboardSpeed,
            valueFunction: Formatter.formatBytes,
          };
        case "storage":
          return {
            color: "exception",
            icon: Server,
            valueFunction: Formatter.formatBytes,
          };
        case "cpu":
          return {
            color: "warning",
            icon: Cpu,
            valueFunction: (value) => `${value} vCPU`,
          };
        default:
          return {
            color: "primary",
            icon: DashboardSpeed,
            valueFunction: (value) => value,
          };
      }
    },
    percentage() {
      return Math.round((this.current * 100) / this.max);
    },
  },
};
</script>

<style lang="scss">
.gauge-icon {
  position: relative;
  top: 0.25em;
  zoom: 150%;
}
</style>
