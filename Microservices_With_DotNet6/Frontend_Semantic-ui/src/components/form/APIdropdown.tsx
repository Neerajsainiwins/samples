import { Fragment, useEffect, useState } from "react";
import { Dropdown } from "semantic-ui-react";
import { API_URLS } from "../../config/api.config";
import API from "../../services/api.services";
import { FieldType } from "../../util/enum";
import DropdownValidator from "./DropdownValidator";
interface IDropdownValidatorProps {
    field: any;
    name?: any;
    value?: any;
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

}

const APIdropdown = ({ field, value, simpleValidator, handleChange, customValidator, isSearchable = true,
    readonly = false, customMessage, inputIcons, isMultiSelect = false }: IDropdownValidatorProps) => {
    const [dropdown, setDropdown] = useState<any>([]);
    useEffect(() => {
        if (field.FieldTypeName === FieldType.AutoSuggestMultipleContacts || field.FieldTypeName === FieldType.SingleSelectDropdownList || field.FieldTypeName === FieldType.MultipleSelectDropdownList) {
            API.post(API_URLS.GetFieldLookupsData, { "fieldId": field.FieldId, "languageId": 1 }).then((response) => {
                let dropdownData = JSON.parse(response.data.entityData)?.map((x: any) => {
                    if (x.Flag) {
                        return { key: x.Flag, value: x.lookupId, text: x.lookupFieldValue, flag: (x.Flag).toLowerCase() };
                    }
                    else {
                        return { key: x.lookupId, value: x.lookupId, text: x.lookupFieldValue };
                    }
                });
                setDropdown(dropdownData as any);
            });
        }

    }, [field.FieldTypeName]);

    if (!isMultiSelect) value = parseInt(value);
    if (isMultiSelect) {
        if (value && typeof value === "string") {
            value = value?.split(",").map((e: any) => parseInt(e));
        }
    }


    return (
        <Fragment>
            <DropdownValidator
                dropdown={dropdown}
                name={"countryId"}
                value={value}
                simpleValidator={simpleValidator}
                handleChange={handleChange}
                customValidator={customMessage}
                isMultiSelect={isMultiSelect}
                customMessage={customValidator}
                isSearchable={isSearchable}
                readonly={readonly}
                inputIcons={inputIcons}
            />
        </Fragment>
    );
};

export default APIdropdown;