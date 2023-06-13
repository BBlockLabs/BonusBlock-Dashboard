export default class ValidationHelper {
  /**
   * @param {import('@vuelidate/core').BaseValidation} validation
   * @returns {string}
   */
  static getValidationMessage(validation) {
    if (!validation.$error) {
      return "";
    }

    return validation.$errors[0].$message;
  }

  /**
   * @param {import('@vuelidate/core').ErrorObject} error
   * @returns {string}
   */
  static getErrorMessage(error) {
    switch (error.$validator) {
      case "required":
        return "The field is required";
    }

    return error.$message;
  }

  /**
   * @param {import('@vuelidate/core').BaseValidation} validation
   * @returns {"error" | ""}
   */
  static getValidateStatus(validation) {
    if (validation.$error) {
      return "error";
    }
    return "";
  }

  /**
   * @param {import('@vuelidate/core').BaseValidation} validation
   * @returns {{ validateStatus: "error" | "", error: string}}
   */
  static getFormItemErrorAttributes(validation) {
    if (!validation) {
      return {};
    }

    return {
      error: ValidationHelper.getValidationMessage(validation),
      validateStatus: ValidationHelper.getValidateStatus(validation),
    };
  }

  /**
   * @param {import('@vuelidate/core').BaseValidation} validation
   * @returns {string}
   */
  static getAllErrors(validation) {
    if (!validation.$error) {
      return "";
    }
    let messages = [];
    for (const error of validation.$errors) {
      messages.push(error.$property + ": " + error.$message);
    }
    return messages.join("\n");
  }
}
