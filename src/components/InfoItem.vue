<template>
  <el-row justify="space-between" class="b-solid br-small p-3">
    <el-col :md="10">
      {{ title }}
    </el-col>

    <el-col :md="13" class="align-right of-hidden">
      <b>{{ value }}</b>
    </el-col>
    <el-col :md="1" class="align-left">
      <router-link v-if="link" :to="'/organizations/' + link">
        <open-in-window class="icon" />
      </router-link>
      <el-button v-if="copy" link @click="copyToClipboard(value)">
        <copy class="icon" />
      </el-button>
    </el-col>
  </el-row>
  <debug-wrapper>{{ $props }}</debug-wrapper>
</template>

<script>
import { OpenInWindow, Copy } from "iconoir-vue";
import CopyToClipBoard from "@/mixins/CopyToClipBoard";

export default {
  components: {
    Copy,
    OpenInWindow,
  },
  mixins: [CopyToClipBoard],
  props: {
    title: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number],
      required: true,
    },
    link: {
      type: [String, Object],
      default: null,
    },
    copy: {
      type: Boolean,
    },
  },
};
</script>
