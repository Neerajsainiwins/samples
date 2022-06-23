import styled from "styled-components";
import DatePicker from "react-datepicker";
import { Icons } from "../elements/Icon";
import { DateTimeFormat } from "../../util/TimeFormat";
import moment from "moment";


const CalendarWrap = styled.div`
    position: relative;
    @media screen and (max-width: 767px) {
        width:100%;
    }
    .react-datepicker-wrapper{
        input{
            padding: 13px 15px 13px 35px !important
        }
    }
    
`;
const CalendarImg = styled.img`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    left: 14px;
`;
interface DateValidatorProps {
    name?: any;
    value?: any;
    placeHolder?: any;
    simpleValidator?: any;
    handleChange: (name: any, value: any) => void,
    customValidator?: any,
    customMessage?: any,
    inputIcons?: any,
    numberOnly?: any,
    readonly?: any
}

const DateValidator = ({ name, value, placeHolder, simpleValidator, handleChange, customValidator, customMessage, inputIcons, numberOnly = false, readonly = false }: DateValidatorProps) => {
    function onChange(e: any) {
        let nameValue = name;
        let value = moment(e).format('MM/DD/YYYY');   
        handleChange(nameValue, value);

    }

    return (
        <>
            <CalendarWrap>
                <DatePicker onChange={(date) => onChange(date as any)} selected={new Date(value)} placeholderText="Date" />
                <CalendarImg src={Icons.CalendarImage}></CalendarImg>
            </CalendarWrap>
            {simpleValidator && <p className="invalid-feedback" style={{ color: "red", textAlign: "left" }}>{simpleValidator.message(name, value, customValidator, { messages: customMessage })}</p>}
        </>
    );
};

export default DateValidator;