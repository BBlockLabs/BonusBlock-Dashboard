<template>
  <el-avatar :src="src" shape="square" />
</template>

<script>
import FileParser from "@/common/FileParser.js";

export default {
  props: {
    file: {
      type: Object,
      default: null,
    },
  },
  computed: {
    src() {
      if (!this.file || !this.file.data) {
        return null;
      }

      return FileParser.fileObjectSrc(this.file);
    },
  },
};
</script>
