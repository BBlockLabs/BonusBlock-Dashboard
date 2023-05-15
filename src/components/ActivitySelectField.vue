<template>
  <el-select-v2
    v-bind="$attrs"
    remote
    filterable
    :remote-method="queryCategories"
    clearable
    :options="options"
    :loading="loading"
    placeholder="Please enter a keyword"
  />
</template>

<script>
export default {
  props: {
    networkId: {
      type: [String, null],
      default: null,
    },
  },
  data() {
    return {
      loading: false,
      options: [],
      query: "",
    };
  },
  watch: {
    networkId() {
      this.queryCategories(this.query);
    },
  },
  created() {
    this.queryCategories(this.query);
  },
  methods: {
    async queryCategories(query) {
      if (this.loading) {
        return;
      }

      this.query = query;
      this.loading = true;

      const response = await this.$store.dispatch(
        "Activity/queryActivities",
        {
          network: this.networkId || undefined,
          filter: this.query,
        }
      );

      if (!response.success) {
        this.loading = false;

        return;
      }

      const activities = response.data;

      this.options = activities.map((activity) => ({
        value: activity.id,
        label: activity.name,
      }));

      this.loading = false;
    },
  },
};
</script>
