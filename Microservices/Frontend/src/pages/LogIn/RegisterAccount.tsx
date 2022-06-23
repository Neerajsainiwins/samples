import styled from "styled-components";
import { useState } from "react";

import useValidator from "../../hooks/useValidator";
import InputValidator from "../../components/form/InputValidator";
import { IconEnum as Icons } from "../../components/elements/Icons";
import { useNavigate } from "react-router-dom";
import routePaths from "../../config/routepaths.config";
import Icon from "../../components/elements/Icon";
import Astric from "../../util/Astric";
import { errorMessages } from "../../config/messages.config";
import PasswordChecklist from "react-password-checklist"
import API from "../../services/api.services";
import { API_URLS } from "../../config/api.config";
import { FormGroup, HeaderCol } from "./UserLoginPage";
import CustomButton from "../../components/Loader/CustomButton";

const LogoWrapper = styled.div``;
const LoginWrap = styled.div`
  align-items: flex-start;
  h2 {
    margin-bottom: 40px !important;
  }
`;



const UserRegisterAccount = () => {
  const navigate = useNavigate();

  const [validator, showValidationMessage] = useValidator({}, {
    // For Custom error message in confirm Password field
    validConfirmPassword: {
      message: errorMessages.PasswordNotMatched,
      rule: (val: any, params: any) => {
        if (params[0] !== "undefined" && params[0] !== val) {
          return val === params[0];
        }
      },
      required: true,
    },
    // For Custom error message in Password field
    validPassword: {
      message: errorMessages.InvalidPassword,
      rule: (val: any) => {
        const passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{12,}$/;
        if (val !== "" && !passwordReg.test(val)) {
          checkPasswordValid(false);
          return false;
        }
      },
      required: true,
    },

  });
  const [inputRegister, setInputRegister] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [loading, setLoading] = useState(false);


  const checkPasswordValid = (isValid: boolean) => {
    setIsPasswordValid(isValid);
  }
 


  const onChange = (name: any, value: any) => {
    if (name === "password" && value === "") {
      checkPasswordValid(true);
    }
    setInputRegister({ ...inputRegister, [name]: value });
  };

  function handleSubmit(e: any) {
  
    if (validator.allValid()) {
      setLoading(true);
      API.post(API_URLS.Authenticationregister , { ...inputRegister }).then((response: any) => {
        navigate(routePaths.CONFIRM_EMAIL,{state:{email:inputRegister.email}})
        }).finally(()=>{
          setLoading(false);
        });
    } else {
      showValidationMessage(true);
    }
  }

  return (
    <>
      <LoginWrap className="LoginWrapper">
        <LogoWrapper className="logo">
          <img src={Icons.LogoImage} alt=""></img>
        </LogoWrapper>
        <div className="loginForm">
          <HeaderCol>
            <h2>
              {" "}
              Register an account{" "}
              <span
                className="closePopUp responsiveContent"
                onClick={() => navigate(routePaths.LOGIN)}
              >
                <Icon icon={Icons.TimesSolid} size={18} />
              </span>
            </h2>
          </HeaderCol>

          <FormGroup>
            <label>
              First name <Astric />
            </label>
            <div className="formControl">
              <InputValidator
                type={"text"}
                name={"firstName"}
                value={inputRegister.firstName}
                simpleValidator={validator}
                handleChange={onChange}
                customValidator="required"
                customMessage={{ required: errorMessages.RegisterFirstName }}
              />
            </div>
          </FormGroup>
          <FormGroup>
            <label>
              Last name <Astric />
            </label>

            <div className="formControl">
              <InputValidator
                type={"text"}
                name={"lastName"}
                value={inputRegister.lastName}
                simpleValidator={validator}
                handleChange={onChange}
                customValidator="required"
                customMessage={{ required:errorMessages.RegisterLastName }}
              />
            </div>
          </FormGroup>
          <FormGroup>
            <label>
              Business email
              <Astric />
            </label>
            <div className="formControl">
              <InputValidator
                type={"text"}
                name={"email"}
                value={inputRegister.email}
                simpleValidator={validator}
                handleChange={onChange}
                customValidator="required|email"
                customMessage={{
                  required:errorMessages.RegisterBusinessEmail,
                }}
              />
            </div>
          </FormGroup>
          <FormGroup className="errorMessage">
            <label>
              Password
              <Astric />
            </label>
            <div className={`formControl ${!isPasswordValid ? "passwordError" : ""}`} >
              <InputValidator
                type={"password"}
                name={"password"}
                value={inputRegister.password}
                simpleValidator={validator}
                handleChange={onChange}
                 customValidator="required|validPassword"
                // customMessage={{ required:errorMessages.UserPassword}}
              />
              {inputRegister.password &&
               <PasswordChecklist
               className={"PasswordChecklist"}
                rules={["minLength","specialChar",
                        "number","capital","lowercase"]}
                minLength={12}
                value={inputRegister.password}
               
            />
              }
            </div>
            {/* <div className="errorText smHide">
              <p>
                <img src={Icons.RedCloseImage} alt=""></img> 12 characters (at
                least 5 different)
              </p>
              <p>
                <img src={Icons.GreenTick} alt=""></img> 1 special character, 1
                uppercase, 1 lowercase and 1 digit
              </p>
            </div> */}
          </FormGroup>
          <FormGroup>
            <label>
              Confirm password
              <Astric />
            </label>
            <div className="formControl">
              <InputValidator
                type={"password"}
                name={"confirmPassword"}
                value={inputRegister.confirmPassword}
                simpleValidator={validator}
                handleChange={onChange}
                customValidator={`required|validConfirmPassword:${inputRegister.password}`}
                customMessage={{
                  required:errorMessages.RegisterConfirmPassword,
                }}
              />
            </div>
          </FormGroup>

          <div className="actionBtn responsiveContent">
            <span
              className="link themeColor"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(routePaths.LOGIN)}
            >
              Already have an account
            </span>
            <span className="link themeColor">Sign up with Linkdin</span>
          </div>

          <div className="actionBtn">
            <CustomButton fullWidth={true} buttonText="Sign up" loading={loading} onClick={handleSubmit}></CustomButton>
          </div>

          <div className="actionBtn smHide">
            <span
              className="link themeColor"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(routePaths.LOGIN)}
            >
              Already have an account
            </span>

            <span className="link themeColor">Sign up with linkdin</span>
          </div>
        </div>
      </LoginWrap>
      <div className="loginGrapgicsImage smHide">
        <img src={Icons.LoginGrapgics} alt=""></img>
      </div>
    </>
  );
};

export default UserRegisterAccount;


// function dispatch(arg0: any) {
//   throw new Error("Function not implemented.");
// }

