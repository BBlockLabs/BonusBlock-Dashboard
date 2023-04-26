<template>
  <el-button plain circle type="danger" v-bind="$attrs">
    <svg-trash />
  </el-button>
</template>

<script>
import SvgTrash from "@/assets/icons/trash.svg";

export default {
  components: {
    SvgTrash,
  },
};
</script>
