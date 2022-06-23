import React, { useState } from "react";
import styled from "styled-components";
import { Grid, GridColumn, Search, Header, Dropdown } from "semantic-ui-react";


import Colors from "../../util/Colors";
import ProfileImage from '../../assets/svg/Profile.jpg'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IconEnum as Icons } from "../elements/Icons"




const rmOption = [
    {
      key: 'Iniesta',
      text: 'Iniesta',
      value: 'Iniesta',
      image: { avatar: true, src: ProfileImage },
    },
    {
      key: 'Iniesta 1',
      text: 'Iniesta 1',
      value: 'Iniesta 1',
      image: { avatar: true, src: ProfileImage },
    },
    {
      key: 'Iniesta 2',
      text: 'Iniesta 2',
      value: 'Iniesta 2',
      image: { avatar: true, src: ProfileImage },
    },
    {
      key: 'Iniesta 3',
      text: 'Iniesta 3',
      value: 'Iniesta 3',
      image: { avatar: true, src:ProfileImage },
    },
    {
      key: 'Iniesta 4',
      text: 'Iniesta 4',
      value: 'Iniesta 4',
      image: { avatar: true, src: ProfileImage },
    },
    {
      key: 'Iniesta 5',
      text: 'Iniesta 5',
      value: 'Iniesta 5',
      image: { avatar: true, src: ProfileImage },
    },
  ]
const status = [
    { key: 'Sent 1', value: 'Sent 1', text: 'Sent 1' },
    { key: 'Sent 2', value: 'Sent 2', text: 'Sent 2' },
    { key: 'Sent 3', value: 'Sent 3', text: 'Sent 3' },
    { key: 'Sent 4', value: 'Sent 4', text: 'Sent 4' },
]
const participantsOption = [
    {  key: 'Contact 1', value: 'Contact 1', text: 'Contact 1'  },
    {  key: 'Contact 2', value: 'Contact 2',  text: 'Contact 2' },
    {  key: 'Contact 3', value: 'Contact 3',  text: 'Contact 3' },
    {  key: 'Contact 4', value: 'Contact 4',  text: 'Contact 4' },
    {  key: 'Contact 5', value: 'Contact 5',  text: 'Contact 5' },
    {  key: 'Contact 6', value: 'Contact 6',  text: 'Contact 6' },
    {  key: 'Contact 7', value: 'Contact 7',  text: 'Contact 7' },
    {  key: 'Contact 8', value: 'Contact 8',  text: 'Contact 8' },
    {  key: 'Contact 9', value: 'Contact 9',  text: 'Contact 9' },
    {  key: 'Contact 10', value: 'Contact 10',  text: 'Contact 10' },
    {  key: 'Contact 11', value: 'Contact 11',  text: 'Contact 11' },
    {  key: 'Contact 12', value: 'Contact 12',  text: 'Contact 12' },
    {  key: 'Contact 13', value: 'Contact 13',  text: 'Contact 13' },
    {  key: 'Contact 14', value: 'Contact 14',  text: 'Contact 14' },
]
const linkedCompanies = [
    {  key: 'Company 1', value: 'Company 1', text: 'Company 1'  },
    {  key: 'Company 2', value: 'Company 2',  text: 'Company 2' },
    {  key: 'Company 3', value: 'Company 3',  text: 'Company 3' },
    {  key: 'Company 4', value: 'Company 4',  text: 'Company 4' },
    {  key: 'Company 5', value: 'Company 5',  text: 'Company 5' },
    {  key: 'Company 6', value: 'Company 6',  text: 'Company 6' },
    {  key: 'Company 7', value: 'Company 7',  text: 'Company 7' },
    {  key: 'Company 8', value: 'Company 8',  text: 'Company 8' },
    {  key: 'Company 9', value: 'Company 9',  text: 'Company 9' },
    {  key: 'Company 10', value: 'Company 10',  text: 'Company 10' },
    {  key: 'Company 11', value: 'Company 11',  text: 'Company 11' },
    {  key: 'Company 12', value: 'Company 12',  text: 'Company 12' },
    {  key: 'Company 13', value: 'Company 13',  text: 'Company 13' },
    {  key: 'Company 14', value: 'Company 14',  text: 'Company 14' },
]
const linkedDeals = [
    {  key: 'Deal 1', value: 'Deal 1', text: 'Deal 1'  },
    {  key: 'Deal 2', value: 'Deal 2',  text: 'Deal 2' },
    {  key: 'Deal 3', value: 'Deal 3',  text: 'Deal 3' },
    {  key: 'Deal 4', value: 'Deal 4',  text: 'Deal 4' },
    {  key: 'Deal 5', value: 'Deal 5',  text: 'Deal 5' },
    {  key: 'Deal 6', value: 'Deal 6',  text: 'Deal 6' },
    {  key: 'Deal 7', value: 'Deal 7',  text: 'Deal 7' },
    {  key: 'Deal 8', value: 'Deal 8',  text: 'Deal 8' },
    {  key: 'Deal 9', value: 'Deal 9',  text: 'Deal 9' },
    {  key: 'Deal 10', value: 'Deal 10',  text: 'Deal 10' },
    {  key: 'Deal 11', value: 'Deal 11',  text: 'Deal 11' },
    {  key: 'Deal 12', value: 'Deal 12',  text: 'Deal 12' },
    {  key: 'Deal 13', value: 'Deal 13',  text: 'Deal 13' },
    {  key: 'Deal 14', value: 'Deal 14',  text: 'Deal 14' },
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
                    color: ${Colors.grey};
                    font-size: 12px;
                }
            }
        }
        
    }  
    
`;
const SaprateColumn = styled.div`
    padding: 10px 15px;
    margin: 15px 0;
    border: 1px solid ${Colors.bordercolor};
    border-radius: 10px; 
    .column{
        &.wide {
            padding-bottom: 0!important;
            margin-bottom: 15px;
            padding-top: 0 !important;
            &.captionCol{
                padding-top: 1rem !important;
                padding-bottom: 12px !important;
            }
        }        
    } 
    .captionCol{
        border-bottom: 1px solid ${Colors.bordercolor};
        .header{
            font-size: 16px;
            font-family: 'euclid_circular_abold';
            color: ${Colors.darkblue};
            margin-top: 0 !important;
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


const AdvanceFilterEmail = (props : any) => {    
    const [startDate, setStartDate] = useState(new Date());
    console.log("Startdate",startDate);

    return (
        
        <>  
                
                      
                <FormWrapper>
                        <Grid columns={2}>  
                            <GridColumn width={16}>
                                <Search className="normalFont" placeholder='Search Email' input={{ icon: 'search', iconPosition: 'left' }}/>
                            </GridColumn>  
                                                     
                        </Grid>
                        <SaprateColumn>
                            <Grid columns={2}>
                                <GridColumn width={16} className="captionCol">
                                    <Header size='small'>General filters</Header>
                                </GridColumn>                               
                                
                                <GridColumn width={8} className="fullWidth">
                                    <label>Date from</label>
                                    <CalendarWrap>
                                        <DatePicker onChange={(date) => setStartDate(date as any)} selected={startDate} placeholderText="Date" />
                                        <CalendarImg src={Icons.CalendarImage}></CalendarImg>
                                    </CalendarWrap> 
                                </GridColumn>
                                <GridColumn width={8} className="fullWidth">
                                    <label>Date till</label> 
                                    <CalendarWrap>
                                        <DatePicker onChange={(date) => setStartDate(date as any)} selected={startDate} placeholderText="Date" />
                                        <CalendarImg src={Icons.CalendarImage}></CalendarImg>
                                    </CalendarWrap> 
                                </GridColumn> 
                                <GridColumn width={16}>
                                    <label>Type</label>
                                    <Dropdown fluid selection options={status} placeholder='Sent'  />
                                </GridColumn>                                                                 
                            </Grid>     
                        </SaprateColumn>  

                        <SaprateColumn>
                            <Grid columns={2}>
                                <GridColumn width={16} className="captionCol">
                                    <Header size='small'>Links</Header>
                                </GridColumn>
                                <GridColumn width={16}>
                                    <label>Team participants</label>
                                    <Dropdown className="multiSelect" fluid multiple  selection  options={rmOption}/>
                                </GridColumn> 

                                <GridColumn width={16}>
                                    <label>Linked contacts</label>
                                    <Dropdown fluid selection multiple options={participantsOption} className="multiSelect chooseMultiOption" />
                                </GridColumn> 
                                <GridColumn width={16}>
                                    <label>Linked companies</label>
                                    <Dropdown fluid selection multiple options={linkedCompanies} className="multiSelect chooseMultiOption" />
                                </GridColumn> 
                                <GridColumn width={16}>
                                    <label>Linked deals</label>
                                    <Dropdown fluid selection multiple options={linkedDeals} className="multiSelect chooseMultiOption" />
                                </GridColumn>
                            </Grid>      
                        </SaprateColumn> 

                        <FieldRow className="actionBtn">
                            <CommonFillBtn onClick={props.close}>Apply</CommonFillBtn>
                        </FieldRow>
                </FormWrapper>
                    
                
                   
            </>
        );
    };
    
    export default AdvanceFilterEmail;