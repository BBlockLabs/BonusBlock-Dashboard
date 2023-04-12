<template>
  <img :src="'data:image/' + file.type + ';base64,' + file.data" alt="" />
  <debug-wrapper>{{ imageUrl }}</debug-wrapper>
</template>

<script>
import baseAvatar from "@/assets/images/base-avatar.png";

export default {
  props: {
    file: {
      type: Object,
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
