
import styled from "styled-components";
import Colors from "../util/Colors"

const CustomCheckBox = styled.label`
  display: block;
  position: relative;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  min-height: 18px;
  @media screen and (max-width: 767px) {
    right: 15px;
  }
  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
    &:checked ~ .checkmark {
      background-color: ${Colors.blue};
      border: 2px solid ${Colors.blue};
    }
    &:checked ~ .checkmark:after {
      display: block;
    }
  }
  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 16px;
    width: 16px;
    background-color: ${Colors.white};
    border-radius: 3px;
    border: 2px solid ${Colors.grey};
    &:after {
      content: "";
      position: absolute;
      display: none;
      left: 4px;
      top: 0px;
      width: 5px;
      height: 9px;
      border: solid ${Colors.white};
      border-width: 0 2px 2px 0;
      -webkit-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transform: rotate(45deg);
    }
  }
`;

type CallbackFunctionVariadic = (...args: any) => void;

type CallbackFunction = () => void;

interface ICheckbox {
    onChange?: CallbackFunction | CallbackFunctionVariadic;
    value?: string;
    checked?: any;
    disabled?: any;
}
export default function CheckBox({
    value,
    onChange,
    checked,
    disabled = false

}: ICheckbox) {
    if (typeof checked === "undefined") {
        return <></>;
    }
    return (
        <CustomCheckBox>
            <input type="checkbox" onChange={onChange} disabled={disabled} checked={checked}></input> {value}
            <span className="checkmark"></span>
        </CustomCheckBox>

    );
}

