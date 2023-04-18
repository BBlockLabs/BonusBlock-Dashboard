<template>
  <img :src="src" alt="" />
</template>

<script>
import FileParser from "@/common/FileParser.js";
import { FileObject } from "@/common/FileObject.js";

export default {
  props: {
    file: {
      type: FileObject,
      default: null,
    },
  },
  computed: {
    src() {
      if (this.file === null) {
        return null;
      }

      return FileParser.fileObjectSrc(this.file);
    },
  },
};
</script>
