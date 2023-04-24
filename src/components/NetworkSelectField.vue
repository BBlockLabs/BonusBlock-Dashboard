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

      const networks = await this.$store.getters["Network/queryNetworks"]({
        query,
      });

      this.options = networks.map((network) => ({
        value: network.id,
        label: network.name,
      }));

      this.loading = false;
    },
  },
};
</script>
