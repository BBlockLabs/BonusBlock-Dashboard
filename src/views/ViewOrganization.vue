<template>
  <el-container class="h-100">
    <el-aside
      v-if="!loading"
    >
      <debug>ID: {{ organizationId }}</debug>
      <debug>{{ organization }}</debug>

      <el-space
        v-if="organization"
        fill
        :size="16"
      >
        <organization-card
          :organization="organization"
          :static="true"
        />
        <info-item
          title="Total Leasing"
          :value="(organization.totalLeasing + '')"
        />
        <info-item
          title="Regions"
          :value="(organization.regions + '')"
        />
        <info-item
          v-if="organization.url"
          title="Website"
          :value="(organization.url + '')"
          :link="(organization.url + '')"
        />
        <info-item
          v-if="organization.email"
          title="Email"
          :value="(organization.email + '')"
        />
        <info-item
          v-if="organization.phoneNumber"
          title="Phone Number"
          :value="(organization.phoneNumber + '')"
        />
        <div>
          <el-button round>
            Share
            <el-icon class="el-icon--right">
              <upload />
            </el-icon>
          </el-button>
        </div>
      </el-space>
    </el-aside>

    <el-main
      v-if="!loading"
      class="view-organization"
    >
      <el-row>
        <el-col
          :span="22"
          class="align-center"
        >
          <world-map
            :points="coordinates"
            @click="viewServer"
          />
        </el-col>
      </el-row>
      <el-row align="middle">
        <el-col :span="11">
          <h3>Servers list</h3>
        </el-col>
        <el-col
          :span="11"
          class="align-right"
        >
          <el-space>
            <el-select
              v-model="filterRegion"
              placeholder="Region"
            >
              <el-option
                key=""
                label=""
                value=""
              />
              <el-option
                v-for="item in organization.regions"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
            <el-input
              v-model="filterText"
              placeholder="Search"
              prefix-icon="search"
            />
          </el-space>
        </el-col>
      </el-row>
      <el-row>
        <el-col
          :span="22"
          class="pr-1"
        >
          <el-space
            fill
            :size="24"
            class="mb-0 w-100"
          >
            <server-box
              v-for="server in filteredServers"
              :key="server.id"
              :server="server"
            />
          </el-space>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import InfoItem from '@/components/InfoItem';
import WorldMap from '@/components/Map';
import OrganizationCard from '@/components/OrganizationCard';
import ServerBox from '@/components/ServerBox';
import debounce from "debounce";

export default {
  components: {
    WorldMap,
    OrganizationCard,
    InfoItem,
    ServerBox
  },
  data() {
    return {
      loading: false,
      filterRegion: null,
      filterText: null,
      organization: null,
      /**
       * @type {[import('@/state/models/Server').Server]}
       */
      servers: [],
      /**
       * @type {[import('@/state/models/Server').Server]}
       */
      filteredServers: [],
      coordinates: [],
    };
  },
  computed: {
    organizationId() {
      return this.$route.params.organizationId;
    },
  },
  watch: {
    filterText: debounce(function () {
      this.filteredServers = this.servers.filter(server => server.name.toLowerCase().indexOf(this.filterText) !== -1);
    }, 500),
    filterRegion() {
      if(this.filterRegion === '') {
        this.filteredServers = this.servers;
      } else {
        this.filteredServers = this.servers.filter(server => server.location.country === this.filterRegion);
      }
    }
  },
  created() {
    this.loadOrganization();
  },
  methods: {
    async loadOrganization() {
      this.loading = true;

      try {
        const organizationResponse = await this.$store.dispatch(
          'OrganizationModule/loadOrganizationById',
          this.organizationId
        );

        if (!organizationResponse.success) {
          console.error(organizationResponse.errors);
          return;
        }

        this.organization = organizationResponse.data;

        const serverResponse = await this.$store.dispatch(
          'ServerModule/loadServersByOrganization',
          this.organizationId
        );

        if (!serverResponse.success) {
          console.error(serverResponse.errors);
          return;
        }

        this.servers = serverResponse.data;
        this.filteredServers = this.servers;

        for(let i in this.servers) {
          let server = this.servers[i];
          if(server.location) {

            let coordinate = [
              server.location.coordinates[1],
              server.location.coordinates[0],
              server.name,
              server.id
            ];
            this.coordinates.push(coordinate);
            this.organization.regions.push(this.servers[i].location.country);
          }
        }

      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    viewServer(data) {
      if(data.length >= 4) {
        this.$router.push('/server/' + data[3]);
      }
    }
  },
};
</script>

<style lang="scss">
.view-organization {
  .world-map {
    height: 40vh;
    width: unset;
  }
  .el-space {
    margin-bottom:0 !important;
  }
}
</style>
