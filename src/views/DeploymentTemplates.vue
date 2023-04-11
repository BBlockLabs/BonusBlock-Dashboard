<template>
  <el-row justify="center" align="top" class="deployments h-100">
    <el-col
      v-loading="loading"
      :xl="17"
      :lg="18"
      :md="19"
      :xs="20"
      class="align-center"
    >
      <el-row justify="space-between" align="middle" class="mb-3">
        <el-col :span="15" class="align-left">
          <h3 class="m-0">Templates</h3>
          Community-made templates to make deployment easier.
        </el-col>
        <el-col :span="9">
          <el-input
            v-model="filter"
            class="w-100"
            placeholder="Type something"
            prefix-icon="search"
            size="large"
          />
        </el-col>
      </el-row>

      <el-card
        v-for="deploymentTemplate in filteredDeploymentTemplates"
        :key="deploymentTemplate.id"
        shadow="hover"
        class="mb-5 template-row"
      >
        <el-row justify="space-between">
          <el-col :span="1" class="align-right">
            <el-image src="deploy-avatar.png" fit="cover" class="avatar" />
          </el-col>
          <el-col :span="17" class="align-left pl-4">
            <el-space direction="vertical" :size="7" fill class="pt-1">
              <h3 class="m-0">
                {{ deploymentTemplate.title }}
              </h3>
              <el-icon class="ml-1 text-icon">
                <svg-github />
                {{ deploymentTemplate.url }}
              </el-icon>
            </el-space>
          </el-col>
          <el-col :span="6" class="align-right">
            <el-button
              round
              @click="viewDeploymentTemplate(deploymentTemplate.id)"
            >
              See more >
            </el-button>
            <el-button
              v-if="$store.getters['DeploymentModule/isCreateDeployment']"
              round
              type="primary"
              @click="selectDeploymentTemplate(deploymentTemplate.yaml)"
            >
              Select
            </el-button>
          </el-col>
        </el-row>
        <el-row justify="start" class="pt-3">
          <el-col :span="24" class="align-left">
            {{ deploymentTemplate.shortText }}
          </el-col>
        </el-row>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import SvgGithub from "@/assets/icons/github.svg";
import debounce from "debounce";

export default {
  components: {
    SvgGithub,
  },
  data() {
    return {
      loading: false,
      filter: null,
      deploymentTemplates: [],
      filteredDeploymentTemplates: [],
    };
  },
  watch: {
    filter: debounce(function () {
      this.filteredDeploymentTemplates = this.deploymentTemplates.filter(
        (deploymentTemplate) =>
          deploymentTemplate.title.toLowerCase().indexOf(this.filter) !== -1
      );
    }, 500),
  },
  created() {
    this.getDeploymentTemplatesList();
  },
  methods: {
    async getDeploymentTemplatesList() {
      this.loading = true;

      try {
        const deploymentTemplateResponse = await this.$store.dispatch(
          "DeploymentTemplateModule/loadAllDeploymentTemplates"
        );

        if (!deploymentTemplateResponse.success) {
          console.error("failed to load templates");
          return;
        }

        this.deploymentTemplates = deploymentTemplateResponse.data;
        this.filteredDeploymentTemplates = this.deploymentTemplates;
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    viewDeploymentTemplate(deploymentTemplateId) {
      this.$router.push("/templates/" + deploymentTemplateId);
    },
    selectDeploymentTemplate(deploymentTemplateYaml) {
      this.$store.commit("DeploymentModule/setYaml", deploymentTemplateYaml);

      this.$router.push("/packages");
    },
  },
};
</script>

<style lang="scss">
.deployments {
  .template-row {
    .el-card__body {
      padding: 2em;

      .avatar {
        height: 56px;
        width: 56px;
      }
    }
  }
}
</style>
