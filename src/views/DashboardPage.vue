<template>
  <el-container class="dashboard">
    <el-main>
      <el-row justify="space-between" align="middle">
        <el-col :span="12" class="align-left">
          <h2>Active Deployments</h2>
        </el-col>
        <el-col :span="12" class="align-right">

        </el-col>
      </el-row>
      <el-space direction="vertical" fill class="mt-3 w-100" :size="20">
      </el-space>
    </el-main>
    <el-aside>
      <el-space direction="vertical" fill class="w-100" :size="20">
        <el-card shadow="never" class="member-row-card">
        </el-card>
      </el-space>
    </el-aside>
  </el-container>
</template>

<style lang="scss">
.dashboard {
  .el-main {
    padding-top: 0;
  }
  .el-aside {
    width: 20%;

    .member-row-card {
      .el-card__body {
        padding-bottom: 0;
      }
    }
  }
}
</style>
