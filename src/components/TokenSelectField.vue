<template>
  <el-select-v2
    v-bind="$attrs"
    remote
    filterable
    :remote-method="queryTokens"
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
    this.queryTokens('');
  },
  methods: {
    async queryTokens(query) {
      if (this.loading) {
        return;
      }

      this.loading = true;

      const response = await this.$store.dispatch('Token/queryTokens', {query});

      if (!response.success) {
        this.Toast("Failed to load tokens", "", "error");

        return;
      }

      this.options = response.data.map(token => ({value: token.id, label: token.name}));

      this.loading = false;
    },
  },
};
</script>
