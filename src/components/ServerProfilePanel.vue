<template>
  <el-space
    v-if="server !== null"
    class="server-profile w-100"
    direction="vertical"
    fill
  >
    <el-row>
      <el-col class="d-flex">
        <el-link
          :underline="false"
          @click="$router.go(-1)"
        >
          <nav-arrow-left class="icon my-auto" />
        </el-link>
        <avatar
          :file="null"
          class="mx-2"
        />
        {{ server.name }}
        Username<br>
        Role
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <h4 class="m-0">
          Resources
        </h4>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <resource-gauge
          title="Total RAM"
          type="ram"
          class="pb-3"
          :current="server.usedRamBytes"
          :max="server.ramBytes"
        />
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <resource-gauge
          title="Total CPU"
          type="cpu"
          class="pb-3"
          :current="server.usedCpuCount"
          :max="server.cpuCount"
        />
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <resource-gauge
          title="Total Storage"
          type="storage"
          class="pb-3"
          :current="server.usedStorageBytes"
          :max="server.storageBytes"
        />
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <h4 class="m-0">
          Information
        </h4>
      </el-col>
    </el-row>

    <info-item
      v-for="row in values"
      :key="row[0]"
      :title="row[0]"
      :value="row[1]"
      :link="row[2] || null"
      :copy="row[3] || false"
    />

    <el-row>
      <el-col class="align-center">
        <world-map :country="server.location.country" />
      </el-col>
    </el-row>
  </el-space>
</template>

<script>
import ResourceGauge from '@/components/ResourceGauge';
import WorldMap from '@/components/Map';
import Avatar from '@/components/Avatar';
import InfoItem from '@/components/InfoItem';
import {NavArrowLeft} from 'iconoir-vue';
import Server from '@/state/models/Server';

export default {
  components: {
    Avatar,
    ResourceGauge,
    WorldMap,
    InfoItem,
    NavArrowLeft,
  },
  props: {
    server: {
      type: [Server, Object],
      required: true,
    },
  },
  computed: {
    values() {
      if (this.server === null) {
        return [];
      }

      return [
        ['Total Leasing', this.server.totalLeases],
        ['Provided by', this.server.organization.name, this.server.organization.id],
        ['Address', this.server.address, null, true],
        ['Email', this.server.organization.name],
        ['Phone Number', this.server.organization.phoneNumber],
        ['Traffic', this.server.trafficBytes],
        ['Uplink', this.server.uplinkBits],
        ['Location', this.server.location.country],
      ];
    },
  },
};
</script>

<style scoped lang="scss">
.server-profile {
  .icon {
    zoom: 150%;
  }
}
</style>
