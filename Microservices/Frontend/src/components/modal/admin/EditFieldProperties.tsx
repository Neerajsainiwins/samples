import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Colors from "../../../util/Colors";
import { Accordion, Grid, GridColumn } from "semantic-ui-react";
import "react-datepicker/dist/react-datepicker.css";
import InputValidator from "../../form/InputValidator";
import DropdownValidator from "../../form/DropdownValidator";
import { errorMessages } from "../../../config/messages.config";
import useValidator from "../../../hooks/useValidator";
import Astric from "../../../util/Astric";
import { API_URLS } from "../../../config/api.config";
import API from "../../../services/api.services";
import { SuccessToast } from "../../../util/toaster";
import { CommonFillBtn, FormWrapper } from "../BaseModal";
import CustomButton from "../../Loader/CustomButton";
import { storeHeaderModal } from "../../../store/actions";
import { Dispatch } from "redux";
import { useDispatch } from "react-redux";
import { ModalProperty, ModuleName } from "../../../util/enum";

// const status = [
//     { key: 'High level', value: 'High level', text: 'High level' },
//     { key: 'High level 1', value: 'High level 1', text: 'High level 1' },
// ]
// const MultiSelcet = [
//     { key: 'Multi select', value: 'Multi select', text: 'Multi select' },
//     { key: 'Balance Multi select 1', value: 'Balance Multi select 1', text: 'Balance Multi select 1' },
// ]
const CreateViewWrapper = styled.div`
    padding: 20px;
    margin: 10px 0;
    height: 100%;
    overflow-y: auto;
`;
const ModalContent = styled.div`
 `;
const FieldRow = styled.div` 
    margin-bottom: 25px;   
    p{
        font-size: 12px;
        color: ${Colors.grey};
        font-family: 'euclid_circular_amedium';
        margin: 8px 0;
    }
    input{
        width: 100%;
        padding: 12px 15px;
        border-radius: 10px;
        border: 1px solid ${Colors.bordercolor};
        font-family: 'euclid_circular_asemibold';
        &:focus-visible{
            outline:none;            
        }
        &.normalFont{
            font-family: 'euclid_circular_aregular';
            color: ${Colors.grey};
            font-size: 12px;
        }
    }  
    
    &.actionBtn{
        display: flex;
        justify-content: flex-end;
        grid-gap: 15px;
        margin-bottom: 0px;
    }
    .divider {
        font-size: 14px;
        color: ${Colors.black} !important;
        font-family: 'euclid_circular_abold';
        margin: 0 !important;
    }
    .dropdown{
        padding: 14px 15px !important;
        border-radius: 8px !important;
        &.icon {
            font-size: 18px !important;
            padding: 10px !important;
        } 
    }
    .tbRremoveSpace {
        padding: 0 1rem !important;
    }
    label {
        margin-bottom: 6px;
        display: flex;
    }
`;

const CheckBox = styled.label`
    display: block;
    position: relative;
    cursor: pointer;
    font-size: 12px;
    color: ${Colors.grey};
    font-family: 'euclid_circular_amedium';
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    min-height: 18px;    
    padding-left: 24px;
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
        border: 2px solid ${Colors.blue};
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


const EditFieldProperties = (props: any) => {
    
    const [addNewField, setaddNewField] = useState<any>({
        id: props.id !== undefined?props.id:0,
        formId: localStorage.getItem("pageId"),
        name: "",
        fieldTypeId:-1,
        formSectionId: props.formSectionId!==undefined?props.formSectionId:0,
        suffix: "",
        placeholder: "",
        mandatory: true,
        orderNumber:-1,
        settings:null
        
    });

 const [ section, setsection]=useState<any>({ sectionName:"", id: 0, formId: localStorage.getItem("pageId"),orderNumber: 0})
 const dispatch: Dispatch<any> = useDispatch()
    const [loading, setLoading] = useState(false);
    const [fieldTypes, setFieldTypes] = useState([]);
    const [sections, setGetSections] = useState([]);
    const [activeIndex, setActiveIndex] = useState(-1);
    // const [, setEmailValid] = useState(true);
    const [validator, showValidationMessage] = useValidator();
    const [validator2, showValidationMessage2] = useValidator();
    // const checkEmailValid = (isValid: boolean) => {
    //     setEmailValid(isValid);
    //   };

    const getSections = () => {
        API.get(API_URLS.GetPageSections,{params:{formId:localStorage.getItem("pageId")}}).then((response: any) => { 
            let dropdownData = response?.data.map((x: any) => {
                return { key: x.id, value: x.id, text: x.name };
            });
            setGetSections(dropdownData as any);
        });
    };


    const getFieldTypes = () => {
        API.get(API_URLS.GetAllFieldTypes).then((response: any) => {
            let dropdownData = response?.data.map((x: any) => {
                return { key: x.fieldTypeId, value: x.fieldTypeId, text: x.fieldTypeName };
            });
            setFieldTypes(dropdownData as any);
        });
    };

    const onChange = (name: any, value: any) => {
        setaddNewField({ ...addNewField, [name]: value });
    };
    
    const onChangesectionname = (name: any, value: any) => {
        setsection({ ...section, [name]: value });
    };
    const handleChangeCheckBox = (e: any) => {
        setaddNewField({ ...addNewField, mandatory: e.target.checked });
    };
    function handleSubmit(e: any) {
        if (validator.allValid()) {
            postData();
        } else {
            showValidationMessage(true);
        }
    }

    const postData = () => {
        setLoading(true);
        API.post(API_URLS.CreateFields, { ...addNewField }).then(
          async (response: any) => {
            SuccessToast(response?.message)
            
            await dispatch(storeHeaderModal({ moduleName: ModuleName.AdminFields, isMoodelOpen: ModalProperty.Close }));
            props.close();
          }
        ).finally(() => {
          setLoading(false);
        });
      };
  

      const GetFieldsOfField =()=>{
        API.post(API_URLS.GetFieldById,{fieldId:props.id !== undefined?props.id:0,formId:0,formSectionId:props.formSectionId!==undefined?props.formSectionId:0}).then((response: any) => {
            setaddNewField({ ...addNewField, formSectionId: response.data.formSectionId,name:response.data.name ,suffix:response.data.suffix, placeholder:response.data.placeholder,fieldTypeId:response.data.fieldTypeId ,settings:response.data.settings=== ""? null:response.data.settings,orderNumber:response.data.orderNumber});
        });

      }


    useEffect(() => {
        GetFieldsOfField();
        getFieldTypes();
        getSections();
    }, []);
  
    const handleCreateSection=()=>{
        
        if (validator2.allValid()) {
             CreateSection();
          } else {
            showValidationMessage2(true);
          }   
    }

    const CreateSection=()=>{
        setLoading(true);
        API.post(API_URLS.CreateSection, { ...section }).then(
          async (response: any) => {
            SuccessToast(response?.message)
            setsection({sectionname:""})
            setActiveIndex(-1);
            getSections();
          }
        ).finally(() => {
          setLoading(false);
        });
    }
    return (
        <>

            <CreateViewWrapper>
                <ModalContent>
                    <FieldRow className="formWrapper">
                        <Grid>
                            <GridColumn width={8}>
                                <label>Field name <Astric /></label>
                                <InputValidator
                                    type={"text"}
                                    name={"name"}
                                    value={addNewField.name}
                                    simpleValidator={validator}
                                    handleChange={onChange}
                                    customValidator="required"
                                    customMessage={{ required: errorMessages.FieldName }}
                                />
                            </GridColumn>
                            <GridColumn width={8}>
                                <label>Section <Astric /></label>
                                <DropdownValidator
                                    dropdown={sections}
                                    name={"formSectionId"}
                                    value={addNewField.formSectionId}
                                    simpleValidator={validator}
                                    handleChange={onChange}
                                    customValidator="required"
                                    customMessage={{ required: errorMessages.Section }}
                                />
                            </GridColumn>
                            <GridColumn width={16} className="tbRremoveSpace">
                                <p>
                                    <CheckBox>
                                        <input type="checkbox" onChange={handleChangeCheckBox} checked={addNewField.mandatory}></input> Mandatory
                                        <span className="checkmark"></span>
                                    </CheckBox>
                                </p>
                            </GridColumn>
                            <GridColumn width={8}>
                                <label>Type <Astric /></label>
                                <DropdownValidator
                                     readonly={props.id !== undefined ?true:false}
                                    dropdown={fieldTypes}
                                    name={"fieldTypeId"}
                                    value={addNewField.fieldTypeId}
                                    simpleValidator={validator}
                                    handleChange={onChange}
                                    customValidator="required"
                                    customMessage={{ required: errorMessages.Type }}
                                />
                            </GridColumn>
                            <GridColumn width={8}>
                                <label>Suffix</label>
                                <InputValidator
                                    type={"text"}
                                    name={"suffix"}
                                    value={addNewField.suffix}
                                    simpleValidator={validator}
                                    handleChange={onChange}
                                    customValidator=""
                                    customMessage={{ required: "" }}
                                />

                            </GridColumn>
                            <GridColumn width={16}>
                                <label>Placeholder</label>
                                <InputValidator
                                    type={"text"}
                                    name={"placeholder"}
                                    value={addNewField.placeholder}
                                    simpleValidator={validator}
                                    handleChange={onChange}
                                    customValidator=""
                                    customMessage={{ required: "" }}
                                />

                            </GridColumn>
                            <GridColumn width={16} className="fullWidth">
                            <Accordion className="accordionWrap">
              <Accordion.Title
                active={activeIndex === 0}
                index={0}
                onClick={() => { setActiveIndex(activeIndex === 0 ? -1 : 0) }}
              >
                + Create Section
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 0}>
                <FormWrapper>
                  <Grid columns={16}>
                    <GridColumn width={16} className="fullWidth">
                      <label>
                      Section name
                        <Astric />
                      </label>
                      <InputValidator
                        type={"text"}
                        name={"sectionname"}
                        value={section.sectionname}
                        simpleValidator={validator2}
                        handleChange={onChangesectionname}
                        customValidator="required"
                        customMessage={{ required: errorMessages.Createsection }}
                      />
                    </GridColumn>
               
                 
                  </Grid>
                  <GridColumn width={8} className="fullWidth">
                    <CommonFillBtn onClick={handleCreateSection}>Create Section</CommonFillBtn>
                  </GridColumn>
                </FormWrapper>
              </Accordion.Content>
            </Accordion>
            </GridColumn>
                        </Grid>
                    </FieldRow>

                    <FieldRow className="actionBtn">
                        <CustomButton  onClick={(e) => {
                handleSubmit(e);
              }} loading={loading} buttonText={props.id !== undefined ?"Save":"Create"  }></CustomButton>

                    </FieldRow>
                </ModalContent>
            </CreateViewWrapper>



        </>
    );
};

export default EditFieldProperties;