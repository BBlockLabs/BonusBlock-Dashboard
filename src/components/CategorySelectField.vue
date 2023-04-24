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
    this.queryCategories("");
  },
  methods: {
    async queryCategories(query) {
      if (this.loading) {
        return;
      }

      this.loading = true;

      const categories = await this.$store.getters["Category/queryCategories"]({
        query,
      });

      this.options = categories.map((category) => ({
        value: category.id,
        label: category.name,
      }));

      this.loading = false;
    },
  },
};
</script>
