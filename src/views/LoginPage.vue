<template>
  <el-row class="h-100" justify="center">

    <el-col :md="11" class="hidden-sm-and-down">
      <el-card class="h-100 img-home" shadow="never">
      </el-card>
    </el-col>

    <el-col
      class="hidden-sm-and-down"
      :md="1"
    />

    <el-col :md="11" class="d-flex flex-column justify-content-between">

      <el-row justify="space-between">
        <el-col :span="12" class="align-left">
          <h4 class="m-0">
            Not a project?
            <br/>
            <router-link to="/register">
              Register as user
            </router-link>
          </h4>
        </el-col>
        <el-col :span="12" class="align-right bblock-logo">
          <b-block-logo />
        </el-col>
      </el-row>

      <el-row>
        <div class="m-auto w-50">
          <el-row justify="center">
            <el-col :span="-1">
              <h1 class="my-0">
                Sign In
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
                <div class="bt-solid my-auto w-100"/>
                <div class="mx-2 w-auto">
                  or
                </div>
                <div class="bt-solid my-auto w-100"/>
              </div>
            </el-col>
          </el-row>

          <el-row
            justify="center"
            class="mt-2"
          >
            <el-col>
              <login-form @login-success="loggedIn"/>
            </el-col>
          </el-row>
        </div>
      </el-row>

      <el-row justify="space-between">
        <el-col :span="12" class="align-left">
          <social-links
            :twitter="LinkTwitter"
            :github="LinkGithub"
            :telegram="LinkTelegram"
            :reddit="LinkReddit"
          />
        </el-col>
        <el-col :span="12" class="align-right">
          <el-link href="/">
            Contact us
            <svg-telegram class="icon ml-1" />
          </el-link>
          <el-divider direction="vertical" />
          <el-link>
            Book a meeting
            <calendar class="icon ml-1" />
          </el-link>
        </el-col>
      </el-row>
    </el-col>

  </el-row>
</template>

<script>
import SsoLoginButton from "@/components/SsoLoginButton.vue";
import LoginForm from "@/components/LoginForm.vue";
import Toast from "@/mixins/Toast";
import User from "@/state/models/User";
import BBlockLogo from '@/assets/bblock/logo.svg';
import SocialLinks from "@/components/SocialLinks.vue";
import SvgTelegram from "@/assets/icons/telegram.svg?component";

export default {
  components: {
    SsoLoginButton,
    LoginForm,
    BBlockLogo,
    SocialLinks,
    SvgTelegram
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
  },
  data() {
    return {
      LinkGithub: import.meta.env.VITE_LINK_GITHUB,
      LinkTwitter: import.meta.env.VITE_LINK_TWITTER,
      LinkTelegram: import.meta.env.VITE_LINK_TELEGRAM,
      LinkReddit: import.meta.env.VITE_LINK_REDDIT
    }
  }
};
</script>

<style lang="scss">
.img-home {
  background-color: #FDF4E2;
  background-image: url('@/assets/images/home.png');
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  border: 1px solid black;
  border-top-left-radius: 0;
  border-bottom-right-radius: 0;
}
</style>
