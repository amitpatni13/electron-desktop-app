import { ConstMessages } from '../Constants/ErrorMessages';

export class ValidationHelper {


    public static getValidationErrorMessage(validatorName: string, validatorValue?: any) {

        const config = {
            invalidText: ConstMessages.ErrorCode.INVALID_TEXT,
            invalidNumber_Decimal: ConstMessages.ErrorCode.INVALID_NUMBER_DECIMAL,
            invalidAlphanumeric: ConstMessages.ErrorCode.INVALID_ALPHANUMERIC,
            invalidDecimal: ConstMessages.ErrorCode.INVALID_DECIMAL,
            required: ConstMessages.ErrorCode.REQUIRED,
            invalidCreditCard: ConstMessages.ErrorCode.INVALID_CREDIT,
            invalidEmailAddress: ConstMessages.ErrorCode.ERROR_INVALID_EMAILID,
            invalidPercentValue: ConstMessages.ErrorCode.INVALID_PERCENTAGE_VALUE,
            invalidPassword: ConstMessages.ErrorCode.INVALID_PASSWORD,
            invalidNumber: ConstMessages.ErrorCode.INVALID_NUMBER,
            GSTINNumber: ConstMessages.ErrorCode.GSTIN_NUMBER,
            PANNumber: ConstMessages.ErrorCode.PAN_NUMBER,
            minlength: `Minimum length ${validatorValue.requiredLength}`, // need to verify on all the pages
            maxlength: `Maximum length ${validatorValue.requiredLength}` // need to verify on all the pages
        };

        return config[validatorName];
    }


    public static textValidator(control) {
        if (control.value === undefined) { return null; } // To make the app not crash in case it is undefined
        if (control.value) {
            if (0 === control.value.length || control.value.match(/^[a-zA-Z]*$/)) {
                return null;
            } else {
                return { invalidText: true };
            }
        }
    }

    public static alphanumericValidator_Space(control) {
        // console.log("Control AlphaNumeric Validator Value : "+ control.value);
        if (control.value === undefined) { return null; }
        if (control.value) {
            if (0 === control.value.length || control.value.match(/^[a-zA-Z\s0-9]+$/)) {
                return null;
            } else {
                return { invalidAlphanumeric: true };
            }
        }
    }
    public static AllowAllExceptStar(control) {
        // console.log("Control AlphaNumeric Validator Value : "+ control.value);
        if (control.value === undefined) { return null; }
        if (control.value) {
            if (0 === control.value.length || control.value.match(/^[a-zA-Z\s0-9_@!#$₹%&<>()\-\/|.,;+"'+/=?:^_`{|}-~]+$/)) {
                return null;
            } else {
                return { invalidAlphanumeric: true };
            }
        }
    }
    public static text_Space(control) {
        // console.log("Control AlphaNumeric Validator Value : "+ control.value);
        if (control.value === undefined) { return null; }
        if (control.value) {
            if (0 === control.value.length || control.value.match(/^[a-zA-Z\s]+$/)) {
                return null;
            } else {
                return { invalidText: true };
            }
        }
    }

    public static number_DecimalValidator(control) {
        // console.log("Control Decimal Validator Value : "+ control.value);
        if (control.value === undefined) { return null; }
        if (control.value) {
            if (0 === control.value.length || (control.value + '').match(/^[0-9]+([.][0-9]+)?$/)) {
                return null;
            } else {
                return { invalidNumber_Decimal: true };
            }
        }
    }

    public static Name_Validator(control) {
        // console.log("Control Decimal Validator Value : "+ control.value);
        if (control.value === undefined) { return null; }
        if (control.value) {
            if (0 === control.value.length || (control.value + '').match(/^[a-zA-Z0-9]{1}/)) {
                return null;
            } else {
                return { invalidText: true };
            }
        }
    }

    public static GSTIN_Validator(control) {
        // console.log("Control Decimal Validator Value : "+ control.value);
        if (control.value === undefined) { return null; }
        if (control.value) {
            // tslint:disable-next-line:max-line-length
            if (0 === control.value.length || (control.value + '').match(/^([0-3]){1}([0-9]){1}([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}([a-zA-Z0-9]){1}([a-zA-Z1-9]){1}([a-zA-Z0-9]){1}$/)) {
                return null;
            } else {
                return { GSTINNumber: true };
            }
        }
    }

    public static PAN_Validator(control) {
        // console.log("Control Decimal Validator Value : "+ control.value);
        if (control.value === undefined) { return null; }
        if (control.value) {
            if (0 === control.value.length || (control.value + '').match(/^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}/)) {
                return null;
            } else {
                return { PANNumber: true };
            }
        }
    }

    public static numberValidator(control) {
        if (control.value === undefined) { return null; }
        if (control.value) {
            // console.log("Control Number Validator Value : "+ control.value);
            if (0 === control.value.length || (control.value + '').match(/^[0-9]\d*$/)) {
                return null;
            } else {
                return { invalidNumber: true };
            }
        }
    }

    public static alphanumericValidator(control) {
        if (control.value === undefined) { return null; }
        if (0 === control.value.length || control.value.match(/^[a-zA-Z0-9]+$/)) {
            return null;
        } else {
            return { invalidAlphanumeric: true };
        }
    }

    public static decimalValidator(control) {
        if (control.value === undefined) { return null; }
        if (0 === control.value.length || control.value.match(/^[0-9]+([.][0-9]+)?$/)) {
            return null;
        } else {
            return { invalidDecimal: true };
        }
    }


    public static creditCardValidator(control) {
        // Visa, MasterCard, American Express, Diners Club, Discover, JCB
        if (control.value === undefined) { return null; }
        if (control.value) {
            // tslint:disable-next-line:max-line-length
            if (0 === control.value.length || control.value.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)) {
                return null;
            } else {
                return { invalidCreditCard: true };
            }
        }
    }

    public static emailValidator(control) {
        if (control.value === undefined) { return null; }
        // tslint:disable-next-line:max-line-length
        if (0 === control.value.length || control.value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            return null;
        } else {
            return { invalidEmailAddress: true };
        }
    }

    public static passwordValidator(control) {
        // {6,20}           - Assert password is between 6 and 20 characters
        // (?=.*[0-9])       - Assert a string has at least one number
        if (control.value === undefined) { return null; }
        if (control.value) {
            if (0 === control.value.length || control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,20}$/)) {
                return null;
            } else {
                return { invalidPassword: true };
            }
        }
    }

    // To validate the correct percentage value entered
    public static FinalBillPage_PercentageValueValidator(control) {
        // console.log("Control Percentage Validator Value : "+ control.value);
        if (undefined === control.value || null === control.value || '' === control.value) {
            return null;
        } else if (String(control.value).match(/^[0-9]+([,.][0-9]+)?$/) && Number(control.value) >= 0 && Number(control.value) <= 100) {
            return null;
        } else {
            return { invalidPercentValue: true };
        }
    }


    /*Validator Methods for final Bill Page and Invalid Data in BizLogic Methods */

    // To Validate if the entered value is a alphanumeric or not
    isValidAlphanumericValue(value) {
        // console.log("Control AlphaNumeric Validator Value : "+ value);
        if (value === undefined) { return false; }
        if (value.length === 0 || value == null) { return true; }
        if (String(value).match(/^([a-zA-Z0-9_-]+)$/)) {
            return true;
        }
        return false;
    }

    // To Validate if the entered value is a number or not
    isValidNumericValue(value) { // true: error, false: continue
        // console.log("Control Decimal Validator Value : "+ value);
        if (value === undefined) { return false; }
        if (value.length === 0 || value == null) { return true; }
        // let strVal: string = value.toString();
        // for(let index=0; index<strVal.length; index++)
        //     if(strVal.charAt(index) == "+" || strVal.charAt(index) == "-"|| strVal.charAt(index) == "e") return true;
        if (String(value).match(/^[0-9]+([.][0-9]+)?$/) && !isNaN(Number(value)) && Number(value) >= 0) {
            return true;
        }
        return false;
    }

    // To validate the percentage value entered
    isValidPercentValue(value) {
        if (value === undefined) { return false; }
        if (value.length === 0 || value === null) { return true; }
        // let strVal: string = value.toString();
        // if(strVal.match(/^[0-9]+([.][0-9]+)?$/)) console.log("Percent value matched: " + strVal);
        if (String(value).match(/^[0-9]+([.][0-9]+)?$/) && !isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 100) {
            return true;
        }
        return false;
    }
}
