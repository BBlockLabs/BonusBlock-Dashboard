<template>
  <el-select-v2
    v-bind="$attrs"
    remote
    filterable
    :remote-method="queryNetworks"
    clearable
    :options="options"
    :loading="loading"
    placeholder="Please enter a keyword"
  />
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      options: [],
    };
  },
  created() {
    this.queryNetworks("");
  },
  methods: {
    async queryNetworks(query) {
      if (this.loading) {
        return;
      }

      this.loading = true;

      const response = await this.$store.dispatch("Network/queryNetworks", {
        query,
      });

      if (!response.success) {
        this.Toast("Failed to load networks", "", "error");

        return;
      }

      this.options = response.data.map((network) => ({
        value: network.id,
        label: network.name,
      }));

      this.loading = false;
    },
  },
};
</script>
