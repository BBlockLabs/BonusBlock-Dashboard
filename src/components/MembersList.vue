<template>
  <el-card class="box-card members-card" shadow="never">
    <el-row align="middle" justify="space-between" class="pb-3">
      <el-col class="title" :span="12">
        <h3>Members</h3>
      </el-col>
      <el-col :span="12" class="align-right">
        <el-button round> Manage > </el-button>
      </el-col>
    </el-row>

    <template v-for="id in [1, 2, 3, 4]" :key="id">
      <member-row />
    </template>
  </el-card>
</template>

<script>
import MemberRow from "@/components/MemberRow.vue";

export default {
  components: {
    MemberRow,
  },
};
</script>
