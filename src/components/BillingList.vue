<template>
  <el-card class="billing-card box-card" shadow="never">
    <el-row align="middle" justify="space-between" class="pb-3">
      <el-col class="title" :span="12">
        <h3>Billing</h3>
      </el-col>
      <el-col :span="12" class="align-right">
        <el-button round>
          Manage <el-icon><arrow-right /></el-icon>
        </el-button>
      </el-col>
    </el-row>

    <div>
      <v-chart class="chart pb-4" :option="option" autoresize />
    </div>

    <el-card shadow="hover" class="billing-info">
      <el-row justify="space-between">
        <el-col :span="12"> Total Balance </el-col>
        <el-col :span="12" class="align-right value"> 4035 $HOST </el-col>
      </el-row>
    </el-card>

    <el-card shadow="hover" class="billing-info">
      <el-row justify="space-between">
        <el-col :span="12"> Deposit </el-col>
        <el-col :span="12" class="align-right value"> 324 $HOST </el-col>
      </el-row>
    </el-card>

    <el-card shadow="hover" class="billing-info">
      <el-row justify="space-between">
        <el-col :span="12"> Next Billing </el-col>
        <el-col :span="12" class="align-right value"> 243 $HOST </el-col>
      </el-row>
    </el-card>

    <el-card shadow="hover" class="billing-info">
      <el-row justify="space-between">
        <el-col :span="12"> Previous Billing </el-col>
        <el-col :span="12" class="align-right value"> 239 $HOST </el-col>
      </el-row>
    </el-card>

    <el-row justify="center" class="mt-4">
      <el-button type="primary" round> Deposit </el-button>
    </el-row>
  </el-card>
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import { TitleComponent } from "echarts/components";
import VChart from "vue-echarts";
import { ref } from "vue";

use([CanvasRenderer, PieChart, TitleComponent]);

export default {
  components: {
    VChart,
  },

  setup() {
    const option = ref({
      title: {
        text: "4035 \n $HOST",
        left: "center",
        top: "center",
        textStyle: {
          color: "#FFFFFF",
        },
      },
      series: [
        {
          type: "pie",
          silent: true,
          radius: ["45%", "100%"],
          avoidLabelOverlap: false,
          color: ["#EE9CAF", "#FEECAC"],
          itemStyle: {
            borderRadius: 5,
            borderColor: "#191919",
            borderWidth: "4",
          },
          label: {
            show: false,
          },
          data: [{ value: 400 }, { value: 735 }],
        },
      ],
    });

    return { option };
  },
};
</script>

<style lang="scss">
.billing-card {
  .el-card__body {
    .chart {
      height: 18em;
    }
    .billing-info {
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      margin-bottom: 0.75em;

      .el-card__body {
        padding: 0.75em 1em;

        .value {
          font-weight: bold;
        }
      }
    }
  }
}
</style>
