import { Fragment } from "react";
import { Dropdown } from "semantic-ui-react";
interface IDropdownValidatorProps {
    dropdown: any;
    name: any;
    value: any;
    placeHolder?: any;
    simpleValidator?: any;
    handleChange: (name: any, value: any) => void,
    customValidator?: any,
    customMessage?: any,
    inputIcons?: any,
    className?: any,
    isMultiSelect?: boolean
    isSearchable?: boolean
    readonly?: any,
    noDropDownIcon?: boolean

}

const DropdownValidator = ({ dropdown, name, value, placeHolder, simpleValidator, handleChange, customValidator, isSearchable = true, readonly = false,
    customMessage, inputIcons, isMultiSelect = false,noDropDownIcon = false }: IDropdownValidatorProps) => {
    function onChange(e: any, dropdownValue: any) {
        let name = dropdownValue.name;
        let value = dropdownValue.value;
        handleChange(name, value);
    }
    return (
        <Fragment>
            <Dropdown fluid multiple={isMultiSelect} selection search={isSearchable} minCharacters={noDropDownIcon ? 2 : 0}  disabled={readonly}
                options={dropdown} name={name} value={value} className={`${isMultiSelect ? "multiSelect chooseMultiOption" : "multiSelect chooseMultiOption1"} ${noDropDownIcon && "noDropDownIcon"}`} onChange={(e, dropdownValue) => onChange(e, dropdownValue)} />
            {simpleValidator && <p className="invalid-feedback" style={{ color: "red" }}>{simpleValidator.message(name, value, customValidator, { messages: customMessage })}</p>}
        </Fragment>
    );
};

export default DropdownValidator;