import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {  Dropdown } from "semantic-ui-react";



import Colors from "../../../util/Colors";
import routePaths from "../../../config/routepaths.config";

const businessCountry = [
    {  key: 'France', value: 'France', text: 'France'  },
    {  key: 'USA', value: 'USA',  text: 'USA' },
    {  key: 'China', value: 'China',  text: 'China'  },
    {  key: 'Japan', value: 'Japan', text: 'Japan'  },
]
const CreateViewWrapper = styled.div`
    padding: 20px 40px;
    margin: 10px 0;
    height: 100%;
    overflow-y: auto;
    @media screen and (max-width: 767px) {
        padding: 15px;
    }
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
        font-family: 'euclid_circular_abold';
        &:focus-visible{
            outline:none;            
        }
    }
    
    &.actionBtn{
        display: flex;
        justify-content: flex-end;
        grid-gap: 15px;
        margin-top: 40px;
        margin-bottom: 0;
        @media screen and (max-width: 767px) {
            margin-bottom:0;
            margin-top: 0;
        }
    }
    .dropdown{
        padding: 14px 15px !important;
        border-radius: 8px !important;
        background-color: ${Colors.basecolor} !important; 
        font-family: 'euclid_circular_amedium';
        &.icon {
            font-size: 18px !important;
            padding: 10px !important;
        } 
    } 
`;
const RadioWrapper = styled.div`    
`;
const CommonOutlineBtn = styled.button`
    border: 1px solid ${Colors.darkblue};
    color: ${Colors.darkblue};
    padding: 20px 15px;
    font-size: 14px;
    font-family: 'euclid_circular_abold';
    min-width: 160px;
    border-radius: 10px;    
    background-color: transparent;
    cursor: pointer;
    &:hover{
        border: 1px solid ${Colors.blue};
        color: ${Colors.blue};
    }
    @media screen and (max-width: 767px) {
        display:none;
    }
`;
const CommonFillBtn = styled.button`
    background-color: ${Colors.darkblue};
    color: ${Colors.white};
    padding: 20px 15px;
    font-size: 14px;
    font-family: 'euclid_circular_abold';
    border: 1px solid ${Colors.blue};
    min-width: 160px;
    border-radius: 10px;
    cursor: pointer;
    &:hover{  
        background-color: ${Colors.blue}; 
        color: ${Colors.white};
    }
    @media screen and (max-width: 767px) {
        width: 100%;
    }
`;
const RadioBtn = styled.label`
    display: block;
    position: relative;
    cursor: pointer;
    font-size: 22px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    min-height: 18px;
    font-size:14px;
    font-family: 'euclid_circular_amedium';    
    padding-left: 30px;
    margin: 15px 0; 
    color:  ${Colors.grey};  
    input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
        &:checked ~ .checkmark {
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
        height: 18px;
        width: 18px;
        background-color: ${Colors.white};
        border-radius: 50%;
        border: 2px solid ${Colors.grey};
        &:after {
            content: "";
            position: absolute;
            display: none;
            left: 3px;
            top: 3px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: ${Colors.blue};
        }
      }
    &:hover,&.active,&:focus-visible{
        color: ${Colors.black};
    }
    
`;

const CompanyCreateView = (props : any) => {

    const navigate = useNavigate();
    
    return (
            <>
            <CreateViewWrapper>
                <ModalContent>
                    <FieldRow>
                        <p>Name</p>
                        <input type="text" placeholder="View 1"></input>
                    </FieldRow>
                    <FieldRow>
                        <p>Share with</p>
                        <RadioWrapper>
                            <RadioBtn>
                                <input type="radio" name="radio"></input> Private
                                <span className="checkmark"></span>
                            </RadioBtn> 
                            <RadioBtn className="active">
                                <input type="radio" name="radio" checked></input> Everyone
                                <span className="checkmark"></span>
                            </RadioBtn> 
                            <RadioBtn>
                                <input type="radio" name="radio"></input> Role
                                <span className="checkmark"></span>
                            </RadioBtn> 
                        </RadioWrapper>                        
                    </FieldRow>  
                    <FieldRow>
                        <Dropdown fluid selection options={businessCountry} className="multiSelect chooseMultiOption" placeholder='Not selected'/>
                    </FieldRow>
                    <FieldRow className="actionBtn">
                        <CommonOutlineBtn onClick={props.close}>Cancel</CommonOutlineBtn>
                        <CommonFillBtn onClick={()=> navigate(routePaths.COMPANYVIEW)}>Create</CommonFillBtn>
                    </FieldRow>
                </ModalContent>
            </CreateViewWrapper>     
                   
            </>
        );
    };
    
    export default CompanyCreateView;