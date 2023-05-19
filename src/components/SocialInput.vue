<template>
  <el-input
    v-model="value.link"
    placeholder="Please input"
    class="input-with-select"
  >
    <template #prepend>
      <el-select v-model="value.type" placeholder="Select">
        <el-option label="Twitter" value="twitter" />
        <el-option label="Telegram" value="telegram" />
        <el-option label="Discord" value="discord" />
        <el-option label="YouTube" value="youtube" />
        <el-option label="Reddit" value="reddit" />
        <el-option label="Website" value="website" />
        <el-option label="Blog" value="blog" />
        <el-option label="Newsletter" value="newsletter" />
      </el-select>
    </template>
    <template v-if="id > 0" #append>
      <delete-button @click="$emit('inputDeleted', id)" />
    </template>
  </el-input>
</template>

<script>
import Social from "@/state/models/Social.js";
import DeleteButton from "@/components/DeleteButton.vue";

export default {
  components: {
    DeleteButton,
  },
  props: {
    id: {
      type: Number,
      default: 0,
    },
    modelValue: {
      type: Social,
      default: () => new Social(),
    },
  },
  emits: ["modelValue:update", "inputDeleted"],
  data() {
    return {
      value: this.modelValue,
    };
  },
  watch: {
    value: {
      deep: true,
      handler() {
        this.$emit("modelValue:update", this.value);
      },
    },
    modelValue: {
      deep: true,
      handler() {
        this.value = this.modelValue;
      },
    },
  },
};
</script>
