import styled from "styled-components";
import { useEffect, useState } from "react";
import { Dimmer, Grid, GridColumn, Loader } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";

import Icon from "../../components/elements/Icon";
import { IconEnum as Icons } from "../../components/elements/Icons";
import colors from "../../util/Colors";
import BaseModal, { ModalList } from "../../components/modal/BaseModal";
import { CheckBox, FLexBox, LeftCol, WhiteCheckBox } from "./WithAdminLayout";
import API from "../../services/api.services";
import { API_URLS } from "../../config/api.config";
import DropdownValidator from "../../components/form/DropdownValidator";
import useValidator from "../../hooks/useValidator";
import { SuccessToast } from "../../util/toaster";
import Colors from "../../util/Colors";
import { RootState } from "../../store/reducers";
import { ModalProperty, ModuleName } from "../../util/enum";
import { storeHeaderModal } from "../../store/actions";
import AdminLayout from "./AdminLayout";

const GridWrapper = styled.div`
  background-color: ${colors.white};
  margin-top: 20px;
  padding: 20px 0;
  border-radius: 10px;
  @media screen and (max-width: 767px) {
    margin-top: 0;
    border-radius: 0px;
  }
  input {
    width: 100%;
    padding: 14px 15px;
    border-radius: 10px;
    border: 1px solid ${colors.bordercolor};
    &:focus-visible {
      outline: none;
    }
  }
  .divider {
    font-size: 14px;
    color: ${colors.black} !important;
    font-family: "euclid_circular_abold";
    margin: 0 !important;
  }
  label {
    font-size: 12px;
    font-family: "euclid_circular_amedium";
    color: ${colors.grey};
    margin-bottom: 6px;
    display: flex;
  }
  .topSpace {
    margin-top: 13px;
  }
  .fullWidth {
    @media screen and (min-width: 1280px) {
      padding-right: 120px !important;
    }
  }
  .dropdown {
    padding: 14px 15px !important;
    border-radius: 8px !important;
    &.icon {
      font-size: 18px !important;
      padding: 10px !important;
    }
    &.multiSelect {
      padding: 4px 15px !important;
      min-height: 45px;
      display: flex;
      align-items: center;
      flex-flow: wrap;
      a {
        font-size: 12px !important;
        font-family: "euclid_circular_alight";
        background-color: transparent;
        border-radius: 50px;
        display: flex !important;
        align-items: center;
        color: ${colors.black};
        grid-gap: 5px;
        min-width: 120px;
        justify-content: space-between;
        img {
          width: 25px !important;
          height: 25px !important;
        }
        i {
          background-color: ${colors.basecolor};
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          opacity: 1 !important;
          color: ${colors.shadegrey};
          font-size: 9px !important;
        }
      }
      &.chooseMultiOption {
        padding: 2px 30px 2px 3px !important;
        a {
          background-color: ${colors.bordercolor};
          border-radius: 5px;
          box-shadow: none;
          padding: 7px 12px;
          i {
            background-color: ${colors.white};
          }
        }
      }
    }
  }
  .ui {
    &.left {
      &.icon {
        &.input {
          width: 100%;
        }
      }
    }
    &.input {
      width: 100%;
      border-radius: 8px;
      input {
        padding: 13px 15px !important;
        border-radius: 10px !important;
        font-family: "euclid_circular_asemibold";
      }
    }
  }
`;

const TableContent = styled.div`
  border-radius: 10px;
  display: flex;
  width: 100%;
  // margin-top: 10px;
  border: 1px solid ${colors.bordercolor};
  @media screen and (max-width: 1024px) {
    overflow-x: auto;
    border: 1px solid ${colors.grey8};
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
      background-color: ${colors.blue};
      color: ${colors.white};
      padding: 15px;
      font-size: 14px;
      font-family: "euclid_circular_abold";
      position: sticky;
      top: 0;
      z-index: 9;
      white-space: nowrap;
      &:last-child {
        text-align: center;
      }
      svg {
        color: ${colors.white} !important;
        font-size: 15px !important;
      }
      
      &:last-child {
        &:after {
          position: absolute;
          content: "";
          right: -1px;
          width: 1px;
          height: 10px;
          background-color: #fff;
          z-index: 99;
          top: 0;
        }
      }
    }
    td {
      text-align: left;
      font-size: 14px;
      font-family: "euclid_circular_aregular";
      padding: 15px;
      color: ${colors.black};
      @media screen and (max-width: 767px) {
        display: flex;
        text-align: right;
        font-size: 14px;
        box-shadow: 0 1px 1px ${colors.exlightblue};
        padding: 15px;
        justify-content: space-between;
        align-items: center;
        font-family: "euclid_circular_abold";
      }
      &:last-child {
        text-align: center;
        @media screen and (max-width: 767px) {
          border-bottom: 15px solid ${colors.basecolor};
        }
      }
      &:before {
        @media screen and (max-width: 767px) {
          content: attr(data-label);
          float: left;
          font-family: "euclid_circular_aregular";
          font-size: 13px;
          text-align: left;
        }
      }
      svg {
        color: ${colors.black} !important;
        font-size: 15px !important;
        margin-right: 5px;
      }
      .companyName {
        color: ${colors.blue1};
        background-color: ${colors.skyblue};
        padding: 4px 10px;
        border-radius: 50px;
        font-size: 14px;
        font-family: "euclid_circular_bsemibold";
      }
      a {
        color: ${colors.black};
        text-decoration: none;
        &:hover {
          color: ${colors.blue};
        }
      }
      .link {
        cursor: pointer;
        &:hover {
          color: ${colors.darkblue};
        }
      }
      &.fixWidth {
        width: 64px;
        min-width: 64px;
        @media screen and (max-width: 767px) {
          width: auto;
          i {
            text-align: right;
          }
        }
      }
      .ellipseDropDown {
        i {
          color: ${colors.shadegrey};
        }
        .menu {
          left: auto;
          right: 0;
          border-radius: 8px;
          min-width: 180px;
          border: none;
          box-shadow: 0 0px 8px rgba(34, 36, 38, 10%);
          overflow: hidden;
          .item {
            font-size: 14px;
            color: ${colors.black};
            padding: 15px !important;
            border-bottom: 1px solid ${colors.bordercolor};
            font-family: "euclid_circular_aregular";
            i {
              color: ${colors.grey};
            }
            &:hover {
              background-color: ${colors.darkblue};
              color: ${colors.white};
              i {
                color: ${colors.white};
              }
            }
          }
        }
      }
    }
  }
`;

const BorderWrapper = styled.div`
  margin: 15px 0;
  border: 1px solid ${colors.bordercolor};
  padding: 25px 15px 15px;
  border-radius: 10px;
  @media screen and (max-width: 767px) {
    padding: 15px 0 15px;
  }

  .grid {
    max-width: 70vw;
    @media screen and (max-width: 767px) {
      max-width: 100%;
      margin: 0;
    }
    &.highLabelWrap {
      max-width: 100%;
    }
  }

  h2 {
    font-size: 25px;
    color: ${colors.darkblue};
    font-family: "euclid_circular_abold";
    text-align: left;
    @media screen and (max-width: 767px) {
      font-size: 16px;
    }
  }
  label {
    font-size: 14px;
    font-family: "euclid_circular_aregular";
    color: ${colors.grey};
    margin-bottom: 6px;
    display: flex;
  }
  h4 {
    font-size: 18px;
    color: ${colors.black};
    font-family: "euclid_circular_aregular";
    margin: 0;
    text-align: left;
    @media screen and (max-width: 767px) {
      font-size: 14px;
    }
    .companyName {
      color: ${colors.blue1};
      background-color: ${colors.exlightblue};
      padding: 4px 10px;
      border-radius: 50px;
    }
    img {
      margin-right: 8px;
    }
  }
  h5 {
    font-size: 18px;
    color: ${colors.black};
    font-family: "euclid_circular_aMdIt";
    margin: 0;
    max-width: 70%;
    text-align: left;
    letter-spacing: 0.7px;
    @media screen and (max-width: 767px) {
      font-size: 14px;
    }
  }
`;

const SeacrhWrapper = styled.div`
  background-color: ${colors.white};
  align-items: center;
  justify-content: space-between;
  display: flex;
  grid-gap: 15px;
  width: 100%;
  align-items: flex-end;
  margin-bottom: 20px;
  position: relative;
  z-index: 9999;
  @media screen and (max-width: 767px) {
    flex-direction: column;
  }
  .fullWidth {
    width: 100%;

    padding-right: 0 !important;
    @media screen and (min-width: 992px) {
      max-width: 190px;
    }
  }
`;

const EditBtn = styled.button`
  background-color: ${Colors.darkblue};
  color: ${Colors.white};
  border: none;
  font-size: 12px;
  padding: 15px 20px;
  border-radius: 10px;
  cursor: pointer;
  min-width: 90px;
  // position: fixed;
  // left: 92%;
  // top: 365px;
  @media screen and (max-width: 767px) {
    min-width: inherit;
    font-size: 0;
    padding: 12px;
  }
  svg {
    color: ${Colors.white} !important ;
    font-size: 14px !important ;
    margin-right: 5px;
    @media screen and (max-width: 767px) {
      margin-right: 0px;
    }
  }
  &:hover {
    background-color: ${Colors.blue};
  }
`;
const AdminDropDowns = () => {
  const [contactAdvancedFiltersDocVisible, setAdvancedFiltersDocModalIsVisible] = useState(false);
  const [validator] = useValidator();
  const [loading, setLoading] = useState(true);
  const [contactCreateFolderVisible, setCreateFolderModalIsVisible] = useState(false);
  const [contactDocumentPreviewVisible, setDocumentPreviewModalIsVisible] = useState(false);
  const [screens, setScreens] = useState([] as any);
  const [lookUpDetails, setlookUpDetails] = useState<any>([]);
  const [lookTypes, setLookTypes] = useState<any>([]);
  const [languages, setLanguages] = useState<any>([]);
  const [selectedDropDown, setSelectedDropDown] = useState({ screenId: -1, lookTypeId: -1, });
  const [dropDownCreationVisible, setDropDownCreationModalIsVisible] = useState(false);
  const currentHeaderModal = useSelector((state: RootState) => state?.global?.currentHeaderModal);
  
  const dispatch: Dispatch<any> = useDispatch()


  let selectedCheck: any = [];

  lookUpDetails?.lookupDetail?.map((singleObj: any) => {
    if (singleObj.select) {
      selectedCheck.push(singleObj);
    }
    return singleObj;
  });

  const HeaderCheckbox = (e: any) => {
    let checked = e.target.checked;
    lookUpDetails?.lookupDetail.map((selectedData: any) => { selectedData.select = checked; return selectedData; });
    setlookUpDetails({ ...lookUpDetails });
  };

  const Checkbox = (item: any, e: any) => {

    let checked = e.target.checked;
    let updatedLookupDetial = lookUpDetails?.lookupDetail?.map((data: any) => {
      if (item.id === data.id) {
        data.select = checked;
      }
      return data;
    });
    setlookUpDetails((prevState: any) => ({ ...prevState, lookupDetail: [...updatedLookupDetial] }));
  };

  let deletedItems = selectedCheck.map((item: any) => {
      return item.id;
    });
      const deleteMultiple = () => {
    deletAPI(deletedItems);
  };
  const onChange = (name: any, value: any) => {
    setSelectedDropDown({ ...selectedDropDown, [name]: value });
  };
  const getScreens = () => {
    API.get(API_URLS.GetScreens).then((response: any) => {
      let dropdownData = response?.data.map((x: any) => {
        return { key: x.id, value: x.id, text: x.screenName };
      });
      setScreens(dropdownData as any);
    });
  };

  const getLookupTypes = () => {
    API.get(API_URLS.GetLookupTypes, {
      params: { screenId: selectedDropDown.screenId },
    }).then((response) => {
      let pagesData = response?.data.map((x: any) => {
        return {
          key: x.id,
          value: x.id,
          text: x.name,
          translation: x.translation,
        };
      });
      setLookTypes(pagesData as any);
    });
  };
  const getLookupDetails = () => {
    setLoading(true);
    API.post(API_URLS.GetLookupDetails, { id: selectedDropDown.lookTypeId }).then((response) => {
      setlookUpDetails(response?.data);
    }).finally(()=>{
      setLoading(false);
    });
  };
  const deletAPI = (deletedItems: any) => {
    setLoading(true);
    API.delete(API_URLS.DeleteLookup, {
      data: { lookupId: deletedItems },
    }).then((response: any) => {
      getLookupDetails();
      SuccessToast(response?.message);
    }).finally(() => {
      setLoading(false);
    });
  };

  const getLanguages = () => {
    API.get(API_URLS.GetLanguages).then((response: any) => {
      setLanguages(response.data);
    });
  };
  useEffect(() => {
    getScreens();
    getLanguages();
  }, []);

  useEffect(() => {
    if (selectedDropDown.screenId !== -1) {
      getLookupTypes();
    }
  }, [selectedDropDown.screenId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (selectedDropDown.lookTypeId !== -1) {
      getLookupDetails();
    }
  }, [selectedDropDown.lookTypeId]); // eslint-disable-line react-hooks/exhaustive-deps
  
  useEffect(() => {

    if (currentHeaderModal) {
      if (currentHeaderModal?.moduleName === ModuleName.AdminDropDowns && currentHeaderModal?.isMoodelOpen === ModalProperty.Close) {
        getLookupDetails();
        dispatch(storeHeaderModal({ moduleName: ModuleName.AdminDropDowns, isMoodelOpen: ModalProperty.Show }));
      }
    }
  }, [currentHeaderModal]);  // eslint-disable-line react-hooks/exhaustive-deps
  
  return (
    <> 
    <AdminLayout SubTabName="GeneralConfiguration">
      <BaseModal
        open={contactAdvancedFiltersDocVisible}
        modalType={ModalList.AdvancedFiltersDoc}
        onClose={setAdvancedFiltersDocModalIsVisible}
      />
      <BaseModal
        open={contactCreateFolderVisible}
        modalType={ModalList.CreateFolder}
        onClose={setCreateFolderModalIsVisible}
      />
      <BaseModal
        open={contactDocumentPreviewVisible}
        modalType={ModalList.DocumentPreview}
        onClose={setDocumentPreviewModalIsVisible}
      />
      <BaseModal
        open={dropDownCreationVisible}
        modalType={ModalList.DropDownCreation}
        onClose={setDropDownCreationModalIsVisible}
        id={selectedDropDown.lookTypeId}
      />
      
      <GridWrapper>
        <SeacrhWrapper>
          <LeftCol>
            {/* <SeacrhBar>
              <input type="text" placeholder="Search drop down"></input>
              <img src={Icons.SearchIcon} alt=""></img>
            </SeacrhBar> */}
            
            <div className="fullWidth">
              <label>Object</label>
              <DropdownValidator
                dropdown={screens}
                name={"screenId"}
                value={selectedDropDown.screenId}
                simpleValidator={validator}
                handleChange={onChange}
                customValidator=""
                customMessage={{ required: "" }}
              />
            </div>
            <div className="fullWidth">
              <label>Drop down</label>
              <DropdownValidator
                dropdown={lookTypes}
                name={"lookTypeId"}
                value={selectedDropDown.lookTypeId}
                simpleValidator={validator}
                handleChange={onChange}
                customValidator=""
                customMessage={{ required: "" }}
              />
            </div>
            <EditBtn onClick={() => setDropDownCreationModalIsVisible(true)}>
              <Icon icon={Icons.Edit} /> Edit Info
            </EditBtn>
          </LeftCol>
        </SeacrhWrapper>
        
        
        {lookUpDetails?.lookupTypeName && <>
        {loading && <div> <Dimmer active inverted> <Loader size='small'>Loading...</Loader> </Dimmer></div>}
          <BorderWrapper>
            <Grid columns={3}>
              <>
                <GridColumn width={8} className="fullWidth" textAlign="left">
                  <label>Drop down name</label>
                  <h4>{lookUpDetails?.lookupTypeName}</h4>
                </GridColumn>
                {lookUpDetails?.sortByName && (
                  <GridColumn width={8} className="fullWidth" textAlign="left">
                    <label>Sort by</label>
                    <h4>{lookUpDetails?.sortByName}</h4>
                  </GridColumn>
                )}
                {lookUpDetails?.default && (
                  <GridColumn width={8} className="fullWidth" textAlign="left">
                    <label>Default</label>
                    <h4>{lookUpDetails?.default}</h4>
                  </GridColumn>
                )}
              </>
            </Grid>
          </BorderWrapper>
          <div className="fixedContent7">
            <TableContent>
              <table cellSpacing="0" cellPadding="0">
                <thead>
                  <tr>
                    {languages?.map((x: any) => {
                      return (
                        <th>
                          {`Drop down value ${x.languageName.toLowerCase()}`}
                        </th>
                      )
                    })}
                    <th className="fixWidth">
                      <FLexBox>
                        <WhiteCheckBox>
                          <input
                            type="checkbox"
                            checked={
                              lookUpDetails?.lookupDetail?.length === selectedCheck.length
                            }
                            onChange={(e) => HeaderCheckbox(e)}
                          ></input>
                          <span className="checkmark"></span>
                        </WhiteCheckBox>
                        <Icon icon={Icons.DownArrow} />
                      </FLexBox>
                    </th>
                    <th className="fixWidth">
                      <Icon
                        icon={Icons.Delete}
                        onClick={(index: any) => deleteMultiple()}
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lookUpDetails?.lookupDetail?.map((item: any, index: any) => {
                    return (
                      <tr key={item.id}>
                        {languages?.map((lang: any) => {
                          let filteredLanguage = item.translation.find(
                            (x: any) => x.languageId === lang.id
                          );
                          return (
                            <td>
                              {filteredLanguage?.value}
                            </td>
                          );
                        })}

                        <td data-label="Select" className="fixWidth">
                          <CheckBox>
                            <input
                              type="checkbox"
                              checked={item.select}
                              onChange={(e: any) => {
                                Checkbox(item, e);
                              }}
                            ></input>
                            <span className="checkmark"></span>
                          </CheckBox>
                        </td>
                        <td data-label="Action" className="fixWidth"></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </TableContent>
          </div>
        </>}
      </GridWrapper>
    
    </AdminLayout>
    </>
  );
};

export default AdminDropDowns;
