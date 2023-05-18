export default class ValidationHelper {
  /**
   * @param {import('@vuelidate/core').BaseValidation} validation
   * @returns {string}
   */
  static getValidationMessage(validation) {
    if (!validation.$error) {
      return "";
    }

    return validation.$errors
      .map(ValidationHelper.getErrorMessage)
      .reduce((accumulator, message) => {
        return accumulator + "\n" + message;
      }, "");
  }

  /**
   * @param {import('@vuelidate/core').ErrorObject} error
   * @returns {string}
   */
  static getErrorMessage(error) {
    switch (error.$validator) {
      case "required":
        return "The field is required";
      case "is500Dolars":
        return "Must be at minimum value of 500$";
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
    return {
      error: ValidationHelper.getValidationMessage(validation),
      validateStatus: ValidationHelper.getValidateStatus(validation),
    };
  }
}
