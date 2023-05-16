import {
  maxLength,
  minLength,
  required,
  url,
  helpers,
} from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import ValidationBuilder from "@/common/validation/ValidationBuilder.js";

const handleOrUrl = helpers.withMessage(
  ({ $pending, $invalid, $params, $model }) => {
    return "Invalid value"; // TODO: add fancy messages by social type
  },
  (value, siblings) => {
    if (siblings.type === null) {
      return true;
    } else if (siblings.type === "telegram") {
      return value.startsWith("@");
    } else {
      return value.startsWith("https://");
    }
  }
);

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
    seoField: {
      minLength: minLength(3),
      maxLength: maxLength(20),
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
        type: {},
        link: { handleOrUrl },
      },
      1: {
        type: {},
        link: { handleOrUrl },
      },
      2: {
        type: {},
        link: { handleOrUrl },
      },
      3: {
        type: {},
        link: { handleOrUrl },
      },
      4: {
        type: {},
        link: { handleOrUrl },
      },
      5: {
        type: {},
        link: { handleOrUrl },
      },
      6: {
        type: {},
        link: { handleOrUrl },
      },
      7: {
        type: {},
        link: { handleOrUrl },
      },
      8: {
        type: {},
        link: { handleOrUrl },
      },
      9: {
        type: {},
        link: { handleOrUrl },
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
      { $autoDirty: false }
    );
  }
}
