<template>
  <el-container class="dashboard">
    <el-main>
      <el-row
        justify="space-between"
        align="middle"
      >
        <el-col
          :span="12"
          class="align-left"
        >
          <h2>Active Deployments</h2>
        </el-col>
        <el-col
          :span="12"
          class="align-right"
        >
          <el-button
            size="large"
            round
            type="primary"
            @click="newDeployment"
          >
            New Deployment
          </el-button>
        </el-col>
      </el-row>
      <el-space
        direction="vertical"
        fill
        class="mt-3 w-100"
        :size="20"
      >
        <deployment
          v-for="i in [1, 2, 3, 4, 5]"
          :key="i"
        />
      </el-space>
    </el-main>
    <el-aside>
      <el-space
        direction="vertical"
        fill
        class="w-100"
        :size="20"
      >
        <el-card
          shadow="never"
          class="member-row-card"
        >
          <member-row
            first-line="Workspace name"
            second-line="5 Members"
          />
        </el-card>
        <billing />
        <members />
      </el-space>
    </el-aside>
  </el-container>
</template>

<script>
import MemberRow from '@/components/MemberRow.vue';
import Billing from '@/components/Billing.vue';
import Members from '@/components/Members.vue';
import Deployment from '@/components/Deployment.vue';

export default {
  components: {
    MemberRow,
    Billing,
    Members,
    Deployment
  },
  methods: {
    newDeployment() {
      this.$router.push('/add-deployment');
    }
  }
};
</script>

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
