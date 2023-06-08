<template>
  <div style="height: 100%; display: flex; flex-direction: column">
    <el-container class="h-100" style="padding-left: 20px">
      <el-main class="pos-relative">
        <div class="pos-absolute w-100">
          <div style="margin-right: 20px">
            <h1>Welcome, {{ $store.state.Project.currentProject?.title }}!</h1>
            <h2>Kickstart with one of the things below:</h2>
            <el-space wrap fill :fill-ratio="25" class="w-100 home-panels">
              <div class="p-4">
                <el-row align="middle" class="flex-nowrap">
                  <el-col :span="-1" class="flex-noshrink" style="width: 4.3em">
                    <div class="home-icon">
                      <svg-megaphone />
                    </div>
                  </el-col>
                  <el-col :span="-1" class="pl-2 ml-1">
                    <h3 class="m-0">Set up your campaign</h3>
                    Set up your first on-chain incentive campaign
                  </el-col>
                </el-row>
                <el-row justify="end" class="mt-3">
                  <el-button
                    round
                    type="primary"
                    @click="$router.push('/campaign/add')"
                  >
                    Create campaign
                  </el-button>
                </el-row>
              </div>
              <div class="p-4">
                <el-row align="middle" class="flex-nowrap">
                  <el-col :span="-1" class="flex-noshrink" style="width: 4.3em">
                    <div class="home-icon">
                      <svg-add-user />
                    </div>
                  </el-col>
                  <el-col :span="-1" class="pl-2 ml-1">
                    <h3 class="m-0">Invite members</h3>
                    1 member
                  </el-col>
                </el-row>
                <el-row justify="end" class="mt-3">
                  <el-button round type="primary" disabled
                    >Coming soon</el-button
                  >
                </el-row>
              </div>
              <div class="p-4">
                <el-row align="middle" class="flex-nowrap">
                  <el-col :span="-1" class="flex-noshrink" style="width: 4.3em">
                    <div class="home-icon">
                      <svg-chat-bubble />
                    </div>
                  </el-col>
                  <el-col :span="-1" class="pl-2 ml-1">
                    <h3 class="m-0">Need help?</h3>
                    Feel free to contact us! We will be always there with you!
                  </el-col>
                </el-row>
                <el-row justify="end" class="mt-3">
                  <el-link
                    style="text-decoration: none"
                    type="primary"
                    href="https://t.me/MrX01010101010"
                    target="_blank"
                  >
                    <svg-telegram />
                  </el-link>
                  <el-link
                    type="primary"
                    href="mailto:team@bonusblock.io"
                    target="_blank"
                  >
                    <svg-email />
                  </el-link>
                  <el-link
                    type="primary"
                    href="https://calendly.com/bonusblock/30min"
                    target="_blank"
                  >
                    <svg-phone />
                  </el-link>
                </el-row>
              </div>
            </el-space>
            <h2>How it works?</h2>
            <el-space wrap class="w-100 info-steps">
              <div v-for="(step, i) in steps" :key="i" class="step">
                <div class="img" :class="'step' + (i + 1)"></div>
                <el-row>
                  <el-col class="align-center step-number" :span="3">
                    <h1>{{ i + 1 }}</h1>
                  </el-col>
                  <el-col
                    class="step-text pl-3 d-flex align-items-center"
                    :span="21"
                  >
                    {{ step }}
                  </el-col>
                </el-row>
              </div>
            </el-space>
            <el-row class="w-100 premium mt-3">
              <el-col :span="14">
                <div class="premium-img"></div>
              </el-col>
              <el-col
                :span="9"
                class="d-flex align-items-center justify-content-center"
              >
                <el-row class="flex-column">
                  <h3 class="m-0">Premium Service</h3>

                  <p>Quality audience versus everyone.</p>

                  <el-button round size="large" type="info" disabled
                    >Coming soon</el-button
                  >
                </el-row>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import SvgMegaphone from "@/assets/icons/megaphone.svg";
import SvgAddUser from "@/assets/icons/add-user.svg";
import SvgChatBubble from "@/assets/icons/chat-bubble.svg";
import SvgTelegram from "@/assets/icons/telegram.svg";
import SvgEmail from "@/assets/icons/email.svg";
import SvgPhone from "@/assets/icons/phone.svg";

export default {
  components: {
    SvgMegaphone,
    SvgAddUser,
    SvgChatBubble,
    SvgTelegram,
    SvgEmail,
    SvgPhone,
  },
  data() {
    return {
      steps: [
        "Set up the incentive reward pool campaign",
        "Create on-chain activity logic (no integration needed)",
        "Prepare your announcement!",
        "Track your ROI, user grow and user retention and more!",
      ],
    };
  },
  async created() {},
};
</script>
<style lang="scss">
@use "@/design/vars.scss" as v;

.info-steps {
  .el-space__item {
    width: calc(25% - 8px);
    background-color: v.$color-lighter;
    border-radius: 0.75em;
  }

  .step {
    .img {
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
      width: 100%;
      height: 17em;

      &.step1 {
        background-image: url("@/assets/images/step1.png");
      }

      &.step2 {
        background-image: url("@/assets/images/step2.png");
      }

      &.step3 {
        background-image: url("@/assets/images/step3.png");
      }

      &.step4 {
        background-image: url("@/assets/images/step4.png");
      }
    }

    .step-number {
      h1 {
        margin-top: 10px;
        margin-bottom: 10px;
      }
    }

    .step-text {
    }
  }
}

.premium {
  background-color: v.$color-primary-light-9;

  .premium-img {
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    width: 100%;
    height: 17em;
    background-image: url("@/assets/images/premium.png");
  }
}

.home-panels {
  .el-space__item {
    width: 28em;
    background-color: v.$color-lighter;
    border-radius: 0.75em;
  }

  .home-icon {
    width: 100%;
    height: 4em;
    background-color: v.$color-primary-light-7;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.75em;

    svg {
      height: 2.5em;
      width: auto;
      margin: 0;
    }
  }

  svg {
    height: 2em;
    width: auto;
    margin: 0 0.25em 0 0;
  }
}

@media only screen and (max-width: 929px) {
  .info-steps {
    .el-space__item {
      width: 100% !important;
    }
  }
}
@media only screen and (max-width: 1700px) {
  .info-steps {
    .el-space__item {
      width: calc(50% - 8px);
    }
  }
}
</style>
