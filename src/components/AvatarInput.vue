<template>
  <label :for="$id('file-input')">
    <avatar
      v-bind="$attrs"
      :file="file"
    />

    <input
      :id="$id('file-input')"
      class="d-none"
      accept="image/png,image/jpeg"
      type="file"
      @change="fileChange"
    >
  </label>
</template>

<script>
import Avatar from '@/components/Avatar.vue';

export default {
  components: {
    Avatar,
  },
  props: {
    modelValue: {
      type: [File, Blob],
      default: null,
    },
  },
  emits: [
    'update:modelValue',
  ],
  data() {
    return {
      file: this.modelValue,
    };
  },
  watch: {
    modelValue() {
      this.file = this.modelValue;
    },
    file() {
      this.$emit('update:modelValue', this.file);
    }
  },
  methods: {
    fileChange(event) {
      const fileset = event.target.files;

      if (!fileset) {
        this.file = null;
        return;
      }

      if (fileset.length === 0) {
        this.file = null;
        return;
      }

      this.file = fileset[0];
    },
  },
};
</script>
