
interface InputValidatorProps {
    type: string;
    name?: any;
    value?: any;
    placeHolder?: any;
    simpleValidator?: any;
    handleChange: (name: any, value: any) => void,
    customValidator?: any,
    customMessage?: any,
    inputIcons?: any,
    numberOnly?:any,
    readonly?:any
}

const InputValidator = ({ type, name, value, placeHolder, simpleValidator, handleChange, customValidator, customMessage, inputIcons,numberOnly = false,readonly=false }: InputValidatorProps) => {
    function onChange(e: any) {
        let name = e.target.name;
        let value = e.target.value;
        const numerReg = /^[0-9\b]+$/;
        // eslint-disable-next-line no-mixed-operators
        if((numberOnly && numerReg.test(value) || value === "" || value === null ) || !numberOnly ){
            handleChange(name, value);
        }
    }

    return (
        <>
            <input type={type} placeholder={placeHolder} name={name} readOnly={readonly}  onChange={(e) => onChange(e)} value={value} />
            {inputIcons && <img src={inputIcons} alt=''></img>}
           { simpleValidator && <p className="invalid-feedback" style={{ color: "red", textAlign: "left" }}>{simpleValidator.message(name, value, customValidator, { messages: customMessage })}</p>}
        </>
    );
};

export default InputValidator;