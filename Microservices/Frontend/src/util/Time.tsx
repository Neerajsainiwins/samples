import moment from "moment"
// import PhoneInput from 'react-phone-number-input'
// import { useState } from "react";
export const now=(): number =>{
    return moment().unix();
  };
export const dateFormat =(date:any)=>{ 
    return(
        (moment(date).format('MM/DD/YYYY'))
    )
}