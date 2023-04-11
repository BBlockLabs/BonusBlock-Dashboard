<template>
  <el-row class="h-100">
    <el-col
      hidden-sm-and-down
      :md="2"
    />
    <el-col :md="6">
      <div class="d-flex h-100">
        <div class="my-auto w-100">
          <el-row>
            <el-col>
              <h1>Create your Workspace</h1>
            </el-col>
          </el-row>

          <el-row>
            <el-col>
              <p>Workspaces are used to collaborate with colleagues and manage deployments as a team.</p>
            </el-col>
          </el-row>

          <el-row justify="center">
            <el-col>
              <create-workspace-form
                cancel-text="Skip for now"
                @workSpaceAddSuccess="afterSave"
                @cancel="afterSave"
              />
            </el-col>
          </el-row>
        </div>
      </div>
    </el-col>

    <el-col
      hidden-sm-and-down
      :md="2"
    />
    <el-col :md="12">
      <el-card class="h-100">
        <div class="d-flex">
          <div class="mx-auto">
            Decorative Illustration
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import CreateWorkspaceForm from '@/components/CreateWorkspaceForm';

export default {
  components: {
    CreateWorkspaceForm,
  },
  methods: {
    afterSave() {
      this.$router.push('/add-balance');
    },
  }
};
</script>
