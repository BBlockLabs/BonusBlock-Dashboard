<template>
  <el-row class="h-100">
    <el-col
      hidden-sm-and-down
      :md="2"
    />
    <el-col :md="6">
      <div class="d-flex h-100">
        <div class="my-auto w-100">
          <el-row justify="center">
            <el-col :span="-1">
              <h2 class="my-0">
                Start for free
              </h2>
            </el-col>
          </el-row>

          <el-row justify="center">
            <el-col :span="-1">
              <h1 class="my-0">
                Create an account
              </h1>
            </el-col>
          </el-row>

          <el-row
            justify="center"
            class="mt-2"
          >
            <el-col :span="-1">
              Already a member?
              <router-link to="/login">
                Log in
              </router-link>
            </el-col>
          </el-row>

          <el-row
            justify="center"
            class="mt-3"
          >
            <el-col :span="-1">
              <sso-login-button
                :type="User.LOGIN_METHOD_KEPLR"
                @login-success="registered"
              />
              <sso-login-button
                :type="User.LOGIN_METHOD_METAMASK"
                @login-success="registered"
              />
              <sso-login-button
                :type="User.LOGIN_METHOD_GITHUB"
                @login-success="registered"
              />
            </el-col>
          </el-row>

          <el-row
            justify="center"
            class="mt-2"
          >
            <el-col>
              <div class="d-flex">
                <div class="bt-solid my-auto w-100" />
                <div class="mx-2 w-auto">
                  or
                </div>
                <div class="bt-solid my-auto w-100" />
              </div>
            </el-col>
          </el-row>

          <el-row
            justify="center"
            class="mt-2"
          >
            <el-col>
              <registration-form @register-success="registered" />
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
import SsoLoginButton from '@/components/SsoLoginButton.vue';
import RegistrationForm from '@/components/RegistrationForm.vue';
import User from '@/state/models/User';

export default {
  components: {
    SsoLoginButton,
    RegistrationForm,
  },
  computed: {
    User: () => User,
  },
  created() {
    this.$store.state.Auth.newUser = true;
  },
  methods: {
    registered() {
      this.$router.push('/create-workspace');
    },
  }
};
</script>
