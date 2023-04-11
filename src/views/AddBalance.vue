<template>
  <el-row class="h-100">
    <el-col
      hidden-sm-and-down
      :md="2"
    />
    <el-col :md="6">
      <div
        v-if="wallet"
        class="d-flex h-100"
      >
        <div class="my-auto w-100">
          <el-row>
            <el-col :span="-1">
              <h1 class="my-0">
                Your Balance
              </h1>
            </el-col>
          </el-row>

          <el-row class="mt-2">
            <el-col :span="-1">
              Every user starts with 1500 $HOST for deployments! <br>
              You can also add more balance into your account.
            </el-col>
          </el-row>

          <el-row class="b-solid br-small mt-4 p-3 px-5">
            <el-col>
              <q-r :text="wallet.address" />
            </el-col>
          </el-row>

          <el-row
            class="b-solid br-small mt-3 p-3"
            justify="space-between"
          >
            <el-col :span="-1">
              Total Balance
            </el-col>

            <el-col :span="-1">
              <strong>
                {{ wallet.balance }} $HOST
              </strong>
            </el-col>
          </el-row>

          <el-row
            justify="center"
            class="mt-4"
          >
            <el-button
              type="primary"
              round
              @click="nextStep"
            >
              Continue
            </el-button>
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
import QR from '@/components/QR.vue';
import Toast from '@/mixins/Toast';

export default {
  components: {
    QR,
  },
  mixins: [
    Toast,
  ],
  computed: {
    wallet() {
      const wallets = this.$store.getters['WalletModule/authUserWallets'];

      if (wallets.length === 0) {
        return null;
      }

      return wallets[0];
    }
  },
  methods: {
    nextStep() {
      this.$router.push('/add-deployment');
    },
  }
};
</script>
