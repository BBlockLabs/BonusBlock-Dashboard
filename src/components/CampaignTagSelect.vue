<template>
  <el-select-v2
    v-bind="$attrs"
    :options="options"
    :placeholder="$attrs.disabled ? 'Please select product first' : 'Please select'"
    filterable
    multiple
    clearable
  />
</template>

<script>
export default {
  props: {
    productId: {
      type: String,
      default: null,
    },
  },
  computed: {
    product() {
      return this.$store.getters["Product/getProduct"](this.productId);
    },
    categories() {
      return (
        this.product?.categories?.map((categoryId) =>
          this.$store.getters["Category/getCategory"](categoryId)
        ) ?? []
      );
    },
    options() {
      const tags = new Set(this.$store.state.Campaign.tags);

      this.categories.forEach(({ name }) => !tags.has(name) && tags.add(name));

      return [...tags.values()].map((tag) => ({ value: tag, label: tag }));
    },
  },
};
</script>
