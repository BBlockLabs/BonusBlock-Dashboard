<template>
  <div class="b-solid bg-fill-extra-light br-base p-3 package-box">
    <el-row justify="space-between">
      <el-col
        :md="-1"
        class="d-flex"
      >
        <div class="ml-3">
          <b>{{ packageInstance.name }}</b> <br>
          {{ packageInstance.server.url }}
        </div>
      </el-col>

      <el-col :md="-1">
        <el-button
          v-if="$store.getters['DeploymentModule/isCreateDeployment']"
          round
          :type="selected ? 'primary' : ''"
          @click="onSelect"
        >
          Select
        </el-button>
      </el-col>
    </el-row>

    <el-row
      class="mt-3"
      :gutter="24"
    >
      <el-col :span="24">
        <el-row :gutter="24">
          <el-col :md="8">
            <div class="align-center bg-success-9 br-base p-3">
              <div>
                <dashboard-speed class="box-icon" />
              </div>

              <b>
                RAM <br>
                {{ Formatter.formatBytes(packageInstance.ramBytes) }} <br>
              </b>

              <span class="text-secondary">
                {{ packageInstance.server.ramType }}
              </span>
            </div>
          </el-col>

          <el-col :md="8">
            <div class="align-center bg-warning-9 br-base p-3">
              <div>
                <cpu class="box-icon" />
              </div>

              <b>
                CPU <br>
                {{ packageInstance.cpuCoreCount }} Core at
                {{ packageInstance.cpuGHz }} GHz <br>
              </b>

              <span class="text-secondary">
                {{ packageInstance.server.cpuName }}
              </span>
            </div>
          </el-col>

          <el-col :md="8">
            <div class="align-center bg-danger-9 br-base p-3">
              <div>
                <server class="box-icon" />
              </div>

              <b>
                Storage <br>
                {{ Formatter.formatBytes(packageInstance.storageBytes) }} GB <br>
              </b>

              <span class="text-secondary">
                {{ packageInstance.server.storageDriveType }}
              </span>
            </div>
          </el-col>
        </el-row>

        <el-row class="mt-3">
          <el-col>
            <el-space
              class="w-100"
              fill
            >
              <el-row
                class="b-solid br-small p-3"
                justify="space-between"
              >
                <el-col :span="-1">
                  Platform
                </el-col>

                <el-col :span="-1">
                  <b>
                    {{ packageInstance.server.platform }}
                  </b>
                </el-col>
              </el-row>

              <el-row
                class="b-solid br-small p-3"
                justify="space-between"
              >
                <el-col :span="-1">
                  SDK Version
                </el-col>

                <el-col :span="-1">
                  <b>
                    {{ packageInstance.sdkVersion }}
                  </b>
                </el-col>
              </el-row>

              <el-row
                class="b-solid br-small p-3"
                justify="space-between"
              >
                <el-col :span="-1">
                  Kubernetes Version
                </el-col>

                <el-col :span="-1">
                  <b>
                    {{ packageInstance.kubernetesVersion }}
                  </b>
                </el-col>
              </el-row>
            </el-space>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <debug>{{ packageInstance }}</debug>
  </div>
</template>

<script>
import {Formatter} from '@/common/Formatter';
import { DashboardSpeed, Cpu, Server } from 'iconoir-vue';
import Package from '@/state/models/Package';

export default  {
  components: {
    Cpu,
    DashboardSpeed,
    Server,
  },
  props: {
    /**
     * @return {import('@/state/models/Package').Package}
     */
    packageInstance: {
      type: [Package, Object],
      required: true,
    },
    selected: {
      type: Boolean,
    }
  },
  emits: [
    'select',
  ],
  computed: {
    Formatter: () => Formatter,
  },
  methods: {
    onSelect() {
      this.$emit('select', this.packageInstance.id);
    },
    viewServer(serverId) {
      this.$router.push('/server/' + serverId);
    }
  },
};
</script>

<style scoped lang="scss">
.package-box {
  .box-icon {
    height: 48px;
  }
}
</style>
