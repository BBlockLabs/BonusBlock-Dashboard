<template>
  <el-container class="h-100">
    <el-aside>
      <debug-wrapper>ID: {{ serverId }}</debug-wrapper>
      <debug-wrapper>{{ server }}</debug-wrapper>

      <server-profile-panel v-if="!loading" class="w-100" :server="server" />
    </el-aside>

    <el-main class="pt-0">
      <el-row v-if="!loading" v-loading="loading" justify="start" class="gap-0">
        <el-col
          v-for="packageInstance in packages"
          :key="packageInstance.id"
          :xl="12"
          :sm="24"
          class="p-2"
        >
          <package-box-vertical
            :package-instance="packageInstance"
            @select="continueClick"
          />
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import ServerProfilePanel from "@/components/ServerProfilePanel.vue";
import PackageBoxVertical from "@/components/PackageBoxVertical.vue";

export default {
  components: {
    PackageBoxVertical,
    ServerProfilePanel,
  },
  data() {
    return {
      loading: false,
      /**
       * @type {import('@/state/models/Server').Server}
       */
      server: null,
      /**
       * @type {[import('@/state/models/Package').Package]}
       */
      packages: [],
    };
  },
  computed: {
    serverId() {
      return this.$route.params.serverId;
    },
  },
  created() {
    this.loadServer();
  },
  methods: {
    async loadServer() {
      this.loading = true;

      try {
        const serverResponse = await this.$store.dispatch(
          "ServerModule/loadServerById",
          this.serverId
        );

        if (!serverResponse.success) {
          console.error(serverResponse.errors);
          return;
        }

        this.server = serverResponse.data;

        const packagesResponse = await this.$store.dispatch(
          "PackageModule/loadPackagesByServerId",
          this.serverId
        );

        if (!packagesResponse.success) {
          console.error(packagesResponse.errors);
          return;
        }

        this.packages = packagesResponse.data;
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    continueClick(packageId) {
      let pa = [];
      pa.push(this.$store.getters["PackageModule/findById"](packageId));
      this.$store.commit("DeploymentModule/setPackages", pa);

      this.$router.push("/confirm-deployment");
    },
  },
};
</script>
