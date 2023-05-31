<template>
  <div style="height: 100%; display: flex; flex-direction: column">
    <el-container class="h-100" style="padding-left: 20px;">
      <el-main class="pos-relative">
        <div class="pos-absolute w-100">
          <div style="margin-top: 20px; margin-right: 20px">
            <el-row
              style="min-height: 3em"
              class="mb-2 is-justify-space-between"
            >
              <el-col :span="-1">
                <h1 class="m-0">Project Settings</h1>
              </el-col>
              <el-col v-if="saveButtonActive" :span="-1">
                <el-button round type="default" @click="resetInputs">
                  Reset</el-button
                >
                <el-button round type="primary" @click="updateProject">
                  Save Settings</el-button
                >
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form label-position="top">
                  <el-form-item
                    :error="getVuelidateErrorMessage(vuelidate.formData.title)"
                    label="Project’s Name"
                  >
                    <el-input
                      v-model="formData.title"
                      :placeholder="currentProject.title"
                    />
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row justify="space-between">
              <el-col :span="-1">
                <h4>Choose your project’s avatar</h4>
                <avatar-select v-model="formData.image" />
                <h4>or upload your own</h4>
                <el-row justify="center">
                  <el-col>
                    <el-form-item class="d-flex">
                      <avatar-input v-model="formData.image" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="-1" class="d-flex" >
                <el-card shadow="never" class="h-100 new-project-card align-center">
                  <img
                    v-if="formData.image.data !== ''"
                    :src="
                      'data:' +
                      formData.image.type +
                      ';base64,' +
                      formData.image.data
                    "
                    alt=""
                  />
                  <img
                    v-else
                    :src="
                      'data:' +
                      currentProject.imageType +
                      ';base64,' +
                      currentProject.image
                    "
                    alt=""
                  />
                  <h3>
                    {{
                      formData.title === ""
                        ? currentProject.title
                        : formData.title
                    }}
                  </h3>
                  1 member
                </el-card>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import AvatarSelect from "@/components/AvatarSelect.vue";
import AvatarInput from "@/components/AvatarInput.vue";
import Toast from "@/mixins/Toast.js";
import Vuelidate from "@/mixins/Vuelidate.js";
import { minLength, required } from "@vuelidate/validators";

export default {
  components: { AvatarInput, AvatarSelect },
  mixins: [Toast, Vuelidate],
  data() {
    return {
      saveButtonActive: false,
      currentProject: {},
      formData: {
        title: "",
        image: {
          data: "",
          type: "",
        },
      },
    };
  },
  watch: {
    formData: {
      deep: true,
      handler(formData) {
        this.saveButtonActive =
          (formData.title !== "" &&
            formData.title !== this.currentProject.title) ||
          (formData.image.data !== "" &&
            formData.image.data !== this.currentProject.image);
      },
    },
  },
  created() {
    this.currentProject = this.$store.getters["Project/getProject"];
  },
  methods: {
    resetInputs() {
      this.formData.title = "";
      this.formData.image.type = "";
      this.formData.image.data = "";
    },
    async updateProject() {
      this.vuelidate.$touch();

      if (this.vuelidate.$errors.length > 0) {
        return;
      }
      const response = await this.$store.dispatch("Project/updateProject", {
        ...(this.formData.title && { title: this.formData.title }),
        ...(this.formData.image.data && { image: this.formData.image.data }),
        ...(this.formData.image.type && {
          imageType: this.formData.image.type,
        }),
      });

      if (!response.success) {
        this.Toast("Failed to update project settings", response.data, "error");
        return;
      }
      this.saveButtonActive = false;
      this.currentProject = this.$store.getters["Project/getProject"];
    },
  },
  validations() {
    return {
      formData: {
        title: {
          minLength: minLength(6),
        },
      },
    };
  },
};
</script>

<style lang="scss">
@use "@/design/vars.scss" as v;

.new-project-card {
  background-color: v.$color-lighter;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-wrap: wrap;
  width: 30em;

  img {
    margin-bottom: 1.5em;
    width: auto;
    height: 9em;
  }

  h3 {
    margin: 0 0 0.5em;
  }
}
</style>
