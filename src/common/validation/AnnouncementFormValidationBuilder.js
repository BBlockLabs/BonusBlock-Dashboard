import { required, minLength, maxLength, url } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import ValidationBuilder from "@/common/validation/ValidationBuilder.js";

export default class AnnouncementFormValidationBuilder extends ValidationBuilder {
  static validationRules = {
    banner: {
      required,
    },
    title: {
      required,
      minLength: minLength(3),
      maxLength: maxLength(255),
    },
    description: {
      required,
      maxLength: maxLength(300),
    },
    buttonLabel: {
      required,
      minLength: minLength(3),
      maxLength: maxLength(20),
    },
    buttonUrl: {
      required,
      minLength: minLength(3),
      maxLength: maxLength(255),
      url,
    },
    socials: {
      required,
      minLength: minLength(1),
      // I don't like that vuelidate removed $each..
      0: {
        type: { required },
        link: { required, url },
      },
      1: {
        type: {},
        link: { url },
      },
      2: {
        type: {},
        link: { url },
      },
      3: {
        type: {},
        link: { url },
      },
      4: {
        type: {},
        link: { url },
      },
      5: {
        type: {},
        link: { url },
      },
      6: {
        type: {},
        link: { url },
      },
      7: {
        type: {},
        link: { url },
      },
      8: {
        type: {},
        link: { url },
      },
      9: {
        type: {},
        link: { url },
      },
    },
  };

  /**
   * @inheritDoc
   * @return Ref<Validation>
   */
  static createValidation(validationObject) {
    return useVuelidate(
      AnnouncementFormValidationBuilder.validationRules,
      validationObject,
      { $autoDirty: true }
    );
  }
}
