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
  >
    <template #default="{ item }">
      <div class="d-flex">
        <span>{{ item.label || item.hash }}</span>

        <span class="text-secondary ml-auto">
          {{ item.hash }}
        </span>
      </div>
    </template>
  </el-select-v2>
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

      const response = await this.$store.dispatch("Activity/queryActivities", {
        network: this.networkId || undefined,
        filter: this.query,
      });

      if (!response.success) {
        this.loading = false;

        return;
      }

      const activities = response.data;

      this.options = activities.map((activity) => ({
        value: activity.id,
        hash: "0x" + activity.hash.replace('0x', ''),
        label: activity.name,
      }));

      this.loading = false;
    },
  },
};
</script>
