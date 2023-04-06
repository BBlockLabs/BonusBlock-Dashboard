import type {BaseValidation, ErrorObject} from "@vuelidate/core";

export interface FormItemErrorAttributes {
  validateStatus: 'error' | '';
  error: string;
}

export default class ValidationHelper {
  static getValidationMessage(validation: BaseValidation): string {
    if (!validation.$error) {
      return '';
    }

    return validation.$errors
      .map(ValidationHelper.getErrorMessage)
      .reduce((accumulator: string, message: string): string => {
        return accumulator + "\n" + message;
      }, '');
  }

  static getErrorMessage(error: ErrorObject): string {
    switch (error.$validator) {
      case 'required': {
        return "The field is required";
      }
    }

    return <string> error.$message;
  }

  static getValidateStatus(validation: BaseValidation): 'error' | '' {
    if (validation.$error) {
      return 'error';
    }

    return '';
  }

  static getFormItemErrorAttributes(validation: BaseValidation): FormItemErrorAttributes {
    return {
      error: ValidationHelper.getValidationMessage(validation),
      validateStatus: ValidationHelper.getValidateStatus(validation),
    };
  }
}
