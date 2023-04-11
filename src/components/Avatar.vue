<template>
  <el-avatar
    v-bind="$attrs"
    :src="imageUrl"
  />
  <debug>{{ imageUrl }}</debug>
</template>

<script>
import baseAvatar from '@/assets/images/base-avatar.png';

export default {
  props: {
    file: {
      type: [File, Blob],
      default: null,
    },
  },
  computed: {
    imageUrl() {
      if (!this.file) {
        return baseAvatar;
      }

      return URL.createObjectURL(this.file);
    },
  },
};
</script>
