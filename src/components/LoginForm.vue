<template>
  <el-form
    v-loading="loading"
    @submit.prevent="login"
  >
    <el-row justify="center">
      <el-col>
        <el-form-item
          :error="getVuelidateErrorMessage(vuelidate.formData.username)"
        >
          <el-input
            v-model="formData.username"
            size="large"
            type="text"
            placeholder="Username"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row justify="center">
      <el-col>
        <el-form-item
          :error="getVuelidateErrorMessage(vuelidate.formData.password)"
        >
          <el-input
            v-model="formData.password"
            size="large"
            type="password"
            placeholder="Password"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row justify="center">
      <el-col :md="-1">
        <el-button
          round
          class="w-100"
          type="primary"
          @click="login"
        >
          Log in
        </el-button>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import Toast from '@/mixins/Toast';
import Vuelidate from '@/mixins/Vuelidate';
import {required, minLength} from '@vuelidate/validators';

export default {
  mixins: [
    Toast,
    Vuelidate,
  ],
  emits: [
    'loginSuccess',
    'loginFailed',
    'loginError',
  ],
  data() {
    return {
      formData: {
        username: '',
        password: '',
      },
      loading: false,
    };
  },
  methods: {
    async login() {
      this.vuelidate.$touch();

      if (this.vuelidate.$errors.length > 0) {
        return;
      }

      this.loading = true;

      try {
        const response = await this.$store.dispatch('Auth/login', this.formData);

        if (!response.success) {
          this.Toast(
            'Failed to login',
            '',
            'error'
          );
          this.$emit('loginFailed', response.errors);

          return;
        }

        this.Toast(
          'Log in successfully',
          '',
          'success'
        );

        this.$emit('loginSuccess', response.data);
      } catch (e) {
        this.$emit('loginError', e);
        this.ToastError(e, 'login');
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
  },
  validations() {
    return {
      formData: {
        username: {
          minLength: minLength(4),
          required,
        },
        password: {
          minLength: minLength(4),
          required,
        },
      },
    };
  },
};
</script>
