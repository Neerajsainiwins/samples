import styled from "styled-components";
import Colors from "../../util/Colors";
import { FieldType } from "../../util/enum";
import APIdropdown from "./APIdropdown";
import CheckBoxInput from "./CheckBoxInput";
import DateValidator from "./DatePicker";
import InputValidator from "./InputValidator";
import TextEditor from "./TextEditor";



const BaseFormField = ({ field, onChange, validator }: any) => {


    const customValidator = (field: any) => {
        let validatorString = ''
        if (field.IsMandatory) {
            validatorString = 'required'
        }
        if (field.FieldTypeName === FieldType.Number) {
            validatorString = validatorString ? validatorString + '|number' : 'number';
        }
        if (field.FieldTypeName === FieldType.url) {
            validatorString = validatorString ? validatorString + '|validUrl' : 'validUrl';
        }
        return validatorString;
    }


    function handleChange(name: any, value: any) {
        
        onChange(name, value, field)
    }


    const renderInput = (field: any) => {
        debugger
        switch (field.FieldTypeName) {
            case FieldType.FreeText:
                return (<InputValidator
                    type={"text"}
                    name={field.FieldName}
                    simpleValidator={validator}
                    placeHolder={field.Placeholder}
                    handleChange={handleChange}
                    customValidator={customValidator(field)}
                    customMessage={""}
                    value={field?.Value}
                />);
            case FieldType.Number:
                return (<InputValidator
                    type={"text"}
                    name={field.FieldName}
                    simpleValidator={validator}
                    placeHolder={field.Placeholder}
                    handleChange={handleChange}
                    customValidator={customValidator(field)}
                    customMessage={""}
                    value={field?.Value}
                    numberOnly={true}
                />);
            case FieldType.url:
                return (<InputValidator
                    type={"text"}
                    name={field.FieldName}
                    simpleValidator={validator}
                    placeHolder={field.Placeholder}
                    handleChange={handleChange}
                    customValidator={customValidator(field)}
                    customMessage={""}
                    value={field?.Value}
                />)
                case FieldType.Amount:
                    return (<InputValidator
                        type={"text"}
                        name={field.FieldName}
                        simpleValidator={validator}
                        placeHolder={field.Placeholder}
                        handleChange={handleChange}
                        customValidator={customValidator(field)}
                        customMessage={""}
                        value={field?.Value}
                    />)
            case FieldType.SingleSelectDropdownList:
                return (<APIdropdown field={field} handleChange={handleChange} isSearchable={false} value={field?.Value} />);
            case FieldType.AutoSuggestMultipleContacts:
                return (<APIdropdown field={field} handleChange={handleChange} value={field?.Value} />);
            case FieldType.MultipleSelectDropdownList:
                return (<APIdropdown field={field} handleChange={handleChange} isMultiSelect={true} value={field?.Value} />)
            case FieldType.Date:
                return (
                    <DateValidator
                        name={field.FieldName}
                        simpleValidator={validator}
                        placeHolder={field.Placeholder}
                        handleChange={handleChange}
                        customValidator={customValidator(field)}
                        customMessage={""}
                        value={field.Value}
                    />
                )
            case FieldType.RichText:
                return (<TextEditor value={field.value} />)
            case FieldType.Boolean:
                return (
                    <CheckBoxInput className="borderThemeColor"
                        name={field.FieldName}
                        checked={field?.Value}
                        onChange={handleChange}
                    />
                )

            default:
                return null;
        }
    };


    return (
        renderInput(field)
    );
}

export default BaseFormField