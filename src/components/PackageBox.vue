<template>
  <div class="b-solid bg-fill-extra-light br-base p-3">
    <el-row justify="space-between">
      <el-col :md="-1" class="d-flex">
        <avatar :file="packageInstance.server.icon" />
        <div class="ml-3">
          <b>{{ packageInstance.name }}</b> <br />
          {{ packageInstance.server.url }}
        </div>
      </el-col>

      <el-col :md="-1">
        <el-button round @click="viewServer(packageInstance.server.id)">
          See more >
        </el-button>

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

    <el-row class="mt-3" :gutter="24">
      <el-col :md="8">
        <el-space class="w-100" fill>
          <el-row class="b-solid br-small p-3" justify="space-between">
            <el-col :span="-1"> Price </el-col>

            <el-col :span="-1">
              <b> {{ packageInstance.priceUHost / 1000000 }} $HOST </b>
            </el-col>
          </el-row>

          <el-row class="b-solid br-small p-3" justify="space-between">
            <el-col :span="-1"> Location </el-col>

            <el-col :span="-1">
              <b>
                {{ packageInstance.server.location.country }}
              </b>
            </el-col>
          </el-row>

          <el-row class="b-solid br-small p-3" justify="space-between">
            <el-col :span="-1"> Platform </el-col>

            <el-col :span="-1">
              <b>
                {{ packageInstance.server.platform }}
              </b>
            </el-col>
          </el-row>
        </el-space>
      </el-col>

      <el-col :md="16">
        <el-row :gutter="24">
          <el-col :md="8">
            <div class="align-center bg-success-9 br-base p-3">
              <div>
                <dashboard-speed class="box-icon" />
              </div>

              <b>
                RAM <br />
                {{ Formatter.formatBytes(packageInstance.ramBytes) }} <br />
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
                CPU <br />
                {{ packageInstance.cpuCoreCount }} Core at
                {{ packageInstance.cpuGHz }} GHz <br />
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
                Storage <br />
                {{ Formatter.formatBytes(packageInstance.storageBytes) }} GB
                <br />
              </b>

              <span class="text-secondary">
                {{ packageInstance.server.storageDriveType }}
              </span>
            </div>
          </el-col>
        </el-row>

        <el-row class="mt-3">
          <el-col>
            <el-space>
              <b>Features:</b>

              <el-tag
                v-for="feature in packageInstance.features"
                :key="feature"
                effect="dark"
                round
              >
                {{ feature }}
              </el-tag>

              <span v-if="packageInstance.features.length === 0">-</span>
            </el-space>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <debug-wrapper>{{ packageInstance }}</debug-wrapper>
  </div>
</template>

<script>
import { Formatter } from "@/common/Formatter";
import Avatar from "@/components/AvatarImage.vue";
import PackageModel from "@/state/models/Package";
import { DashboardSpeed, Cpu, Server } from "iconoir-vue";

export default {
  components: {
    Cpu,
    DashboardSpeed,
    Server,
    Avatar,
  },
  props: {
    packageInstance: {
      type: [PackageModel, Object],
      required: true,
    },
    selected: {
      type: Boolean,
    },
  },
  emits: ["select"],
  computed: {
    Formatter: () => Formatter,
    /**
     * @return {import('@/state/models/Package').Package}
     */
  },
  methods: {
    onSelect() {
      this.$emit("select", this.packageId);
    },
    viewServer(serverId) {
      this.$router.push("/server/" + serverId);
    },
  },
};
</script>

<style scoped lang="scss">
.box-icon {
  height: 48px;
}
</style>
