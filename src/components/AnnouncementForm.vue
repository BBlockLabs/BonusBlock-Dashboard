<template>
  <el-form>
    <el-form-item label="Banner">
      <el-upload
        class="upload-demo"
        drag
        :http-request="() => fileUpload(...arguments)"
      >
        <div class="el-upload__text">
          Drop file here or <em>click to upload</em>
        </div>

        <template #tip>
          <div class="el-upload__tip">
            jpg/png files with a size less than 500kb
          </div>
        </template>
      </el-upload>
      The banner must be 16:9 Aspect ratio and no less than 1200x675 pixels. PNG
      or JPG only. No transparency.
    </el-form-item>

    <el-form-item label="Title">
      <el-input v-model="value.title" placeholder="Please input" />
    </el-form-item>

    <el-form-item label="Description">
      <el-text v-model="value.description" />
    </el-form-item>

    <el-form-item label="Social X">
      <social-input v-model="value.socials[0]" />
    </el-form-item>
  </el-form>
</template>

<script>
import SocialInput from "@/components/SocialInput.vue";
import AnnouncementFormObject from "@/common/Form/AnnouncementFormObject.js";

export default {
  components: {
    SocialInput,
  },
  props: {
    modelValue: {
      type: AnnouncementFormObject,
      default: () => new AnnouncementFormObject(),
    },
  },
  emits: ["modelValue:update"],
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
  methods: {
    fileUpload(options) {
      console.log(options);

      return new Promise({});
    },
  },
};
</script>
