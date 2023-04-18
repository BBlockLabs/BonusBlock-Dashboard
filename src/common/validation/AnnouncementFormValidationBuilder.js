import { required, minLength, maxLength } from "@vuelidate/validators";
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
    socials: [
      {
        type: {
          required,
        },
        link: {
          required,
        },
      },
    ],
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
