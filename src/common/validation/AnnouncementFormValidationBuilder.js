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
    },
    socials: {
      required,
      minLength: minLength(1),
      $each: {
        type: {
          required,
        },
        link: {
          required,
          url,
        },
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
