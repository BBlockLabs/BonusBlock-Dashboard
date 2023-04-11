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
                Welcome Back
              </h2>
            </el-col>
          </el-row>

          <el-row justify="center">
            <el-col :span="-1">
              <h1 class="my-0">
                Welcome Back
              </h1>
            </el-col>
          </el-row>

          <el-row
            justify="center"
            class="mt-2"
          >
            <el-col :span="-1">
              Not registered yet?
              <router-link to="/register">
                Sign up
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
                @login-success="loggedIn"
              />
              <sso-login-button
                :type="User.LOGIN_METHOD_METAMASK"
                @login-success="loggedIn"
              />
              <sso-login-button
                :type="User.LOGIN_METHOD_GITHUB"
                @login-success="loggedIn"
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
              <login-form @login-success="loggedIn" />
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
import LoginForm from '@/components/LoginForm.vue';
import Toast from '@/mixins/Toast';
import User from '@/state/models/User';

export default {
  components: {
    SsoLoginButton,
    LoginForm,
  },
  mixins: [
    Toast,
  ],
  computed: {
    User: () => User,
  },
  methods: {
    loggedIn() {
      if (this.$route.query?.from) {
        this.$router.push(this.$route.query.from);
        return;
      }

      this.$router.push('/');
    },
  }
};
</script>
