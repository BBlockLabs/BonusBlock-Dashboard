<template>
  <el-form
    v-loading="loading"
    @submit.prevent="register"
  >
    <el-row justify="center">
      <el-col>
        <el-form-item
          :error="getErrorMessage(vuelidate.formData.username)"
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
          :error="getErrorMessage(vuelidate.formData.password)"
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

    <el-row
      v-if="vuelidate.formData.password.$dirty || formData.password"
      justify="center"
    >
      <el-col>
        <el-form-item
          :error="getErrorMessage(vuelidate.formData.passwordRepeat)"
        >
          <el-input
            v-model="formData.passwordRepeat"
            size="large"
            type="password"
            placeholder="Repeat password"
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
          @click="register"
        >
          Register
        </el-button>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import Toast from '@/mixins/Toast';
import Vuelidate from '@/mixins/Vuelidate';
import {required, minLength, sameAs} from '@vuelidate/validators';

export default {
  mixins: [
    Toast,
    Vuelidate,
  ],
  emits: [
    'registerSuccess',
    'registerFailed',
    'registerError',
  ],
  data() {
    return {
      formData: {
        username: '',
        password: '',
        passwordRepeat: '',
      },
      loading: false,
    };
  },
  methods: {
    async register() {
      this.vuelidate.$touch();

      if (this.vuelidate.$errors.length > 0) {
        return;
      }

      this.loading = true;

      try {
        const registrationData = {
          username: this.formData.username,
          password: this.formData.password,
        };

        const response = await this.$store.dispatch('Auth/register', registrationData);

        if (!response.success) {
          this.Toast(
            'Failed to register',
            '',
            'error'
          );
          this.$emit('registerFailed', response.errors);

          return;
        }

        this.Toast(
          'Registration successfully',
          '',
          'success'
        );

        this.$emit('registerSuccess', response.data);
      } catch (e) {
        this.$emit('registerError', e);
        this.ToastError(e, 'register');
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    /**
     * @param {any} el
     * @return {string}
     */
    getErrorMessage(el) {
      if (!el || !el.$dirty) {
        return '';
      }

      if (el.sameAsPassword && el.sameAsPassword.$invalid) {
        return 'Passwords do not match';
      }

      return this.getVuelidateErrorMessage(el);
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
        passwordRepeat: {
          sameAsPassword: sameAs(this.formData.passwordRepeat),
          required,
        },
      },
    };
  },
};
</script>
