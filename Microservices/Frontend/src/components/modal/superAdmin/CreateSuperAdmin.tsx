import React, { useState } from "react";
import { useEffect } from "react";



import { Grid, GridColumn } from "semantic-ui-react";
import "react-datepicker/dist/react-datepicker.css";
import { API_URLS } from "../../../config/api.config";
import API from "../../../services/api.services";
import InputValidator from "../../../components/form/InputValidator";
import useValidator from "../../../hooks/useValidator";
import DropdownValidator from "../../form/DropdownValidator";
import { SuccessToast } from "../../../util/toaster";
import { FieldRow, FormWrapper } from "../BaseModal";
import CustomButton from "../../Loader/CustomButton";
import Astric from "../../../util/Astric";
import { Dispatch } from "redux";
import { useDispatch, useSelector } from "react-redux";
import { storeHeaderModal } from "../../../store/actions";
import { ModalProperty, ModuleName } from "../../../util/enum";
import { errorMessages } from "../../../config/messages.config";


const CreateTenant = (props: any) => {

    const [createSuperAdmin, setCreatesuperAdmin] = useState({ userName: "", email:"",password:"", tenantId: "" });
    const [loading, setLoading] = useState(false);

    const userDetail = useSelector((state: any) => state.auth.userData);

    const [validator, showValidationMessage] = useValidator();
    const [dropdown, setDropdown] = useState([]);
    const dispatch: Dispatch<any> = useDispatch()
    const onChange = (name: any, value: any) => {
        setCreatesuperAdmin({ ...createSuperAdmin, [name]: value });
    };

    const getAllTenants = () => {
        API.get(API_URLS.GetSuperAdminTenants , { params: { userId:userDetail?.userId } }).then((response: any) => {
            let dropdownData = response?.data?.map((x: any) => {
                return ({ key: x.tenantId, value: x.tenantId, text: x.tenantName })
            });
            setDropdown(dropdownData as any);
        })
    };
    const postAdmindata = () => {
        setLoading(true);
        API.post(API_URLS.CreateSuperAdmin, { ...createSuperAdmin }).then(
            async (response: any) => {
                SuccessToast(response?.message);
                await dispatch(storeHeaderModal({ moduleName: ModuleName.SuperAdmin, isMoodelOpen: ModalProperty.Close }));
                props.close();

            }
        ).finally(()=>{
            setLoading(false);
        });
    };
    function handleSubmit(e: any) {
        if (validator.allValid()) {
            postAdmindata()
        } else {
            showValidationMessage(true);
        }
    }
    useEffect(() => {
        getAllTenants();
    }, [])  // eslint-disable-line react-hooks/exhaustive-deps


    return (
        <>
            <FormWrapper>
                <Grid columns={2}>
                    <GridColumn width={16} className="fullWidth">
                        <label>User name<Astric/></label>
                        <InputValidator type={'text'} name={'userName'} value={createSuperAdmin.userName}  simpleValidator={validator} handleChange={onChange} customValidator="required" customMessage={{ required: "User name is a mandatory field" }} />
                    </GridColumn>
                    <GridColumn width={16} className="fullWidth">
                        <label>Email<Astric/></label>
                        <InputValidator type={'text'} name={'email'} value={createSuperAdmin.email}  simpleValidator={validator} handleChange={onChange} customValidator="required" customMessage={{ required: "Email is a mandatory field" }} />
                    </GridColumn>
                    <GridColumn width={16} className="fullWidth">
                        <label>Password<Astric/></label>
                        <InputValidator type={'password'} name={'password'} value={createSuperAdmin.password}  simpleValidator={validator} handleChange={onChange} customValidator="required" customMessage={{ required: "Password is a mandatory field" }} />
                    </GridColumn>
                    <GridColumn width={16} className="fullWidth">
                        <label>Tenants<Astric/></label>
                        <DropdownValidator isMultiSelect={true}  dropdown={dropdown} name={'tenantId'} value={createSuperAdmin.tenantId} simpleValidator={validator} handleChange={onChange} customValidator="required" customMessage={{ required:errorMessages.CreateSuperAdminTenant }} />
                    </GridColumn>
                </Grid>

                <FieldRow className="actionBtn">
                    <CustomButton onClick={(e) => { handleSubmit(e); }} loading={loading} buttonText={"Create"}></CustomButton>
                </FieldRow>
            </FormWrapper>
        </>
    );
};

export default CreateTenant;