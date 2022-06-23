import moment from "moment";
import { FieldType } from "../util/enum"

export const getFormValue = (obj: any) => {
    if (obj.FieldTypeName === FieldType.SingleSelectDropdownList || obj.FieldTypeName === FieldType.MultipleSelectDropdownList || obj.FieldTypeName === FieldType.AutoSuggestMultipleContacts) {
        return obj?.LookupValue ?? "";
    }
    else if (obj.FieldTypeName === FieldType.Boolean) {
        return obj?.LookupValue === "true" ? "Checked" : "UnChecked";
    }
    else if(obj.FieldTypeName === FieldType.Date)
    {
       return  obj?.LookupValue ? moment(obj?.LookupValue).format('MM/DD/YYYY') : "";
    }
    else {
        return obj?.Value ?? "";
    }
}
