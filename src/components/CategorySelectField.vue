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
  data() {
    return {
      loading: false,
      options: [],
    };
  },
  created() {
    this.queryCategories('');
  },
  methods: {
    async queryCategories(query) {
      if (this.loading) {
        return;
      }

      this.loading = true;

      const response = await this.$store.dispatch('Category/queryCategories', {query});

      if (!response.success) {
        this.Toast("Failed to load categories", "", "error");

        return;
      }

      this.options = response.data.map(category => ({value: category.id, label: category.name}));

      this.loading = false;
    },
  },
};
</script>
