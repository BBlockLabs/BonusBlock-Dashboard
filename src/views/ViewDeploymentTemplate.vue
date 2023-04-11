<template>
  <el-container
    v-if="!loading"
    class="h-100"
  >
    <el-aside class="p-3 view-template-aside">
      <el-row justify="space-between">
        <el-col
          :span="1"
          class="align-right"
        >
          <el-space direction="horizontal">
            <el-link
              :underline="false"
              class="back"
              @click="$router.go(-1)"
            >
              <arrow-left />
            </el-link>
            <el-image
              src="deploy-avatar.png"
              fit="cover"
              class="avatar"
            />
          </el-space>
        </el-col>
        <el-col
          :span="17"
          class="align-left pl-4"
        >
          <el-space
            direction="vertical"
            :size="7"
            fill
            class="pt-1"
          >
            <h3 class="m-0">
              {{ deploymentTemplate.title }}
            </h3>
            <el-icon class="ml-1 text-icon">
              <svg-github />
              {{ deploymentTemplate.url }}
            </el-icon>
          </el-space>
        </el-col>
      </el-row>
      <h4>Information</h4>
      <el-space
        fill
        :size="16"
      >
        <info-item
          title="Total uses"
          :value="(deploymentTemplate.totalUses + '')"
        />
        <info-item
          title="Repository"
          :value="(deploymentTemplate.url + '')"
        />
        <info-item
          title="Last update"
          :value="(deploymentTemplate.updatedAt + '')"
        />
        <info-item
          title="Contributors"
          :value="(deploymentTemplate.contributors + '')"
        />
        <info-item
          title="Stars"
          :value="(deploymentTemplate.stars + '')"
        />
        <info-item
          title="Forks"
          :value="(deploymentTemplate.forks + '')"
        />
      </el-space>
    </el-aside>

    <el-main class="view-template-main">
      <el-row justify="space-between">
        <el-col
          :span="18"
          class="align-left"
        >
          <el-button-group>
            <el-button
              :type="tab === 'readme' ? 'primary' : ''"
              @click="tab='readme'"
            >
              Readme
            </el-button>
            <el-button
              :type="tab === 'yaml' ? 'primary' : ''"
              @click="tab='yaml'"
            >
              YAML
            </el-button>
          </el-button-group>
        </el-col>
        <el-col
          :span="6"
          class="align-right"
        >
          <el-button
            v-if="$store.getters['DeploymentModule/isCreateDeployment']"
            round
            type="primary"
            @click="selectDeploymentTemplate()"
          >
            Select
          </el-button>
        </el-col>
      </el-row>
      <template v-if="tab === 'readme'">
        <h3>{{ deploymentTemplate.title }}</h3>
        {{ deploymentTemplate.text }}
      </template>
      <template v-else-if="tab === 'yaml'">
        <highlightjs
          language="yaml"
          :code="deploymentTemplate.yaml"
        />
      </template>
    </el-main>
  </el-container>
</template>

<script>
import InfoItem from '@/components/InfoItem';
import SvgGithub from '@/assets/icons/github.svg';
import 'highlight.js/styles/stackoverflow-dark.css';
import 'highlight.js/lib/common';
import hljsVuePlugin from '@highlightjs/vue-plugin';

export default {
  components: {
    SvgGithub,
    InfoItem,
    highlightjs: hljsVuePlugin.component
  },
  data() {
    return {
      loading: false,
      /**
       * @type {import('@/state/models/DeploymentTemplate').DeploymentTemplate}
       */
      deploymentTemplate: null,
      tab: 'readme',
    };
  },
  computed: {
    deploymentTemplateId() {
      return this.$route.params.deploymentTemplateId;
    },
  },
  created() {
    this.loadDeploymentTemplate();
  },
  methods: {
    async loadDeploymentTemplate() {
      this.loading = true;

      try {
        const response = await this.$store.dispatch(
          'DeploymentTemplateModule/loadDeploymentTemplateById',
          this.deploymentTemplateId
        );

        if (!response.success) {
          console.error(response.errors);
        }

        this.deploymentTemplate = response.data;
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    selectDeploymentTemplate() {
      const sampleYaml = this.deploymentTemplate.yaml;
      this.$store.commit('DeploymentModule/setYaml', sampleYaml);

      this.$router.push('/packages');
    },
  },
};
</script>

<style lang="scss">
.view-template-aside {
  width: 17%;
  .back {
    svg {
      height:1.5em;
      width:1.5em;
    }
  }

  .avatar {
    height:56px;
    width:56px;
  }
}
.view-template-main {
  padding-right: 20em;

  .el-button-group {
    .el-button {
      border-radius: 0.25em
    }

  }
}
</style>
