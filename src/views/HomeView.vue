<template>
  <el-main class="d-flex flex-column">
    <el-row justify="center" class="my-auto" :gutter="20">
      <el-col :md="6" :xl="5" class="my-small">
        <el-button size="large" class="w-100" @click="onMetamaskLogin">
          <svg-metamask-fox class="mr-medium icon-medium" />
          <b>Continue with Metamask</b>
        </el-button>
      </el-col>

      <el-col :md="6" :xl="5" class="my-small">
        <el-button size="large" class="w-100" @click="keplrDialog = true">
          <svg-keplr types="vite-svg-loader" class="mr-medium icon-medium" />
          <b>Continue with Keplr</b>
        </el-button>
      </el-col>
    </el-row>

    <dialog-keplr v-model:open="keplrDialog" @connect="onKeplrLogin" />
  </el-main>
</template>

<script setup lang="ts">
import DialogKeplr from "@/components/KeplrDialog.vue";
import SvgKeplr from "@/assets/icons/keplr.svg?component";
import SvgMetamaskFox from "@/assets/icons/metamask-fox.svg?component";
import type { Ref } from "vue";
import { Router, useRoute, useRouter } from "vue-router";
import { StoreType, useStore } from "@/store";
import { ref, onMounted } from "vue";
import MetamaskClient from "@/common/MetamaskClient";

const store: StoreType = useStore();
const router: Router = useRouter();
const route = useRoute();

const keplrDialog: Ref<boolean> = ref(false);

async function onMetamaskLogin(): Promise<void> {
  try {
    await MetamaskClient.metamaskLogin(
      store,
      route.query.ref
        ? String(route.query.ref)
        : route.query.r
        ? String(route.query.r)
        : null
    );
  } catch (e: any) {
    // All errors should be handled in metamaskLogin already
    return;
  }

  await router.push("/dashboard");
}

async function onKeplrLogin(): Promise<void> {
  keplrDialog.value = false;
  await router.push("/dashboard");
}

onMounted(() => {
  if ("metamask-login" in route.query) {
    onMetamaskLogin();
  }
});
</script>
