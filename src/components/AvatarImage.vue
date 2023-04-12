<template>
  <img :src="'data:image/' + file.type + ';base64,' + file.data" alt="" />
</template>

<script>
export default {
  props: {
    file: {
      type: Object,
      default: null,
    },
  },
};
</script>
