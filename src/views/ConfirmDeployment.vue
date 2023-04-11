<template>
  <el-row
    v-if="loading"
    align="middle"
    justify="center"
    class="h-100 w-100"
  >
    <el-col
      :span="5"
      class="align-center"
    >
      <spinner />
      <h2>Creating your deployment</h2>
    </el-col>
  </el-row>
  <el-container
    v-if="!loading"
    class="h-100"
  >
    <el-header>
      <el-row
        justify="space-between"
        align="middle"
      >
        <el-col
          :span="12"
          class="align-left"
        >
          <h3>Deployment Details</h3>
        </el-col>
        <el-col
          :span="12"
          class="align-right"
        >
          <el-button
            v-if="!$store.getters['Auth/isNew']"
            round
          >
            Cancel
          </el-button>
          <el-button
            type="primary"
            round
            @click="finishDeployment()"
          >
            Confirm and Deploy
          </el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-main>
        <h4>Deployment Name</h4>
        <el-input
          v-model="title"
          size="large"
          type="text"
          placeholder="Deployment Name"
        />
        <h4>Deployment YAML</h4>
        <highlightjs
          language="yaml"
          :code="deployment.yaml"
        />
      </el-main>
      <el-aside class="h-100">
        <h4>Deploying as</h4>
        <el-card shadow="never">
          <member-row />
        </el-card>
        <h4>Deploying on</h4>
        <el-card shadow="never" v-if="deployment">
          <member-row />
          <template
            v-for="p in deployment.packages"
            :key="p"
          >
            <selected-package
              :selected-package="p"
              :show-buttons="false"
            />
          </template>
          <el-row
            justify="center"
            class="mt-4"
          >
            <el-button
              round
              @click="$router.push('/packages')"
            >
              Change
            </el-button>
          </el-row>
        </el-card>
      </el-aside>
    </el-container>
  </el-container>
</template>

<script>
import 'highlight.js/styles/stackoverflow-dark.css';
import 'highlight.js/lib/common';
import hljsVuePlugin from '@highlightjs/vue-plugin';
import MemberRow from '@/components/MemberRow.vue';
import SelectedPackage from '@/components/SelectedPackage.vue';
import Spinner from '@/components/Spinner.vue';

export default {
  components: {
    highlightjs: hljsVuePlugin.component,
    MemberRow,
    SelectedPackage,
    Spinner,
  },
  data() {
    return {
      loading: false,
      deployment: null,
      title: '',
    };
  },
  created() {
    this.deployment = this.$store.getters['DeploymentModule/getNewDeployment'];
    console.log(this.deployment);
    if(this.deployment === null) {
      this.$router.push('/');
    }
  },
  methods: {
    async finishDeployment() {
      this.loading = true;

      try {
        this.deployment.title = this.title;

        this.$store.commit('DeploymentModule/setTitle', this.deployment.title);
        await this.$store.dispatch('DeploymentModule/commitDeployment');
        this.$store.commit('Auth/addDeployment', this.deployment);
        this.$store.state.Auth.newUser = false;

        this.$router.push('/dashboard');
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    }
  },
};
</script>
