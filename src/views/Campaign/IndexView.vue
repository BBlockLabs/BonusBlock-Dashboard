<template>
  <page-wrapper>
    <el-row>
      <el-col>
        Campaign Index
        <router-link to="/campaign/add">Add new</router-link>
      </el-col>
    </el-row>
  </page-wrapper>
</template>

<script setup lang="ts">
import PageWrapper from "@/components/PageWrapper.vue";
</script>
