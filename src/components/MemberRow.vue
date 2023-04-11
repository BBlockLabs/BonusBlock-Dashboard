<template>
  <el-row align="middle" justify="center" class="member-row">
    <el-col :span="4">
      <el-avatar />
    </el-col>
    <el-col :span="18" class="pl-2">
      <el-space fill :size="2">
        <span class="first">
          {{ firstLine }}
        </span>
        <span class="second">
          {{ secondLine }}
        </span>
      </el-space>
    </el-col>
    <el-col :span="2" class="align-right arrow">
      <arrow-down />
    </el-col>
  </el-row>
</template>

<script>
export default {
  components: {},
  props: {
    firstLine: {
      type: String,
      required: false,
      default: "First line",
    },
    secondLine: {
      type: String,
      required: false,
      default: "Second line",
    },
  },
};
</script>

<style lang="scss">
.member-row {
  margin-bottom: 1em;

  .el-avatar {
    display: block;
  }
  .arrow {
    cursor: pointer;

    svg {
      zoom: 150%;
    }
  }
  span.first {
    font-weight: bolder;
  }
  span.second {
    font-size: 0.85em;
  }
}
</style>
