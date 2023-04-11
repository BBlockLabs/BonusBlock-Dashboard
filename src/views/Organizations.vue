<template>
  <el-row
    justify="center"
    align="top"
    class="organizations-list"
  >
    <el-col
      :xl="14"
      :sm="20"
    >
      <el-row
        justify="space-between"
        align="middle"
      >
        <el-col :span="15">
          <h3>Find your organization</h3>
          Search though 964 providers with a total of 69,817 validators.
        </el-col>
        <el-col :span="9">
          <el-input
            v-model="filter"
            class="w-100"
            placeholder="Type something"
            prefix-icon="search"
            size="large"
          />
        </el-col>
      </el-row>
      <el-row
        class="pt-4"
        justify="space-between"
      >
        <template
          v-for="organization in filteredOrganizations"
          :key="organization.id"
        >
          <organization-card
            :organization="organization"
            @click="viewOrganization(organization.id)"
          />
        </template>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import OrganizationCard from '@/components/OrganizationCard.vue';
import debounce from 'debounce';

export default {
  components: {
    OrganizationCard
  },
  data() {
    return {
      filter: null,
      loading: false,
      /**
       * @type {[import('@/state/models/Organization').Organization]}
       */
      filteredOrganizations: [],
      /**
       * @type {[import('@/state/models/Organization').Organization]}
       */
      organizations: [],
    };
  },
  watch: {
    filter: debounce(function () {
      this.filteredOrganizations = this.organizations.filter(organization => organization.name.toLowerCase().indexOf(this.filter) !== -1);
    }, 500),
  },
  created() {
    this.getOrganizationsList();
  },
  methods: {
    async getOrganizationsList() {
      this.loading = true;

      try {
        const organizationsResponse = await this.$store.dispatch('OrganizationModule/loadAllOrganizations');

        if (!organizationsResponse.success) {
          console.error(organizationsResponse.errors);
          return;
        }

        this.organizations = organizationsResponse.data;
        this.filteredOrganizations = this.organizations;
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    viewOrganization(organizationId) {
      this.$router.push('/organizations/' + organizationId);
    },
  }
};
</script>

<style lang="scss">
.organizations-list {
  h3 {
    margin: 0;
  }
  .organization-card {
    width: 48%;
    margin-bottom: 1em;

    &:hover {
      transform: scale(1.05);
    }
  }
}
</style>
