import { useState,  } from 'react'
import SimpleReactValidator from 'simple-react-validator';
import { errorMessages } from '../config/messages.config';

const useValidator = (customMessage = {}, customValidator: any = {}) => {


  let customValidations = {
    // For Custom error message in Maximum Administrators
    maxAdministrators: {
      message: errorMessages.NumberOfAdministrators_NotMoreThan_Users,
      rule: (value: any, params: any, validator: any) => {
        if (parseFloat(value) > parseFloat(params[0])) {
          return value === params[0];
        }
      },
      require: true,
    },
    validUrl: {
      message: errorMessages.URLFormat,
      rule: (val: any, validator: any) => {
        /* eslint-disable no-useless-escape */
        const urlReg = /(https?:\/\/(.+?\.)?davigold\.tech(\/[A-Za-z0-9\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;\=]*)?)/;
        if (!urlReg.test(val)) {
          return false;
        }
      },
      // required: true,
    },
    ...customValidator
  };

  const [show, setShow] = useState(false)
  const validator = new SimpleReactValidator({
    messages: customMessage,
    validators: customValidations
  })

  if (show) {
    validator.showMessages()
  }
  return [validator, setShow] as const
}

export default useValidator