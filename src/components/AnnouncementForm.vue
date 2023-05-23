<template>
  <el-form label-position="top">
    <h1 class="mt-0"><b>Create an announcement</b></h1>

    <el-form-item
      v-bind="ValidationHelper.getFormItemErrorAttributes(validate['banner'])"
      label="Banner"
    >
      <banner-select v-model="value.banner" />
    </el-form-item>

    <el-card class="box-card" shadow="never">
      <h2>Announcement details</h2>
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
          placeholder="Description"
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
          placeholder="Description"
        />
        <sup class="text-secondary">Max 55 Characters</sup>
      </el-form-item>
    </el-card>

    <el-card class="box-card" shadow="never">
      <h2>Call to Action</h2>
      <el-row class="w-100">
        <el-col :span="12" class="pr-2">
          <el-form-item
            label="Button Label"
            v-bind="
              ValidationHelper.getFormItemErrorAttributes(
                validate['buttonLabel']
              )
            "
          >
            <template #label>
              <span>
                <label class="el-form-item__label">
                  Button Label
                  <el-tooltip
                    effect="light"
                    content="Button text that will be displayed under announcement section"
                    placement="top-start"
                    :offset="-40"
                  >
                    <el-icon class="tooltip-icon">
                      <InfoFilled />
                    </el-icon>
                  </el-tooltip>
                </label>
              </span>
            </template>
            <el-input v-model="value.buttonLabel" placeholder="Button label" />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="pl-2">
          <el-form-item
            v-bind="
              ValidationHelper.getFormItemErrorAttributes(validate['buttonUrl'])
            "
          >
            <template #label>
              <span>
                <label class="el-form-item__label">
                  Button Link
                  <el-tooltip
                    effect="light"
                    content="Link that will redirect when button is pressed"
                    placement="top-start"
                    :offset="-50"
                  >
                    <el-icon class="tooltip-icon">
                      <InfoFilled />
                    </el-icon>
                  </el-tooltip>
                </label>
              </span>
            </template>
            <el-input v-model="value.buttonUrl" placeholder="Button link" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="box-card" shadow="never">
      <el-row align="middle">
        <el-col :span="20"><h2>Social Links</h2></el-col>
        <el-col :span="4" class="align-right">
          {{ value.socials.length }} / 8
        </el-col>
      </el-row>
      <el-form-item>
        <el-form-item
          v-for="idx in value.socials.length"
          v-bind="
            ValidationHelper.getFormItemErrorAttributes(
              validate['socials'][idx - 1]
            )
          "
          :key="idx - 1"
          class="w-100 mt-4"
          :label="`Social ${
            capitalizeFirstLetter(value.socials[idx - 1]?.type) || 'X'
          }`"
        >
          <social-input
            :id="idx - 1"
            v-model="value.socials[idx - 1]"
            @input-deleted="removeSocial"
          />
        </el-form-item>
      </el-form-item>

      <el-row v-if="value.socials.length < 8" justify="center">
        <el-button size="large" round type="default" @click="addNewSocials">
          Add +
        </el-button>
      </el-row>
    </el-card>
  </el-form>
</template>

<script>
import SocialInput from "@/components/SocialInput.vue";
import AnnouncementFormObject from "@/common/Form/AnnouncementFormObject.js";
import AnnouncementFormValidationBuilder from "@/common/validation/AnnouncementFormValidationBuilder.js";
import ValidationHelper from "@/common/validation/ValidationHelper.js";
import Toast from "@/mixins/Toast.js";
import BannerSelect from "@/components/BannerSelect.vue";
import Social from "@/state/models/Social.js";

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
  methods: {
    removeSocial(id) {
      this.value.socials.splice(id, 1);
    },
    addNewSocials() {
      this.value.socials.push(new Social());
    },
    capitalizeFirstLetter(string) {
      if (!string) {
        return string;
      }
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
  },
};
</script>

<style lang="scss">
@use "@/design/vars.scss" as v;

.el-card__body {
  background-color: v.$color-lighter;
  border-radius: 0;
  margin-bottom: 1.5em;
  padding-top: 0.5em;
}
</style>
