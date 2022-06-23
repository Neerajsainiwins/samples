
import styled from "styled-components";
import { Dimmer, Grid, GridColumn, Loader, } from "semantic-ui-react";
import { useState, useEffect, useImperativeHandle, forwardRef } from "react";

import API from "../../services/api.services";
import { API_URLS } from "../../config/api.config";
import colors from '../../util/Colors';
import { GridWrapper } from "./SuperAdmin";
import InputValidator from "../../components/form/InputValidator";
import useValidator from "../../hooks/useValidator";
import { SuccessToast } from "../../util/toaster";
import DropdownValidator from "../../components/form/DropdownValidator";
import { errorMessages } from "../../config/messages.config";
import { storeHeaderModal } from "../../store/actions";
import { ModalProperty, ModuleName } from "../../util/enum";
import { useDispatch } from "react-redux";

const BorderWrapper = styled.div`
  margin: 15px 0 25px;
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
    display: flex;
    align-items: center @media screen and (max-width: 767px) {
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
    @media screen and (max-width: 767px) {
      font-size: 14px;
    }
  }
  input {
    width: 100%;
    padding: 14px 15px !important;
    border-radius: 10px !important;
    border: 1px solid ${colors.bordercolor} !important;
    font-family: "euclid_circular_abold" !important;
    &:focus-visible {
      outline: none;
    }
  }
  textarea {
    padding: 8px;
    width: 100%;
    border-radius: 10px;
    border: 1px solid ${colors.bordercolor};
    resize: none;
    height: 58px;
    font-family: "euclid_circular_aMdIt";
    color: ${colors.grey0};
    line-height: 20px;
    font-size: 14px;
    &:focus-visible {
      outline: none;
    }
  }
  label {
    font-size: 12px;
    font-family: "euclid_circular_amedium";
    color: ${colors.grey};
    margin-bottom: 6px;
    display: flex;
  }
  .divider {
    font-size: 14px;
    color: ${colors.black} !important;
    font-family: "euclid_circular_abold";
    margin: 0 !important;
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
      font-family: "euclid_circular_bbold" !important;
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
`;
export interface IAdminTenantProps {
  isTenantEditEnabled?: boolean,
  tenantId?: number
}


const AdminTenant = forwardRef<any, IAdminTenantProps>((props, ref) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [tenentDetail, setTenentDetail] = useState<any>({
    clientName: "",
    clientTypeId: "",
    urlLink: "",
    numberOfUsers: "",
    numberOfAdministrators: "",
    id: "",
  });
  const [validator, showValidationMessage] = useValidator();
  const [dropdown, setDropdown] = useState([]);
  const dispatch = useDispatch();

  const onChange = (name: any, value: any) => {
    setTenentDetail({ ...tenentDetail, [name]: value });
  };

  const gettenentDetail = (tenantId: number | undefined) => {
    setLoading(true);
    API.get(API_URLS.GetTenant, { params: { id: tenantId } }).then(
      (response: any) => {
        setTenentDetail(response?.data);
      }).finally(() => {
          setLoading(false);
      });
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getClientTypes = () => {
    API.get(API_URLS.GetClientTypes).then((response: any) => {
      let dropdownData = response?.data?.map((x: any) => {
        return { key: x.id, value: x.id, text: x.name };
      });
      setDropdown(dropdownData as any);
    });
  }

  const postData = () => {
    setLoading(true);
    API.post(API_URLS.CreateTenant, { ...tenentDetail }).then(
      (response: any) => {
        SuccessToast(response?.message);
        gettenentDetail(props?.tenantId);
      }
    ).finally(() => { setLoading(false); });
  };

  useImperativeHandle(ref, () => ({

    handleSubmit() {
      if (validator.allValid()) {
        postData();
        return true;
      } else {
        showValidationMessage(true);
        return false;
      }
    }
  }));

  useEffect(() => {
    dispatch(storeHeaderModal({ moduleName: ModuleName.AdminTenant, isMoodelOpen: ModalProperty.Show }));
    getClientTypes();
    setLoading(true);
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (props?.tenantId) {
      gettenentDetail(props?.tenantId);
    }
  }, [props?.tenantId]);


  return (
    <>
      <GridWrapper className="titleTabDropdownButton tenantContent" isLoading={loading}>
        {loading ? <Dimmer active inverted> <Loader size='small'>Loading</Loader> </Dimmer> :
          <BorderWrapper >
            {props.isTenantEditEnabled ?
              <Grid columns={2} className="fullWidth">
                <GridColumn width={7} className="fullWidth">
                  <label>Client name</label>
                  <InputValidator
                    type={"text"}
                    name={"clientName"}
                    value={tenentDetail.clientName}
                    simpleValidator={validator}
                    handleChange={onChange}
                    customValidator="required"
                    customMessage={{ required: errorMessages.EditTenantClientName }} placeHolder={undefined} />
                </GridColumn>
                <GridColumn width={2} className="emptyCol"></GridColumn>
                <GridColumn width={7} className="fullWidth">
                  <label>Client type</label>
                  <DropdownValidator
                    dropdown={dropdown}
                    name={"clientTypeId"}
                    value={tenentDetail.clientTypeId}
                    simpleValidator={validator}
                    handleChange={onChange}
                    customValidator="required"
                    customMessage={{ required: errorMessages.EditTenantClientType }}
                  />
                </GridColumn>
                <GridColumn width={7} className="fullWidth">
                  <label>Number of users</label>
                  <InputValidator
                    type={"number"}
                    name={"numberOfUsers"}
                    value={tenentDetail.numberOfUsers}
                    simpleValidator={validator}
                    numberOnly={true}
                    handleChange={onChange}
                    customValidator="required"
                    customMessage={{
                      required: errorMessages.EditTenantNumberUser,
                    }}
                  />
                </GridColumn>
                <GridColumn width={2} className="emptyCol"></GridColumn>
                <GridColumn width={7} className="fullWidth">
                  <label>Number of administrators</label>
                  <InputValidator
                  
                    type={"number"}
                    name={"numberOfAdministrators"}
                    value={tenentDetail.numberOfAdministrators}
                    simpleValidator={validator}
                    numberOnly={true}
                    handleChange={onChange}
                    customValidator={`required|maxAdministrators:${tenentDetail.numberOfUsers}`}
                    customMessage={{ required:errorMessages.CreateTenantNoAdminst }}
                  />
                </GridColumn>
                <GridColumn width={7} className="fullWidth">
                  <label>URL Link</label>
                  <InputValidator
                    type={"text"}
                    name={"urlLink"}
                    value={tenentDetail.urlLink}
                    simpleValidator={validator}
                    handleChange={onChange}
                    customValidator="required|validUrl"
                    customMessage={{ required:errorMessages.EditTenantUrl }}
                  />
                </GridColumn>
              </Grid>
              :
              <Grid columns={2} className="fullWidth">
                <GridColumn width={7} className="fullWidth">
                  <label>Clint name</label>
                  <h4>{tenentDetail?.clientName}</h4>
                </GridColumn>
                <GridColumn width={2} className="emptyCol"></GridColumn>
                <GridColumn width={7} className="fullWidth">
                  <label>Client type</label>
                  <h4>{tenentDetail?.clientType}</h4>
                </GridColumn>
                <GridColumn width={7} className="fullWidth">
                  <label>Number of users</label>
                  <h4>{tenentDetail?.numberOfUsers}</h4>
                </GridColumn>
                <GridColumn width={2} className="emptyCol"></GridColumn>
                <GridColumn width={7} className="fullWidth">
                  <label>Number of administrators</label>
                  <h4>{tenentDetail?.numberOfAdministrators}</h4>
                </GridColumn>
                <GridColumn width={7} className="fullWidth">
                  <label>URL Link</label>
                  <h4>{tenentDetail?.urlLink}</h4>
                </GridColumn>
              </Grid>
            }
          </BorderWrapper>
        }
      </GridWrapper>
    </>
  );
});

export default AdminTenant;
