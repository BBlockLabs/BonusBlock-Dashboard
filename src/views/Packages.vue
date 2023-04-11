<template>
  <el-container
    v-loading="loading"
    class="h-100 packages"
  >
    <el-main class="pl-0">
      <el-row>
        <el-col>
          <h1 class="mt-0">
            Find a package
          </h1>
        </el-col>
        <el-col>
          Choose a package from any validator to host your deployment.

          <debug>{{ filter }}</debug>
          <debug>Selected{{ selectedPackages }}</debug>
        </el-col>
      </el-row>

      <el-row v-if="recommendedPackages.length !== 0">
        <el-col>
          <h2>Recommended</h2>

          <el-space
            fill
            :size="24"
            class="w-100"
          >
            <package-box
              v-for="packageInstance in recommendedPackages"
              :key="packageInstance.id"
              :package-instance="packageInstance"
              :selected="selectedPackages.includes(packageInstance.id)"
              @select="toggleSelected(packageInstance.id)"
            />
          </el-space>
        </el-col>
      </el-row>

      <el-row v-if="otherPackages.length !== 0">
        <el-col>
          <h2>Other</h2>

          <el-space
            fill
            :size="24"
            class="w-100"
          >
            <package-box
              v-for="packageInstance in otherPackages"
              :key="packageInstance.id"
              :package-instance="packageInstance"
              :selected="selectedPackages.includes(packageInstance.id)"
              @select="toggleSelected(packageInstance.id)"
            />
          </el-space>
        </el-col>
      </el-row>
    </el-main>

    <el-aside
      v-if="!loading"
      class="bl-solid h-100 packages-filters-aside"
    >
      <package-filters
        v-model="filter"
        :filter-options="filterOptions"
        :selected="selectedPackages"
        :tab-opened="filterTab"
        @remove-selected="packageId => toggleSelected(packageId)"
        @continue-select="continueClick()"
      />
    </el-aside>
  </el-container>
</template>

<script>
import PackageBox from '@/components/PackageBox';
import PackageFilter from '@/common/PackageFilter';
import PackageFilters from '@/components/PackageFilters';

export default {
  components: {
    PackageFilters,
    PackageBox,
  },
  data() {
    return {
      /**
       * @type PackageFilter
       */
      filter: new PackageFilter(),
      filterTab: 'filters',
      filterOptions: false,
      /**
       * @type {[import('@/state/models/Package').Package]}
       */
      packages: [],
      selectedPackages: [],
      loading: false,
    };
  },
  computed: {
    /**
     * @return {[import('@/state/models/Package').Package]}
     */
    recommendedPackages() {
      const recommendedFilter = new PackageFilter();
      Object.assign(recommendedFilter, this.filter);

      recommendedFilter.endorsement = PackageFilter.ENDORSEMENT_RECOMMENDED;

      return this.$store.getters['PackageModule/filteredPackages'](recommendedFilter);
    },
    /**
     * @return {[import('@/state/models/Package').Package]}
     */
    otherPackages() {
      const otherFilter = new PackageFilter();
      Object.assign(otherFilter, this.filter);

      otherFilter.endorsement = PackageFilter.ENDORSEMENT_OTHER;

      return this.$store.getters['PackageModule/filteredPackages'](otherFilter);
    },
  },
  created() {
    this.getPackageList();
  },
  methods: {
    async getPackageList() {
      this.loading = true;

      try {
        const packagesResponse = await this.$store.dispatch('PackageModule/loadAllPackages');

        if (!packagesResponse.success) {
          console.error(packagesResponse.errors);
          return;
        }

        this.packages = packagesResponse.data;

        let regions = [];
        let storageDriveTypes = [];
        let features = [];
        for(let i in this.packages) {

          if(this.packages[i].server.location) {

            regions.push(this.packages[i].server.location.country);
            storageDriveTypes.push(this.packages[i].server.storageDriveType);
            if(this.packages[i].features.length > 0) {
              features.push(...this.packages[i].features);
            }
          }
        }

        this.filterOptions = this.$store.state.PackageModule.filterOptions;
        this.filterOptions[1].options = [...new Set(regions)];
        this.filterOptions[2].options = [...new Set(features)];
        this.filterOptions[10].options = [...new Set(storageDriveTypes)];

      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    toggleSelected(packageId) {
      if (this.selectedPackages.includes(packageId)) {
        this.selectedPackages = this.selectedPackages.filter(selectedId => selectedId !== packageId);
      } else {
        this.selectedPackages.push(packageId);
      }
      this.filterTab = this.selectedPackages.length > 0 ? 'selected' : 'filters';
    },
    continueClick() {
      if(this.selectedPackages.length > 0) {
        let packages = [];
        for(let p in this.selectedPackages) {
          let pa = this.$store.getters['PackageModule/findById'](this.selectedPackages[p]);
          packages.push(pa);
        }
        if(packages.length > 0) {
          this.$store.commit('DeploymentModule/setPackages', packages);
        }
      }

      this.$router.push('/confirm-deployment');
    }
  },
};
</script>

<style scoped lang="scss">
.packages {
  .el-main {
    padding-top: 0;
  }
  .packages-filters-aside {
    margin-top:-1.5em;
  }
}
</style>
