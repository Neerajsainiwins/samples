import React from 'react';
import styled from "styled-components";
import PhoneInput from 'react-phone-input-2';
import "react-phone-input-2/lib/semantic-ui.css";
import Colors from './Colors';
import { useMobileMedia } from './MediaQuery';
import Label from './Label';

export enum PhoneNumberInputSizes {
  Regular = "Regular",
}

type ContainerProps = {
  margin?: string;
};
const Container = styled.div<ContainerProps>`
  margin: ${props => props.margin};
  width:100%
`;
type InnerContainerProps = {
  isMobile: boolean;
  phoneNumberInputSize?: string;
};
// overwrite the preset style imports
const InnerContainer = styled.div<InnerContainerProps>`
  .react-tel-input {
    font-size: ${props => props.isMobile ? '1.6rem' : '0.9rem'};
    position: relative;
    width: 100%;
    :disabled {
      cursor: not-allowed;
    }

    .form-control {
      transition: all 0.2s;
      color: ${Colors.black};
      font-weight: 500;
      position: relative;
      margin-top: 0 !important;
      margin-bottom: 0 !important;
      margin-left: 35px;
      padding-left: 0;
      background: ${Colors.white};
      border: 1px solid ${Colors.bordercolor};
      border-radius: 0px 10px 10px 0px !important;
      height: ${(props) => props.phoneNumberInputSize === PhoneNumberInputSizes.Regular ? '38px' : '45px'};
      width: calc(100% - 35px);
      border-left:none !important;
      z-index: 1;
      outline: none;
      font-family: 'euclid_circular_abold';
      padding-left: 0 !important;
      &:hover ,&:focus{
        border: 1px solid ${Colors.bordercolor};
        border-left:none !important;
      }
      &.invalid-number {
        border: 1px solid ${Colors.bordercolor};
        background-color: ${Colors.white};
        border-left-color: ${Colors.bordercolor};
        &:focus {
          border: 1px solid ${Colors.bordercolor};
          border-left-color: ${Colors.bordercolor};
          background-color: ${Colors.bordercolor};
          border-left:none;
        }
      }
      &.open {
        background-color: ${Colors.white};
        border-radius: 0px 10px 0 0;
        /* border-bottom: none; */
        box-shadow: none;
      }
      ::placeholder {
        color: ${Colors.grey4};
      }
      &:focus {
        border: 1px solid ${Colors.bordercolor};
      }
    }

    .flag-dropdown {
      outline: none;
      position: absolute;
      width: 100%;
      top: 0;
      bottom: 0;
      padding: 0;
      background-color: ${Colors.grey6};
      border: 1px solid ${Colors.grey5};
      border-radius: 10px;
      &.open {
        background-color: ${Colors.white};
        border-radius: 10px 10px 0 0;
        .selected-flag {
          background-color: ${Colors.white};
          border-radius: 10px 0 0 0;
        }
      }
      &:hover, &:focus {
        cursor: pointer;
        .selected-flag {
          background-color: ${Colors.white};
        }
      }
    }

    input[disabled] {
      &+.flag-dropdown {
        &:hover {
          cursor: default;
          .selected-flag {
            background-color: transparent;
          }
        }
      }
    }

    .selected-flag {
      transition: all 0.2s;
      background: ${Colors.white};
      position: relative;
      width: 50px;
      height: 100%;
      padding: 0 0 0 10px;
      border-radius: 10px 0 0 10px;
      .flag {
        position: absolute;
        top: 50%;
        margin-top: -7px;
        border-radius: 50%;
        height:16px ;
      }
      .arrow {
        position: relative;
        top: 50%;
        margin-top: -2px;
        left: 25px;
        width: 0;
        height: 0;
        border-left: 3px solid transparent;
        border-right: 3px solid transparent;
        border-top: 4px solid #555;
        display: none;
        &.up {
          border-top: none;
          border-bottom: 4px solid #555;
        }
      }
      &.open {
        z-index: 2;
      }
    }

    .country-list {
      z-index: 2;
      border-radius: 0 0 10px 10px;
      border: 1px solid ${Colors.grey5};
      border-top: none;
      list-style: none;
      position: absolute;
      padding: 0;
      margin: 0px 0 10px -1px;
      box-shadow: unset;
      background-color: ${Colors.white};
      width: calc(100% + 2px);
      max-height: ${props => props.isMobile ? '180px' : '200px'};
      overflow-y: scroll;
      .flag {
        display: inline-block;
      }
      .divider {
        padding-bottom: 5px;
        margin-bottom: 5px;
        border-bottom: 1px solid #ccc;
      }
      .country {
        padding: 7px 9px;
        .dial-code {
          color: #6b6b6b;
        }
        &:hover {
          background-color: #f1f1f1;
        }
        &.highlight {
          background-color: #f1f1f1;
        }
      }
      .flag {
        margin-right: 7px;
        margin-top: 2px;
        border-radius: 50%;
      }
      .country-name {
        margin-right: 6px;
      }
      .search {
        position: sticky;
        top: 0;
        background-color: ${Colors.white};
        padding: 5px 0 6px 10px;
      }
      .search-emoji {
        display: none;
        font-size: ${props => props.isMobile ? '1.6rem' : '1.4rem'};
      }
      .search-box {
        border: 1px solid #cacaca;
        border-radius: 3px;
        font-size: ${props => props.isMobile ? '1.6rem' : '1.4rem'};
        line-height: 15px;
        padding: 3px 8px 5px;
        outline: none;
      }
      .no-entries-message {
        padding: 7px 10px 11px;
        opacity: .7;
      }
      &::-webkit-scrollbar { width: 12px; }
      &::-webkit-scrollbar-track { background-color: #e6e6e6; }
      &::-webkit-scrollbar-thumb { background-color: #c5c5c4; border-radius: 5px; }
    }

    .invalid-number-message {
      position: absolute;
      z-index: 1;
      font-size: ${props => props.isMobile ? '1.6rem' : '1.4rem'};
      left: 46px;
      top: -8px;
      background: ${Colors.white};
      padding: 0 2px;
      color: #de0000;
    }
  }
`;

type PhoneNumberInputProps = {
  value: string;
  onChange: any;
  onEnter?: any;
  validationError?: string;
  subLabel?: string;
  tip?: string;
  placeholder?: string;
  label?: string;
  phoneNumberInputSize?: string;
  margin?: string;
  autoFocus?: boolean;
};
const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  value,
  onChange,
  onEnter,
  validationError,
  phoneNumberInputSize,
  subLabel,
  tip,
  label,
  margin,
  autoFocus,
}) => {
  return (
    <Container margin={margin}>
      {label && <Label text={label} subText={subLabel} tip={tip} />}
      <InnerContainer
        isMobile={useMobileMedia()}
        phoneNumberInputSize={phoneNumberInputSize}
      >
        <PhoneInput
          country="us"
          placeholder="Enter your mobile phone number"
          preferredCountries={["us", "ca"]}
          value={value} 
          onKeyDown={(e :any) => {
            // if ((e.which === 8 || e.which === 46) && value.length <= 1) {
            //   e.preventDefault() ;
            // } else if (e.which === 13 && onEnter) { 
            //   onEnter() ;
            // }
          }}
          onChange={(value:any) => {
            onChange(value);
          }}
          countryCodeEditable={false}
          inputProps={{
            autoFocus,
          }}
        />
      </InnerContainer>
    </Container>
  );
};

export default PhoneNumberInput;

