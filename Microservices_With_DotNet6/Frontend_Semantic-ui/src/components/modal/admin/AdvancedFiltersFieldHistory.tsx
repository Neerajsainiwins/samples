import React, { useState } from "react";
import styled from "styled-components";
import { Grid, GridColumn, Search, Dropdown, Input } from "semantic-ui-react";


import { IconEnum as Icons } from "../../elements/Icons"
import Colors from "../../../util/Colors";
// import ProfileImage from '../../../assets/svg/Profile.jpg'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



const subType = [
    { key: 'Lawyer', value: 'Lawyer', text: 'Lawyer' },
    { key: 'Lawyer 1', value: 'Lawyer 1', text: 'Lawyer 1' },
    { key: 'Lawyer 2', value: 'Lawyer 2', text: 'Lawyer 2' },
    { key: 'Lawyer 3', value: 'Lawyer 3', text: 'Lawyer 3' },
    { key: 'Lawyer 4', value: 'Lawyer 4', text: 'Lawyer 4' },
]



//#region  styled css

const FieldRow = styled.div` 
    margin: 25px 0 0;   
    &.actionBtn{
        display: flex;
        justify-content: flex-end;
        grid-gap: 15px;
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
    @media (max-width:767px){  
        width: 100%;
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
            &.normalFont{
                input{
                    font-family: 'euclid_circular_aregular';
                    font-size: 12px;
                    color: ${Colors.grey};
                }            
            }
        }
        .react-datepicker-wrapper {
            input {
                color: ${Colors.grey};
            }
        }
        
    }  
    
`;

const CalendarWrap = styled.div`
    position: relative;
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

//#endregion

const AdvancedFiltersFieldHistory = (props : any) => {

    
    const [startDate, setStartDate] = useState(new Date());
    console.log("Startdate",startDate);

    return (
        
        <>  
      

                
                <FormWrapper>
                        <Grid columns={2}>  
                            <GridColumn width={16}>
                                <Search className="normalFont"  placeholder='Search deal name and notes' input={{ icon: 'search', iconPosition: 'left' }}/>
                            </GridColumn> 
                            <GridColumn width={16} className="fullWidth">
                                <label>Record name</label>
                                <Input fluid type="text" placeholder="Solar panel"/>
                            </GridColumn> 
                            <GridColumn width={8} className="fullWidth">
                                    <label>Module</label>
                                    <Dropdown fluid selection options={subType} placeholder='Portfolio'  />
                            </GridColumn> 
                            <GridColumn width={8}>
                                    <label>Action</label>
                                    <Dropdown fluid selection options={subType} placeholder='---'  />
                            </GridColumn>
                            <GridColumn width={8} className="fullWidth">
                                    <label>Tabs</label>
                                    <Dropdown fluid selection options={subType} placeholder='General'  />
                            </GridColumn> 
                            <GridColumn width={8}>
                                    <label>Sub tabs</label>
                                    <Dropdown fluid selection options={subType} placeholder='General'  />
                            </GridColumn>
                            <GridColumn width={8} className="fullWidth">
                                <label>Date from</label>
                                <CalendarWrap>
                                    <DatePicker onChange={(date) => setStartDate(date as any)} selected={startDate} placeholderText="Date" />
                                    <CalendarImg src={Icons.CalendarImage}></CalendarImg>
                                </CalendarWrap>                                    
                            </GridColumn> 
                            <GridColumn width={8} className="fullWidth">
                                <label>Date to</label>
                                <CalendarWrap>
                                    <DatePicker onChange={(date) => setStartDate(date as any)} selected={startDate} placeholderText="Date" />
                                    <CalendarImg src={Icons.CalendarImage}></CalendarImg>
                                </CalendarWrap>                                    
                            </GridColumn> 
                                                     
                        </Grid>
                        

                        <FieldRow className="actionBtn">
                            <CommonFillBtn onClick={props.close}>Search</CommonFillBtn>     
                        </FieldRow>  
                </FormWrapper>
                    
                
                   
            </>
        );
    }; 
    
    export default AdvancedFiltersFieldHistory;   