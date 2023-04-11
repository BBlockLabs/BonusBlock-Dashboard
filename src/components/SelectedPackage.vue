<template>
  <el-card

    class="b-solid box-card my-2 px-3 selected-card"
    shadow="never"
  >
    <el-row
      justify="space-between"
      class="pb-4"
    >
      <el-col :span="-1">
        {{ selectedPackage.name }}
      </el-col>

      <el-col :span="-1">
        <b>{{ selectedPackage.priceUHost / 1000000 }} $HOST / Month</b>
      </el-col>
    </el-row>

    <el-row
      justify="space-between"
      class="characteristics pb-2"
    >
      <el-col
        :span="-1"
        class="d-flex"
      >
        <cpu class="icon my-auto" />
        <span class="ml-2 my-auto">
          {{ selectedPackage.cpuName }}
          x {{ selectedPackage.cpuCoreCount }}
          Core at
          {{ selectedPackage.cpuGHz }} GHz
        </span>
      </el-col>

      <el-col :span="-1">
        x1
      </el-col>
    </el-row>

    <el-row
      justify="space-between"
      class="characteristics pb-2"
    >
      <el-col
        :span="-1"
        class="d-flex"
      >
        <dashboard-speed class="icon my-auto" />
        <span class="ml-2 my-auto">
          {{ selectedPackage.ramType }}
          RAM
          {{ Formatter.formatBytes(selectedPackage.ramBytes) }}
        </span>
      </el-col>

      <el-col :span="-1">
        x1
      </el-col>
    </el-row>

    <el-row
      justify="space-between"
      class="characteristics pb-2"
    >
      <el-col
        :span="-1"
        class="d-flex"
      >
        <server class="icon my-auto" />
        <span class="ml-2 my-auto">
          {{ selectedPackage.storageDriveType }}
          {{ Formatter.formatBytes(selectedPackage.storageBytes) }}
        </span>
      </el-col>

      <el-col :span="-1">
        x1
      </el-col>
    </el-row>

    <el-row
      v-if="showButtons"
      justify="space-around"
      class="mt-2"
    >
      <el-col :span="-1">
        <el-button
          type="danger"
          size="small"
          plain
          round
          @click="$emit('removeSelected', selectedPackage.id)"
        >
          Remove
        </el-button>
      </el-col>

      <el-col :span="-1">
        <el-button
          type="primary"
          size="small"
          plain
          round
          @click="$emit('viewSelected', selectedPackage.id)"
        >
          View
        </el-button>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import {DashboardSpeed, Cpu, Server} from 'iconoir-vue';
import {Formatter} from '@/common/Formatter';
import Package from '@/state/models/Package';

export default {
  components: {
    DashboardSpeed,
    Cpu,
    Server
  },
  props: {
    selectedPackage: {
      type: [Package, Object],
      required: true
    },
    showButtons: {
      type: Boolean,
      default: true
    }
  },
  emits: [
    'removeSelected',
    'viewSelected',
  ],
  computed: {
    Formatter: () => Formatter,
  },
};
</script>

<style lang="scss">
.selected-card {
  .el-card__body {
    padding: 1em 0;

    svg.icon {
      min-height: 1.75em;
      min-width: 1.75em;
    }
    .el-row.characteristics {
      font-size: 0.85em;
    }
    .el-button {
      width: 8em;
    }
  }
}
</style>
