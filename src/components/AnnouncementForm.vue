<template>
  <el-form label-position="top">
    <h1 class="mt-0"><b>Create an announcement</b></h1>

    <el-form-item
      v-bind="ValidationHelper.getFormItemErrorAttributes(validate['banner'])"
      label="Banner"
    >
      <banner-select v-model="value.banner" />
    </el-form-item>

    <el-form-item
      v-bind="ValidationHelper.getFormItemErrorAttributes(validate['title'])"
      label="Title"
    >
      <el-input v-model="value.title" placeholder="Announcement title" />
    </el-form-item>

    <el-form-item
      v-bind="
        ValidationHelper.getFormItemErrorAttributes(validate['description'])
      "
      label="Description"
    >
      <el-input
        v-model="value.description"
        type="textarea"
        placeholder="Announcement description"
      />
      <sup class="text-secondary">Max 300 Characters</sup>
    </el-form-item>

    <el-form-item
      label="SEO"
      v-bind="ValidationHelper.getFormItemErrorAttributes(validate['seo'])"
    >
      <el-input
        v-model="value.seo"
        type="textarea"
        placeholder="Announcement SEO values"
      />
    </el-form-item>

    <el-form-item
      label="Button Label"
      v-bind="
        ValidationHelper.getFormItemErrorAttributes(validate['buttonLabel'])
      "
    >
      <el-input v-model="value.buttonLabel" placeholder="Button label" />
    </el-form-item>

    <el-form-item
      label="Button Link"
      v-bind="
        ValidationHelper.getFormItemErrorAttributes(validate['buttonUrl'])
      "
    >
      <el-input v-model="value.buttonUrl" placeholder="Button link" />
    </el-form-item>

    <el-form-item>
      <el-form-item
        v-for="idx in 10"
        v-bind="
          ValidationHelper.getFormItemErrorAttributes(
            validate['socials'][idx - 1]
          )
        "
        :key="idx - 1"
        class="w-100 mt-4"
        :label="`Social ${value.socials[idx - 1]?.type || 'X'}`"
      >
        <social-input v-model="value.socials[idx - 1]" />
      </el-form-item>
    </el-form-item>
  </el-form>
</template>

<script>
import SocialInput from "@/components/SocialInput.vue";
import AnnouncementFormObject from "@/common/Form/AnnouncementFormObject.js";
import AnnouncementFormValidationBuilder from "@/common/validation/AnnouncementFormValidationBuilder.js";
import ValidationHelper from "@/common/validation/ValidationHelper.js";
import Toast from "@/mixins/Toast.js";
import BannerSelect from "@/components/BannerSelect.vue";

export default {
  components: {
    SocialInput,
    BannerSelect,
  },
  mixins: [Toast],
  props: {
    modelValue: {
      type: AnnouncementFormObject,
      default: () => new AnnouncementFormObject(),
    },
    validation: {
      type: Object,
      default: () => null,
    },
  },
  emits: ["modelValue:update"],
  data() {
    return {
      value: this.modelValue,
    };
  },
  computed: {
    ValidationHelper: () => ValidationHelper,
    validate() {
      if (this.validation) {
        return this.validation;
      }

      const validation = AnnouncementFormValidationBuilder.createValidation(
        this.modelValue
      ).value;

      validation.$lazy = true;
      validation.$touch();

      return validation;
    },
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
