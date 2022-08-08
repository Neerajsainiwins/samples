import styled from "styled-components";
import { Grid, GridColumn } from "semantic-ui-react";


import Colors from "../../../util/Colors";
import "react-datepicker/dist/react-datepicker.css";
import Icon from "../../elements/Icon";
import { IconEnum as Icons } from "../../elements/Icons";
import BaseModal, { ModalList } from "../BaseModal";
import { useState } from "react";
// import EditFieldProperties from "./EditFieldProperties";

const FormWrapper = styled.div`
    padding: 15px;
    margin: 10px 0;
    height: 100%;
    overflow-y: auto;
    h3{
        margin: 0;
        font-size:20px;
        color: ${Colors.black} ;
        font-family: 'euclid_circular_abold';
    }
    h5{
        font-size: 18px ;
        color: ${Colors.black} ;
        font-family: 'euclid_circular_aMdIt';
        margin: 0 0 10px;
        @media screen and (max-width: 767px) {
            font-size: 12px !important ;
        } 
    }
    input{
        width: 100% ;
        padding: 14px 15px ;
        border-radius: 10px ;
        border: 1px solid ${Colors.bordercolor} ;
        &:focus-visible {
            outline:none ;
        }
    }
    .divider {
        font-size:14px ;
        color: ${Colors.black} !important ;
        font-family: 'euclid_circular_bbold' ;
        margin: 0 !important ;
    }
    label{
        font-size: 13px ;
        font-family: 'euclid_circular_bmedium' ;
        color: ${Colors.grey} ;
        margin-bottom: 6px ; 
        display: flex ;
        strong { 
            color:${Colors.black};
            margin-left:5px;
        }
    }
    h4{ 
        font-size: 18px ;
        color: ${Colors.black} ; 
        font-family: 'euclid_circular_bregular' ;
        margin: 0 ; 
        @media screen and (max-width: 767px){   
            font-size: 14px !important ;  
        }
        .companyName{
            color: ${Colors.blue1} ;  
            background-color: ${Colors.exlightblue} ;
            padding: 4px 10px ;
            border-radius: 50px ;
        }
    }
    .dropdown{
        padding: 14px 15px !important ;
        border-radius: 8px !important ; 
        &.icon {
            font-size: 18px !important ;
            padding: 10px !important ;
        } 
        &.multiSelect{
            padding: 4px 15px !important ;
            min-height: 45px ;
            display: flex ;
            align-items: center ;
            flex-flow: wrap ;            
            a{
                font-size: 12px !important;
                font-family: 'euclid_circular_blight' ;
                background-color: transparent ;
                border-radius: 50px ;
                display: flex !important ;
                align-items: center ;
                color: ${Colors.black} ;
                grid-gap: 5px ;
                min-width: 120px ;
                justify-content: space-between ;
                img{
                    width: 25px !important ;
                    height: 25px !important ;
                }
                i{
                    background-color: ${Colors.basecolor} ;
                    width: 20px ;
                    height: 20px ;
                    display: flex ; 
                    align-items: center ; 
                    justify-content: center ; 
                    border-radius: 50% ; 
                    opacity: 1 !important ;  
                    color: ${Colors.shadegrey} ;             
                    font-size: 9px !important ;  
                }
            }
            &.chooseMultiOption{
                padding: 2px 30px 2px 3px !important ; 
                a{
                    background-color: ${Colors.bordercolor} ;
                    border-radius: 5px ;
                    box-shadow: none ;
                    padding: 7px 12px ;
                    i{
                        background-color: ${Colors.white} ;
                    }
                }
                
            }
            
        }
    } 
    .ui {
        &.left {
            &.icon {
                &.input {
                    width: 100% ;
                }
            }
        }
        &.input
            width: 100% ;
            border-radius: 8px ;
            input {
                padding: 13px 15px !important ;
                border-radius: 10px !important ;
                font-family: 'euclid_circular_bsemibold' ;
            }
        }
        
    }  
    
`;
const EditBtn = styled.button`
    background-color: ${Colors.darkblue};
    color: ${Colors.white};
    border: none ;
    font-size: 12px ; 
    padding: 15px 20px ; 
    border-radius: 10px ; 
    cursor: pointer ;
    min-width: 90px ;
    @media screen and (max-width: 767px) {   
        min-width: inherit ;
        font-size: 0 ;  
        padding: 12px ;  
    }
    svg {
        color: ${Colors.white} !important ; 
        font-size: 14px !important ;
        margin-right:5px ;
        @media screen and (max-width: 767px) {     
            margin-right:0px ;
        }
    }
    &:hover{ 
        background-color: ${Colors.blue};
    }
`;


const FieldPropertiesDetail = (props : any) => {
    console.log("Startdate",startDate);
    const [EditFieldPropertiesVisible, setEditFieldPropertiesModalIsVisible] = useState(false);

    return (
        
        <>  
 
            <BaseModal
                open={EditFieldPropertiesVisible}
                modalType={ModalList.EditFieldProperties}
                onClose={setEditFieldPropertiesModalIsVisible}
            />
                   {/* {props?.currentButton.labelName === 'Edit Info' ?
                   <>     */}
                <FormWrapper>
                    <Grid columns={2}>
                        <GridColumn width={12}>
                            <Grid columns={2}>
                                <GridColumn width={8} className="fullWidth">
                                    <label>Field name</label>
                                    <h4>Deal type</h4>
                                </GridColumn>
                                <GridColumn width={8} className="fullWidth">
                                    <label>Section</label>
                                    <h4>High level</h4>
                                </GridColumn>
                                <GridColumn width={16} className="fullWidth">
                                    <label>Mandatory</label>
                                    <h4>YES</h4>
                                </GridColumn>
                                <GridColumn width={8} className="fullWidth">
                                    <label>Type</label>
                                    <h4>Multi select dropdown</h4>
                                </GridColumn>
                                <GridColumn width={8} className="fullWidth">
                                    <label>Suffix</label>
                                    <h4>Deals</h4>
                                </GridColumn>
                                <GridColumn width={16} className="fullWidth">
                                    <label>Placeholder</label>
                                    <h4>Please enter existing or new</h4>
                                </GridColumn>
                            </Grid>
                        </GridColumn>
                        <GridColumn width={4} textAlign="right">
                            <EditBtn onClick={()=>setEditFieldPropertiesModalIsVisible(true)}><Icon icon={Icons.Edit}/> Edit Info</EditBtn>
                        </GridColumn>
                    </Grid>                         
                </FormWrapper>   


                {/* </> :<EditFieldProperties/>
                   }    */}
            </>
        );
    };
    
    export default FieldPropertiesDetail;

function startDate(arg0: string, startDate: any) {
    throw new Error("Function not implemented.");
}
