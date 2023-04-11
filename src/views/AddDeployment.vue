<template>
  <el-link
    v-if="selected !== null"
    :underline="false"
    class="add-deployment-back"
    @click="clickType(null)"
  >
    <arrow-left />
  </el-link>
  <el-row
    v-if="selected !== 'template'"
    justify="center"
    :align="align"
    class="deployments h-100"
  >
    <el-col
      v-loading="loading"
      :xl="17"
      :md="20"
      :xs="24"
      class="align-center"
    >
      <template v-if="selected === null">
        <h3 class="p-0 pb-2">
          What would you like to deploy?
        </h3>
        <el-space
          direction="vertical"
          fill
          :size="16"
        >
          <template
            v-for="row in types"
            :key="row.id"
          >
            <el-card
              shadow="hover"
              class="deployment-type"
              @click="clickType(row.id)"
            >
              <el-row
                justify="start"
                align="middle"
                :gutter="20"
              >
                <el-col
                  :span="4"
                  class="align-right"
                >
                  <el-avatar
                    size="large"
                    :class="row.icon"
                  >
                    <span />
                  </el-avatar>
                </el-col>
                <el-col
                  :span="18"
                  class="align-left"
                >
                  <h3 class="m-0">
                    {{ row.title }}
                  </h3>
                  {{ row.text }}
                </el-col>
              </el-row>
            </el-card>
          </template>
        </el-space>
      </template>
      <template v-if="selected === 'file'">
        <h3 class="pb-2">
          Upload your deploy.yml file
        </h3>
        <el-upload
          class="upload-deployment"
          drag
        >
          <el-icon class="el-icon--upload">
            <upload-filled />
          </el-icon>
          <div class="el-upload__text">
            Drop file here or <em>click to upload</em>
          </div>
          <template #tip>
            <div class="el-upload__tip pt-2">
              <el-row justify="space-between">
                <el-col
                  :span="20"
                >
                  <el-icon class="text-icon">
                    <svg-text />
                    amazingBnuuyDeployment.yml
                  </el-icon>
                </el-col>
                <el-col
                  :span="4"
                  class="align-right"
                >
                  <circle-check class="icon-ok" />
                </el-col>
              </el-row>
            </div>
          </template>
        </el-upload>
        <el-button
          type="primary"
          size="large"
          round
          @click="selectDeploymentType()"
        >
          Continue
        </el-button>
      </template>
      <template v-if="selected === 'docker'">
        <h3 class="pb-2">
          Set your Docker Registry URL
        </h3>
        <el-input
          class="input-docker-url mb-5"
          placeholder="Registry URL"
        />
        <br>
        <el-button
          type="primary"
          size="large"
          round
          @click="selectDeploymentType()"
        >
          Continue
        </el-button>
      </template>
    </el-col>
  </el-row>
  <template v-if="selected === 'template'">
    <deployment-templates />
  </template>
</template>

<script>
import SvgText from '@/assets/icons/text.svg';
import debounce from "debounce";
import DeploymentTemplates from '@/views/DeploymentTemplates.vue';

export default {
  components: {
    SvgText,
    DeploymentTemplates
  },
  data() {
    return {
      loading: false,
      selected: null,
      filter: null,
      align: "middle"
    };
  },
  computed: {
    types() {
      return [
        {
          'id': 'empty',
          'icon': 'drafts',
          'title': 'Empty',
          'text': 'A basic config to get you started.'
        },
        {
          'id': 'file',
          'icon': 'text',
          'title': 'From file',
          'text': 'Load your deploy.yml file from your device.'
        },
        {
          'id': 'docker',
          'icon': 'link',
          'title': 'From Docker Registry',
          'text': 'Load your deploy.yml file from a public Docker registry.'
        },
        {
          'id': 'hello-world',
          'icon': 'globe',
          'title': 'Hello World',
          'text': 'A Simple application that displays ‘Hello World’.'
        },
        {
          'id': 'template',
          'icon': 'notes',
          'title': 'Template',
          'text': 'Search and explore over 2,294 community-made templates to get you started.'
        },
      ];
    }
  },
  watch: {
    filter: debounce(function () {
      this.filteredDeploymentTemplates = this.deploymentTemplates.filter(deploymentTemplate => deploymentTemplate.title.toLowerCase().indexOf(this.filter) !== -1);
    }, 500),
  },
  created() {
    this.$store.commit('DeploymentModule/createDeployment');
    if(this.$route.hash) {
      if(this.$route.hash === '#template') {
        this.clickType('template');
      }
    }
  },
  methods: {
    clickType(type) {
      this.selected = type;
      if (type === 'template') {
        this.align = 'top';
      } else {
        this.align = 'middle';
      }
      if (type === 'hello-world' || type === 'empty') {
        this.selectDeploymentType();
      }
      location.hash = type;
    },
    selectDeploymentType() {
      const sampleYaml = this.$store.getters['DeploymentModule/getSampleYamlTesting'];
      this.$store.commit('DeploymentModule/setYaml', sampleYaml);

      this.$router.push('/packages');
    },
  }
};
</script>

<style lang="scss">
@use 'element-plus/theme-chalk/src/mixins/function' as EPFunctions;

.add-deployment-back {
  z-index: 999;
  cursor: pointer;
  position: absolute;
  left: 1.5em;
  top: 5.5em;
  svg {
    height:1.5em;
    width:1.5em;
  }
}

.deployments {
  .deployment-type {
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    cursor: pointer;
    background-color: EPFunctions.getCssVar('bg-color', 'page');

    &:hover {
      transform: scale(1.05);
    }

    .el-card__body {
      padding-left: 0;
      padding-right: 0;

      .el-avatar {

        span {
          background-color: currentColor;
          width: 2em;
          height: 2em;
        }
        &.drafts {
          background-color: rgba(137, 231, 192, 0.1);

          span {
            mask-image: url('@/assets/icons/drafts.svg?base64');
            -webkit-mask-image: url('@/assets/icons/drafts.svg?base64');
          }
        }
        &.text {
          background-color: rgba(237, 209, 137, 0.1);

          span {
            mask-image: url('@/assets/icons/text.svg?base64');
            -webkit-mask-image: url('@/assets/icons/text.svg?base64');
          }
        }
        &.link {
          background-color: rgba(237, 143, 137, 0.1);

          span {
            mask-image: url('@/assets/icons/link.svg?base64');
            -webkit-mask-image: url('@/assets/icons/link.svg?base64');
          }
        }
        &.globe {
          background-color: rgba(227, 134, 151, 0.1);

          span {
            mask-image: url('@/assets/icons/globe.svg?base64');
            -webkit-mask-image: url('@/assets/icons/globe.svg?base64');
          }
        }
        &.notes {
          background-color: rgba(137, 158, 231, 0.1);

          span {
            mask-image: url('@/assets/icons/notes.svg?base64');
            -webkit-mask-image: url('@/assets/icons/notes.svg?base64');
          }
        }
      }
    }
  }

  .upload-deployment {
    width:30em;
    height:16em;
    padding-bottom: 4.5em;
    margin: auto;

    .el-upload, .el-upload-dragger {
      height:100%;
    }
    .el-upload-dragger {
      padding-top:2em;
    }

    .el-upload__tip {
      .text-icon {
        svg {
          zoom:150%;
        }
      }
      svg.icon-ok {
        height:1.5em;
        color: var(--el-color-success);
      }
    }
  }

  .input-docker-url {
    width: 30em;
  }

  .template-row {
    .el-card__body {
      padding: 2em;

      .avatar {
        height:56px;
        width:56px;
      }
    }
  }
}
</style>
