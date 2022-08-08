import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Colors from "../../../util/Colors";
import { Grid, GridColumn, Header } from "semantic-ui-react";
import "react-datepicker/dist/react-datepicker.css";
import { Dispatch } from "redux";
import { useDispatch } from "react-redux";

import { IconEnum as Icons } from "../../../components/elements/Icons";
import Icon from "../../../components/elements/Icon";
import EllipseDot from "../../../assets/svg/ellipse-dot.svg";
import Plusicon from "../../../assets/svg/plus.svg";
import DropdownValidator from "../../../components/form/DropdownValidator";
import { API_URLS } from "../../../config/api.config";
import API from "../../../services/api.services";
import useValidator from "../../../hooks/useValidator";
import { errorMessages } from "../../../config/messages.config";
import { ErrorToast, SuccessToast } from "../../../util/toaster";
import CustomButton from "../../Loader/CustomButton";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { storeHeaderModal } from "../../../store/actions";
import { ModalProperty, ModuleName } from "../../../util/enum";

const FieldRow = styled.div`
  margin: 25px 0 0;
  &.actionBtn {
    display: flex;
    justify-content: flex-end;
    grid-gap: 15px;
  }
`;
const FormWrapper = styled.div`
    padding: 15px;
    margin: 10px 0;
    height: 100%;
    overflow-y: auto;
    input{
        width: 100%;
        padding: 14px 15px;
        border-radius: 10px;
        border: 1px solid ${Colors.bordercolor};
        &:focus-visible{
            outline:none;
        }
        
    }
    
    textarea{
        padding: 8px;
        width: 100%;  
        border-radius: 10px;
        border: 1px solid ${Colors.bordercolor};
        resize:none;
        height: 60px;
        font-family: 'euclid_circular_aMdIt';
        font-size: 14px;
        line-height: 149.2%;
        color: ${Colors.grey0};
        &:focus-visible{
            outline:none;
        }
    }
    .divider {
        font-size:14px;
        color: ${Colors.black} !important;
        font-family: 'euclid_circular_abold';
        margin: 0 !important;
    }
    label{
        font-size: 12px;
        font-family: 'euclid_circular_amedium';
        color: ${Colors.grey};
        margin-bottom: 6px;
        display: flex;
    }
    .dropdown{
        padding: 14px 15px !important;
        border-radius: 8px !important;
        &.icon {
            font-size: 18px !important;
            padding: 10px !important;
        } 
        &.multiSelect{
            padding: 4px 15px !important;
            min-height: 45px;
            display: flex;
            align-items: center;
            flex-flow: wrap;            
            a{
                font-size: 12px !important;
                font-family: 'euclid_circular_alight';
                background-color: transparent;
                border-radius: 50px;
                display: flex !important;
                align-items: center;
                color: ${Colors.black};
                grid-gap: 5px;
                min-width: 120px;
                justify-content: space-between;
                img{
                    width: 25px !important;
                    height: 25px !important;
                }
                i{
                    background-color: ${Colors.basecolor};
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%; 
                    opacity: 1 !important; 
                    color: ${Colors.shadegrey}; 
                    font-size: 9px !important;  
                }
            }
            &.chooseMultiOption{
                padding: 2px 30px 2px 3px !important;
                a{
                    background-color: ${Colors.bordercolor};
                    border-radius: 5px;
                    box-shadow: none;
                    padding: 7px 12px;
                    i{
                        background-color: ${Colors.white};
                    }
                }
                
            }
            
        }
    } 
    .ui{
        &.left{
            &.icon{
                &.input {  
                    width: 100%;
                }
            }
        }
        &.input
            width: 100%;
            border-radius: 8px;
            input{
                padding: 13px 15px !important;
                border-radius: 10px !important;
                font-family: 'euclid_circular_asemibold';
            }
        }
        
    }  
    
`;
const SaprateColumn = styled.div`
  padding: 10px 15px;
  margin: 15px 0;
  border: 1px solid ${Colors.bordercolor};
  border-radius: 10px;
  .column {
    &.wide {
      padding-bottom: 0 !important;
      margin-bottom: 15px;
      padding-top: 0 !important;
      &.captionCol {
        padding-top: 1rem !important;
        padding-bottom: 12px !important;
      }
    }
  }
  .captionCol {
    border-bottom: 1px solid ${Colors.bordercolor};
    .header {
      font-size: 16px;
      font-family: "euclid_circular_abold";
      color: ${Colors.darkblue};
      margin-top: 0 !important;
    }
  }
`;
const TableContent = styled.div`
  border-radius: 10px;
  // overflow: hidden;
  display: flex;
  width: 100%;
  margin-top: 10px;
  border: 1px solid ${Colors.bordercolor};
  // overflow-y: auto;
  @media screen and (max-width: 1024px) {
    overflow-x: auto;
    border: 1px solid ${Colors.grey8};
  }
  table {
    width: 100%;
    @media screen and (max-width: 767px) {
      border: 1px solid transparent;
      box-shadow: none;
    }
    thead {
      @media screen and (max-width: 767px) {
        display: none;
      }
    }
    tbody {
      @media screen and (max-width: 767px) {
        tr {
          border-bottom: 45px solid #f8f8f8;
        }
      }
    }
    th {
      text-align: left;
      background-color: ${Colors.blue};
      color: ${Colors.white};
      padding: 15px;
      font-size: 14px;
      font-family: "euclid_circular_abold";
      // position: sticky;
      top: 0;
      z-index: 9;
      &:last-child {
        text-align: center;
        border-radius: 0 10px 0 0;
      }
      svg {
        color: ${Colors.white} !important;
        font-size: 15px !important;
      }
      &:first-child {
        border-radius: 10px 0 0 0;
      }
    }
    td {
      text-align: left;
      font-size: 14px;
      font-family: "euclid_circular_aregular";
      padding: 15px;
      color: ${Colors.black};
      @media screen and (max-width: 767px) {
        display: flex;
        text-align: right;
        font-size: 14px;
        // box-shadow: 0 1px 1px ${Colors.exlightblue};
        padding: 10px 15px;
        justify-content: flex-start;
        align-items: flex-start;
        flex-direction: column;
      }
      .mainCompany {
        width: 12px;
        height: 12px;
        background-color: #1ba5e2;
        display: flex;
        border-radius: 50%;
        margin: 0 auto;
        @media screen and (max-width: 767px) {
          align-items: flex-end;
          margin: inherit;
        }
      }
      &:last-child {
        text-align: center;
        @media screen and (max-width: 767px) {
          border-bottom: 15px solid ${Colors.basecolor};
        }
      }
      &:before {
        @media screen and (max-width: 767px) {
          content: attr(data-label);
          float: left;
          font-size: 13px;
          width: 100%;
          text-align: left;
          margin-bottom: 10px;
        }
      }
      svg {
        font-size: 15px !important;
        margin-right: 5px;
      }
      &.ellipseDot {
        text-align: center;
        width: 40px;
        @media screen and (max-width: 767px) {
          width: 100%;
        }
      }
      a {
        color: ${Colors.black};
        text-decoration: none;
        &:hover {
          color: ${Colors.blue};
        }
      }
      .link {
        cursor: pointer;
        &:hover {
          color: ${Colors.darkblue};
        }
      }
      &.fixWidth {
        width: 64px;
        min-width: 64px;
        @media screen and (max-width: 767px) {
          width: auto;
          i {
            text-align: left;
          }
        }
      }
      .ellipseDropDown {
        i {
          color: ${Colors.shadegrey};
        }
        .menu {
          left: 0;
          right: auto;
          border-radius: 8px;
          min-width: 180px;
          border: none;
          box-shadow: 0 0px 8px rgba(34, 36, 38, 10%);
          overflow: hidden;
          .item {
            font-size: 14px;
            color: ${Colors.black};
            padding: 15px !important;
            border-bottom: 1px solid ${Colors.bordercolor};
            font-family: "euclid_circular_aregular";
            i {
              color: ${Colors.grey};
            }
            &:hover {
              background-color: ${Colors.darkblue};
              color: ${Colors.white};
              i {
                color: ${Colors.white};
              }
            }
          }
        }
      }
      input {
        width: 100%;
        padding: 14px 15px;
        border-radius: 10px;
        font-family: "euclid_circular_abold";
        border: 1px solid ${Colors.bordercolor};
        &:focus-visible {
          outline: none;
        }
      }
      .divider {
        font-size: 14px;
        color: ${Colors.black} !important;
        font-family: "euclid_circular_abold";
        margin: 0 !important;
      }
    }
  }
  &.addCompany {
    border: none;
    td {
      @media screen and (max-width: 767px) {
        padding: 5px 0;
      }
      &.emptyCol {
        min-width: 70px;
        @media screen and (min-width: 1400px) {
          min-width: 45px;
        }
      }
      .radioBtn {
        margin: 16px 0 @media screen and (max-width: 767px) {
          margin: 5px 0;
        }
      }
      label {
        font-size: 12px;
        font-family: "euclid_circular_amedium";
        color: ${Colors.grey};
        margin-bottom: 6px;
        display: flex;
      }
      &:before {
        @media screen and (max-width: 767px) {
          display: none;
        }
      }
    }
  }
`;


const CheckBox = styled.label`
  display: block;
  position: relative;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  min-height: 18px;

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
const CreateContactBtn = styled.button`
  background-color: ${Colors.darkblue};
  border: none;
  display: flex;
  color: ${Colors.white};
  padding: 12px 15px;
  border-radius: 10px;
  font-size: 14px;
  font-family: "euclid_circular_abold";
  cursor: pointer;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  @media (max-width: 767px) {
    width: 100%;
    margin-left: 0;
  }
  img {
    width: 15px;
    margin-right: 10px;
  }
`;

const getCopyOfObject = (obj: any) => {
  return JSON.parse(JSON.stringify(obj))
}

const changeListOrder = (arrayObject: any) => {
  arrayObject = arrayObject?.map((element: any, index: any) => {
    element.orderNumber = index + 1;
    return element;
  })
  return arrayObject;
}

// a little function to help us with reordering the result
const reorder = (list: any, startIndex: any, endIndex: any) => {
  let result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  result = changeListOrder(result);
  return result;
};



const DropDownCreation = (props: any) => {
  const [validator, showValidationMessage] = useValidator();
  const [sortByOptions, setSortByOptions] = useState([] as any);
  const [lookupTypes, setLookupTypes] = useState([] as any);
  const [loading, setLoading] = useState(false);
  const [translationObj, setTranslationObj] = useState([]);
  const [dropdownData, setDropdownData] = useState<any>({ lookupTypeId: props.id ?? "", sortById: "", lookupDetail: [] });
  const [languages, setLanguages] = useState([]);
  const [newLookupDetail, setNewLookupDetail] = useState<any>();
  const dispatch: Dispatch<any> = useDispatch()


  function handleSubmit(e: any) {
    if (validator.allValid()) {
      adminAddDropdown();
    } else {
      showValidationMessage(true);
    }
  }

  const addFormFields = () => {
    let isFieldsEmpty = false;
    // check if values are blank
    if (newLookupDetail?.translation) {
      newLookupDetail?.translation?.map((x: any) => {
        if (!x.value) {
          isFieldsEmpty = true;
          return 
        }
      });
      if (isFieldsEmpty) {
        ErrorToast("Please fill above field then add new options");
        return;
      }
    }
    setNewLookupDetail({ id: 0,  selected: "", isDefault: false, name: "", orderNumber: -1, translation: [...getCopyOfObject(translationObj)] });
    newLookupDetail.orderNumber = dropdownData?.lookupDetail.length + 1;
    let updateLookUpDetail = [...dropdownData.lookupDetail, { ...newLookupDetail }];
    setDropdownData((prevState: any) => ({ ...prevState, lookupDetail: updateLookUpDetail }));
  };

  const removeFormFields = (index: any) => {
    if (dropdownData.lookupDetail.length > 0) {
      let newFormValues = [...dropdownData.lookupDetail];
      newFormValues.splice(index, 1);
      newFormValues = changeListOrder(newFormValues);
      setDropdownData((prevState: any) => ({ ...prevState, lookupDetail: [...newFormValues] }));
    }
  };

  const onChange = (name: any, value: any) => {
    setDropdownData({ ...dropdownData, [name]: value });
  };

  const getSortbyList = () => {
    API.get(API_URLS.DefaultLookupSorting).then((response: any) => {
      let dropdownData = response?.data.map((x: any) => {
        return { key: x.id, value: x.id, text: x.name };
      });
      dropdownData.push({ key: null, value: null, text: "None" })
      setSortByOptions(dropdownData as any);
    });
  };

  const getLanguages = () => {
    API.get(API_URLS.GetLanguages).then((response: any) => {
      
      setLanguages(response.data);
      let array: any = [];
      response.data?.map((x: any) => {
        array.push({ "languageId": x.id, "languageName": x.languageName, "value": "" });
      });
      setNewLookupDetail((prevState: any) => ({ ...prevState, id: 0,  selected: "", isDefault: false, name: "", orderNumber: -1, translation: [...getCopyOfObject(array)] }));
      setTranslationObj(array);
    });
  };

  const getLookupTypes = () => {
    API.get(API_URLS.GetLookupTypes).then((response: any) => {
      let dropdownData = response?.data.map((x: any) => {
        return { key: x.id, value: x.id, text: x.name };
      });
      setLookupTypes(dropdownData as any);
    });
  };

  const getLookupDetails = () => {
    if(dropdownData.lookupTypeId !== -1){
    API.post(API_URLS.GetLookupDetails, { id: dropdownData.lookupTypeId }).then((response) => {
      
      setDropdownData(response?.data);
      
    });
  }
  };

  const adminAddDropdown = () => {
    setLoading(true);
    API.post(API_URLS.CreateUpdateLookupDetails, { ...dropdownData }).then(async (response: any) => {
      SuccessToast(response?.message);
      dispatch(storeHeaderModal({ moduleName: ModuleName.AdminDropDowns, isMoodelOpen: ModalProperty.Close }));
      props.close();
    }).finally(() => {
      setLoading(false);
    });
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }
    const reorderedItems = reorder(
      dropdownData?.lookupDetail,
      result.source.index,
      result.destination.index
    );

    console.log({ reorderedItems });
    // setItems(reorderedItems);
    setDropdownData((prevState: any) => ({ ...prevState, lookupDetail: [...reorderedItems] }));
  }

  useEffect(() => {
    getSortbyList();
    getLookupTypes();
    getLanguages();
  }, []);

  useEffect(() => {
    if (dropdownData.lookupTypeId) {
      getLookupDetails();
    }
  }, [dropdownData.lookupTypeId]) // eslint-disable-line react-hooks/exhaustive-deps

  let lookupDetailArray = dropdownData?.lookupDetail ;
  
  return (
    <>
      <FormWrapper>
        <Grid columns={2}>
          <GridColumn width={8} className="fullWidth">
            <label>Name</label>
            <DropdownValidator
              dropdown={lookupTypes}
              name={"lookupTypeId"}
              value={dropdownData.lookupTypeId}
              simpleValidator={validator}
              handleChange={onChange}
              customValidator="required"
              customMessage={{ required: errorMessages.DropDownName }}
            />
          </GridColumn>
          <GridColumn width={8} className="fullWidth">
            <label>Sort by</label>
            <DropdownValidator
              dropdown={sortByOptions}
              name={"sortById"}
              value={dropdownData.sortById}
              simpleValidator={validator}
              handleChange={onChange}
              customValidator=""
              customMessage={{}}
            />
          </GridColumn>
        </Grid>
        <SaprateColumn>
          <Grid columns={2}>
            <GridColumn width={16} className="captionCol">
              <Header size="small">Dropdown table</Header>
            </GridColumn>
          </Grid>
          <TableContent>
            <DragDropContext onDragEnd={handleDragEnd}>
              <table cellSpacing="0" cellPadding="0">
                <thead>
                  <tr>
                    <th className="ellipseDot smHide"></th>
                    {languages?.map((x: any) => {
                      return <th>{`Drop down value ${x.languageName.toLowerCase()}`}  </th>
                    })}
                    <th>Default</th>
                    <th></th>
                    {/* <th className="fixWidth">
                    <FLexBox>
                      <WhiteCheckBox>
                        <input type="checkbox" checked></input>
                        <span className="checkmark"></span>
                      </WhiteCheckBox>
                      <Icon icon={Icons.DownArrow} />
                    </FLexBox>
                  </th> */}
                    <th className="fixWidth">
                      <Icon icon={Icons.Delete} />
                    </th>
                  </tr>
                </thead>
                {/* table body  */}
                <Droppable droppableId="tbodyDropdownCreation">
                  {(provided) => (
                    <tbody {...provided.droppableProps} ref={provided.innerRef}>
                      {lookupDetailArray?.map((element: any, index: any) => {
                        return (
                          <Draggable index={index} key={index} draggableId={element.orderNumber.toString()}>
                            {(provided) => (
                              <tr ref={provided.innerRef} {...provided.draggableProps}>
                                <td className="ellipseDot" {...provided.dragHandleProps}>
                                  <img src={EllipseDot} alt=""></img>
                                </td>
                                {languages?.map((x: any) => {
                                  
                                  let language = x?.languageName;
                                  let label = language?.toLowerCase();
                                  let langValue = element.translation.find((trans: any) => trans.languageId === x.id);
                                  return <td data-label={`Drop down value ${label}`}>
                                    <input
                                      type={"text"}
                                      data-languageId={x.id}
                                      data-language={language}
                                      value={langValue?.value}
                                      onChange={(e) => {
                                        let languageId = e.target.getAttribute("data-languageId") ?? "0";
                                        let language = e.target.getAttribute("data-language");
                                        if (language?.toLocaleLowerCase() === "english") {
                                          lookupDetailArray[index].name = e.target.value;
                                        }
                                        let data = lookupDetailArray[index].translation?.find((x: any) => x.languageId.toString() === languageId);
                                        if (data) {
                                          data.value = e.target.value
                                        }
                                        else {
                                          lookupDetailArray[index].translation.push({ languageId: parseInt(languageId), value: e.target.value });
                                        }
                                        setDropdownData((prevState: any) => ({ ...prevState, lookupDetail: [...lookupDetailArray] }));
                                      }}
                                    />
                                  </td>
                                })}
                                <td data-label="Is Default">
                                  <CheckBox>
                                    <input
                                      type="checkbox"
                                      checked={element.isDefault}
                                      onChange={(e) => {
                                        lookupDetailArray?.map((element: any, rowIndex: any) => {
                                          if (rowIndex === index) {
                                            lookupDetailArray[rowIndex].isDefault = e.target.checked;
                                          }
                                          else {
                                            lookupDetailArray[rowIndex].isDefault = false
                                          }
                                        });
                                        setDropdownData((prevState: any) => ({ ...prevState, lookupDetail: [...lookupDetailArray] }));
                                      }}
                                    ></input>
                                    <span className="checkmark"></span>
                                  </CheckBox>
                                </td>
                                <td data-label="is Investor" className="fixWidth">
                                  {/* <CheckBox>
                                    <input
                                      type="checkbox"
                                      checked={element.isInvestor}
                                      onChange={(e) => {
                                        lookupDetailArray[index].isInvestor = e.target.checked;
                                        setDropdownData((prevState: any) => ({ ...prevState, lookupDetail: [...lookupDetailArray] }));
                                      }}
                                    ></input>
                                    <span className="checkmark"></span>
                                  </CheckBox> */}
                                </td>
                                <td className="fixWidth">
                                  <Icon
                                    icon={Icons.Delete}
                                    inactiveColor={Colors.blue}
                                    onClick={() => removeFormFields(index as any)}
                                  />
                                </td>
                              </tr>
                            )}
                          </Draggable>
                        );
                      })}
                    </tbody>
                  )}
                </Droppable>

                {newLookupDetail?.translation?.length > 0 && dropdownData.lookupTypeId > 0 && (<tr >
                  <td className="ellipseDot">
                    <CreateContactBtn onClick={addFormFields}>
                      <img src={Plusicon} alt=""></img>Add
                    </CreateContactBtn>
                  </td>
                  {languages?.map((x: any) => {
                    let language = x?.languageName;
                    let label = language?.toLowerCase();
                    let langValue = newLookupDetail.translation.find((trans: any) => trans.languageId === x.id);
                    return <td data-label={`Drop down value ${label}`}>
                      <input
                        type={"text"}
                        data-languageId={x.id}
                        data-language={language}
                        value={langValue?.value}
                        onChange={(e) => {
                          let languageId = e.target.getAttribute("data-languageId") ?? "0";
                          let language = e.target.getAttribute("data-language");
                          if (language?.toLocaleLowerCase() === "english") {
                            newLookupDetail.name = e.target.value;
                          }
                          let data = newLookupDetail.translation?.find((x: any) => x.languageId.toString() === languageId);
                          data.value = e.target.value;
                          setNewLookupDetail({ ...newLookupDetail });
                        }}
                      />
                    </td>
                  })}
                  <td className="fixWidth"></td>
                  <td className="fixWidth"></td>
                  <td className="fixWidth"></td>
                </tr>)}
              </table>
            </DragDropContext>
          </TableContent>
        </SaprateColumn>

        <FieldRow className="actionBtn">
          <CustomButton buttonText="Create" onClick={handleSubmit} loading={loading}></CustomButton>
        </FieldRow>
      </FormWrapper>
    </>
  );
};

export default DropDownCreation;
