<template>
  <div class="b-solid bg-fill-extra-light br-base p-3 w-100">
    <el-row justify="space-between">
      <el-col :md="-1" class="d-flex">
        <avatar :file="server.icon" />

        <div class="ml-3">
          <b>{{ server.name }}</b> <br />
          {{ server.url }}
        </div>
      </el-col>

      <el-col :md="-1">
        <el-button round @click="viewServer(server.id)"> See more > </el-button>
      </el-col>
    </el-row>

    <el-row class="mt-3" :gutter="24">
      <el-col :md="8">
        <el-space class="w-100" fill>
          <el-row class="b-solid br-small p-3" justify="space-between">
            <el-col :span="-1"> Region </el-col>

            <el-col :span="-1">
              <b>
                {{ server.location.country }}
              </b>
            </el-col>
          </el-row>

          <el-row class="b-solid br-small p-3" justify="space-between">
            <el-col :span="-1"> Currently leasing </el-col>

            <el-col :span="-1">
              <b>
                {{ server.leasing }}
              </b>
            </el-col>
          </el-row>

          <el-row class="b-solid br-small p-3" justify="space-between">
            <el-col :span="-1"> Total leases </el-col>

            <el-col :span="-1">
              <b>
                {{ server.totalLeases }}
              </b>
            </el-col>
          </el-row>

          <el-row class="b-solid br-small p-3" justify="space-between">
            <el-col :span="-1"> Address </el-col>

            <el-col :span="-1">
              <b>
                {{ server.address }}
              </b>
            </el-col>
          </el-row>
        </el-space>
      </el-col>

      <el-col :md="16">
        <resource-gauge
          title="Total RAM"
          type="ram"
          class="pb-3"
          :current="server.usedRamBytes"
          :max="server.ramBytes"
        />

        <resource-gauge
          title="Total CPU"
          type="cpu"
          class="pb-3"
          :current="server.usedCpuCount"
          :max="server.cpuCount"
        />

        <resource-gauge
          title="Total Storage"
          type="storage"
          class="pb-3"
          :current="server.usedStorageBytes"
          :max="server.storageBytes"
        />

        <el-row class="mt-3">
          <el-col>
            <el-space>
              <b>Features:</b>

              <el-tag
                v-for="feature in server.features"
                :key="feature"
                effect="dark"
                round
              >
                {{ feature }}
              </el-tag>

              <span v-if="server.features.length === 0">-</span>
            </el-space>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <debug-wrapper>{{ server }}</debug-wrapper>
  </div>
</template>

<script>
import Avatar from "@/components/AvatarImage.vue";
import ResourceGauge from "@/components/ResourceGauge.vue";
import Server from "@/state/models/Server";

export default {
  components: {
    ResourceGauge,
    Avatar,
  },
  props: {
    server: {
      type: [Server, Object],
      required: true,
    },
  },
  computed: {},
  methods: {
    viewServer(serverId) {
      this.$router.push("/server/" + serverId);
    },
  },
};
</script>
