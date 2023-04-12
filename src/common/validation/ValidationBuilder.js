import { useVuelidate } from "@vuelidate/core";

/**
 * @interface
 */
export default class ValidationBuilder {
  /**
   * @param {object} validationObject
   * @return Ref<Validation>
   */
  static createValidation(validationObject) {
    return useVuelidate({}, validationObject);
  }
}
