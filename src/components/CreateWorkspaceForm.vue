<template>
  <el-form v-loading="loading" @submit.prevent="createWorkspace">
    <el-row justify="center">
      <el-col>
        <el-form-item class="d-flex">
          <avatar-input v-model="formData.icon" :size="96" class="mx-auto" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row justify="center">
      <el-col>
        <el-form-item
          :error="getVuelidateErrorMessage(vuelidate.formData.name)"
        >
          <el-input
            v-model="formData.name"
            size="large"
            type="text"
            placeholder="Project name"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row justify="center" :gutter="20">
      <el-col :md="-1">
        <el-button round class="w-100" type="primary" @click="createWorkspace">
          Create
        </el-button>
      </el-col>

      <el-col :md="-1">
        <el-button round class="w-100" @click="$emit('cancel')">
          {{ cancelText }}
        </el-button>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import Toast from "@/mixins/Toast";
import Vuelidate from "@/mixins/Vuelidate";
import AvatarInput from "@/components/AvatarInput.vue";
import { required, minLength } from "@vuelidate/validators";

export default {
  components: {
    AvatarInput,
  },
  mixins: [Toast, Vuelidate],
  props: {
    cancelText: {
      type: String,
      default: "Cancel",
    },
  },
  emits: [
    "cancel",
    "workSpaceAddSuccess",
    "workSpaceAddFailed",
    "workSpaceAddError",
  ],
  data() {
    return {
      formData: {
        icon: null,
        name: "",
      },
      loading: false,
    };
  },
  methods: {
    async createWorkspace() {
      this.vuelidate.$touch();

      if (this.vuelidate.$errors.length > 0) {
        return;
      }

      this.loading = true;

      try {
        const response = await this.$store.dispatch(
          "WorkspaceModule/createWorkspace",
          this.formData
        );

        if (!response.success) {
          this.Toast("Failed to create workspace", "", "error");
          this.$emit("workSpaceAddFailed", response.errors);

          return;
        }

        this.Toast("New workspace created", "", "success", 5000);

        this.$emit("workSpaceAddSuccess", response.data);
      } catch (e) {
        this.$emit("workSpaceAddError", e);
        this.ToastError(e, "createWorkspace");
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
  },
  validations() {
    return {
      formData: {
        name: {
          minLength: minLength(4),
          required,
        },
      },
    };
  },
};
</script>
