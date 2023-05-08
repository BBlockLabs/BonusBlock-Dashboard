<template>
  <div v-loading="loading">
    <div v-if="payment.status === 'INITIATED'">
      <el-row v-loading="loading">
        <el-col>
          <el-button
            type="primary"
            class="w-100 my-2 p-4"
            @click="payWithMetamask"
          >
            <icon-metamask class="icon" />
            Deposit with Metamask
          </el-button>
        </el-col>

        <!--el-col>
          <el-button
            type="primary"
            class="w-100 my-2 p-4"
            @click="payWithKeplr"
          >
            <icon-keplr class="icon" />
            Deposit with Keplr
          </el-button>
        </el-col-->
      </el-row>

      <!--el-divider content-position="center">or</el-divider-->

      <div class="br-base b-solid p-3">
        <el-row justify="space-between">
          <el-col :span="-1">Wallet:</el-col>
          <el-col :span="-1">{{ payment.wallet }}</el-col>
        </el-row>
        <el-row justify="space-between">
          <el-col :span="-1">Memo:</el-col>
          <el-col :span="-1">{{ payment.memo }}</el-col>
        </el-row>
      </div>

      <div class="align-center my-3">
        The payment must be submitted within 30 minutes. You have
        {{ deadline.diff(time, "minutes") }} minutes left.
      </div>

      <el-row>
        <el-col :span="-1">
          Payment status check in {{ nextCheck.diff(time, "seconds") }} seconds
        </el-col>
        <el-col v-loading="true" :span="-1">&nbsp;</el-col>
      </el-row>

      <el-row justify="center" class="my-3">
        <el-col :span="-1">
          <el-button round @click="cancelPayment">Cancel Payment</el-button>
        </el-col>
      </el-row>
    </div>

    <el-alert
      v-if="payment.status === 'SUCCESS'"
      title="Payment successful"
      type="success"
    />
  </div>
</template>

<script>
import Payment from "@/state/models/Payment.js";
import moment from "moment";
import IconMetamask from "@/assets/icons/metamask.svg";
import detectEthereumProvider from "@metamask/detect-provider";
import { MetamaskClient } from "@/common/MetamaskClient.js";

export default {
  components: {
    IconMetamask,
  },
  props: {
    campaignId: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      checkPaymentTimeout: null,
      lastCheck: moment(),
      nextCheck: moment(),
      time: moment(),
      ticker: null,
    };
  },
  computed: {
    moment: () => moment,
    deadline() {
      return moment(this.payment.createdOn).add(30, "minutes");
    },
    payment() {
      return (
        this.$store.getters["Payment/getPayment"](this.paymentId) ||
        new Payment()
      );
    },
  },
  created() {
    this.checkPaymentStatus();

    this.ticker = setInterval(() => {
      this.time = moment();
    }, 1000);
  },
  unmounted() {
    clearInterval(this.ticker);
    clearTimeout(this.checkPaymentTimeout);
  },
  methods: {
    async checkPaymentStatus() {
      this.loading = true;

      const response = await this.$store.dispatch("Payment/getPaymentInfo", {
        campaignId: this.campaignId,
        paymentId: this.paymentId,
      });

      if (!response.success) {
        console.error(response.errors);
      }

      if (this.payment.status === "INITIATED") {
        this.lastCheck = moment();

        this.checkPaymentTimeout = setTimeout(() => {
          this.checkPaymentStatus();
        }, 30000);

        this.nextCheck = moment().add(30, "seconds");
      }
      this.loading = false;
    },
    async cancelPayment() {
      this.loading = true;

      this.$store.dispatch("Campaign/changeStatus", {
        campaignId: this.payment.campaignId,
        status: "CANCELLED",
      });

      this.loading = false;
    },
    /*async payWithKeplr() {
      this.loading = true;
      this.loading = false;
    },*/
    async payWithMetamask() {
      this.loading = true;
      const provider = await detectEthereumProvider({
        mustBeMetaMask: true,
        silent: true,
      });
      await MetamaskClient.sendTransaction(
        provider,
        this.payment.wallet,
        this.payment.amount,
        this.payment.memo
      );
      this.loading = false;
    },
  },
};
</script>
