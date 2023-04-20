<template>
  <el-row class="h-100" justify="center">
    <el-col :md="11" class="hidden-sm-and-down">
      <el-card class="h-100 img-home" shadow="never"></el-card>
    </el-col>

    <el-col class="hidden-sm-and-down" :md="1" />

    <el-col :md="11" class="d-flex flex-column justify-content-between">
      <el-row justify="space-between">
        <el-col :span="12" class="align-left">
          <!--h4 class="m-0">
            Not a project?
            <br />
            <router-link to="/register"> Register as user</router-link>
          </h4-->
        </el-col>
        <el-col :span="12" class="align-right bblock-logo">
          <b-block-logo />
        </el-col>
      </el-row>

      <el-row>
        <div class="m-auto w-50">
          <el-row justify="center">
            <el-col :span="-1">
              <h1 class="my-0">Create account</h1>
            </el-col>
          </el-row>

          <el-row justify="center" class="mt-2">
            <el-col :span="-1">
              Already have an account?
              <router-link to="/login"> Sign in</router-link>
            </el-col>
          </el-row>

          <el-row justify="center" class="mt-3">
            <el-col :span="-1">
              <sso-login-button
                :type="User.LOGIN_METHOD_KEPLR"
                @login-success="registered"
              />
              <sso-login-button
                :type="User.LOGIN_METHOD_METAMASK"
                @login-success="registered"
              />
              <!--              <sso-login-button
                :type="User.LOGIN_METHOD_GITHUB"
                @login-success="registered"
              />-->
            </el-col>
          </el-row>

          <el-row justify="center" class="mt-5 mb-5">
            <el-col>
              <div class="d-flex">
                <div class="bt-solid my-auto w-100" />
                <div class="mx-2 w-auto">or</div>
                <div class="bt-solid my-auto w-100" />
              </div>
            </el-col>
          </el-row>

          <el-row justify="center" class="mt-2">
            <el-col>
              <registration-form @register-success="registered" />
            </el-col>
          </el-row>
        </div>
      </el-row>
      <login-footer />
    </el-col>
  </el-row>
</template>

<script>
import SsoLoginButton from "@/components/SsoLoginButton.vue";
import RegistrationForm from "@/components/RegistrationForm.vue";
import User from "@/state/models/User";
import BBlockLogo from "@/assets/bblock/logo.svg";
import LoginFooter from "@/components/LoginFooter.vue";

export default {
  components: {
    SsoLoginButton,
    RegistrationForm,
    BBlockLogo,
    LoginFooter,
  },
  computed: {
    User: () => User,
  },
  methods: {
    registered() {
      this.$router.push("/create-project");
    },
  },
};
</script>
