<template>
  <el-card class="box-card deployment-card" shadow="never">
    <el-row align="middle" justify="space-between" class="pb-3">
      <el-col class="title" :span="12">
        <h3>Deployment Name</h3>
        Deployment ID
      </el-col>
      <el-col :span="12" class="align-right">
        <el-button round> Manage > </el-button>
      </el-col>
    </el-row>

    <el-row class="characteristics pb-4" :gutter="15">
      <el-col :span="8">
        <resource-gauge title="RAM" :max="128" :current="32" type="ram" />
      </el-col>

      <el-col :span="8">
        <resource-gauge title="CPU" :max="100" :current="10" type="cpu" />
      </el-col>

      <el-col :span="8">
        <resource-gauge
          title="Storage"
          :max="1024"
          :current="10"
          type="storage"
        />
      </el-col>
    </el-row>

    <el-row class="info pl-4" align="middle">
      <el-col
        class="align-items-center d-flex gap-2"
        :lg="7"
        :xl="4"
        :xs="7"
        :md="7"
        :sm="7"
      >
        <span class="dot" /> provider.altermail.live
      </el-col>
      <el-col
        class="align-items-center d-flex gap-2"
        :lg="7"
        :xl="4"
        :xs="7"
        :md="7"
        :sm="7"
      >
        <piggy-bank class="icon" /> Balance: <b>41.3 $ALTR</b>
      </el-col>
      <el-col
        class="align-items-center d-flex gap-2"
        :lg="7"
        :xl="4"
        :xs="7"
        :md="7"
        :sm="7"
      >
        <money-square class="icon" /> Next billing: <b>34 $ALTR</b>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { PiggyBank, MoneySquare } from "iconoir-vue";
import ResourceGauge from "@/components/ResourceGauge.vue";

export default {
  components: {
    ResourceGauge,
    PiggyBank,
    MoneySquare,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss">
.deployment-card {
  min-width: 50em;

  .el-card__body {
    .info {
      .dot {
        height: 0.75em;
        width: 0.75em;
        background-color: #89e7c0;
        border-radius: 50%;
        display: inline-block;
        margin-top: 0.4em;
      }
      svg.icon {
        zoom: 150%;
      }
    }
  }
}
</style>
