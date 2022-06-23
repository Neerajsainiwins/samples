import styled from "styled-components";
import { Grid, GridColumn,  Header,  Input } from "semantic-ui-react";



import Colors from "../../../util/Colors";
import CloseIcon from '../../../assets/svg/close-btn.svg';
import "react-datepicker/dist/react-datepicker.css";


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
const ScrollList = styled.ul`
    padding: 0;
    margin: 0;
    list-style: none;
    border: 1px solid ${Colors.bordercolor};
    border-radius: 10px;
    max-height: 207px;
    overflow-y: auto;
    li{
        padding: 10px;
        border-bottom: 1px solid ${Colors.bordercolor};
        &:last-child {
            border-bottom: none;
        }
    }
`;
const SaprateColumn = styled.div`
    padding: 10px 15px;
    margin: 15px 0;
    border: 1px solid ${Colors.bordercolor};
    border-radius: 10px; 
    display: flex;
    grid-gap: 10px;
    flex-flow: wrap;   
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
    &.minHeight{
        min-height:200px;
    }
    
`;
const CalculatorGrid = styled.ul`
    grid-template-columns: repeat(9, 1fr);
    margin: 15px auto;
    display: grid;
    grid-gap: 1px;
    justify-content: flex-start;
    align-items: center;
    text-align: center;
    padding: 0;
    list-style: none;
    overflow-y: auto;
    width: 100%;
    cursor: pointer;
    li{
        color: ${Colors.white};
        background-color: ${Colors.blue};
        font-size: 16px;
        line-height: 26px;
        padding: 10px 5px;
        min-width: 40px;
        text-align: center;
        justify-content: center;
        &.characterField {
            font-size: 12px;
        }
    }
`;
const UploadFileDetail = styled.div`
    background-color: ${Colors.basecolor};
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 10px;
    border-radius: 8px;
    font-family: 'euclid_circular_abold';
    color: ${Colors.darkblue};
    margin-bottom: 10px;
    max-height: 40px;
    p{
        margin: 0;
        color: ${Colors.black};
        margin-right: 10px;
        span{
            color: ${Colors.grey};
        }        
    }
`;
const AddRemoveIcon = styled.div`
    color: ${Colors.darkblue};
    background-color: ${Colors.skyblue};
    padding: 1px 10px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    line-height: 30px;
    height: 40px;
    min-width: 60px;
`;

//#endregion

const CalculationCreationAvanahCapital = (props : any) => {

     
    
    return (
        
        <>  
                <FormWrapper>
                        <Grid columns={2}> 
                            <GridColumn width={16} className="fullWidth">
                                <label>Column name</label>
                                <Input fluid type="text" placeholder="Investment"/>
                            </GridColumn>                                             
                        </Grid> 
                        <SaprateColumn>
                            <Grid columns={2}>
                                <GridColumn width={16} className="captionCol">
                                    <Header size='small'>Calculated value</Header>
                                </GridColumn>
                                <GridColumn width={16}>
                                    <ScrollList>
                                        <li>Investment</li>
                                        <li>Capital increase</li>
                                        <li>Bond subscription</li>
                                        <li>Acquisition fees</li>
                                        <li>Monitoring fees</li>
                                        <li>Investment</li>
                                        <li>Capital increase</li>
                                        <li>Bond subscription</li>
                                        <li>Acquisition fees</li>
                                        <li>Monitoring fees</li>
                                        <li>Investment</li>
                                        <li>Capital increase</li>
                                        <li>Bond subscription</li>
                                        <li>Acquisition fees</li>
                                        <li>Monitoring fees</li>
                                        <li>Investment</li>
                                        <li>Capital increase</li>
                                        <li>Bond subscription</li>
                                        <li>Acquisition fees</li>
                                        <li>Monitoring fees</li>
                                        
                                    </ScrollList>
                                </GridColumn>

                                <GridColumn width={16}>
                                    <CalculatorGrid>
                                        <li>&#43;</li>
                                        <li>&#45;</li>
                                        <li>&#215;</li>
                                        <li>&#247;</li>
                                        <li>&#94;</li>
                                        <li>&#61;</li>
                                        <li>&#60;</li>
                                        <li>&#62;</li>
                                        <li>&le; </li>


                                        <li>&ge;</li>
                                        <li>&#61; &#61;</li>
                                        <li>&#33;&#61;</li>
                                        <li className="characterField">OR</li>
                                        <li className="characterField">AND</li>
                                        <li className="characterField">IF</li>
                                        <li className="characterField">ABS</li>
                                        <li className="characterField">MIN</li>
                                        <li className="characterField">MAX</li>
                                    </CalculatorGrid>
                                </GridColumn>
                                <GridColumn width={16}>
                                    <SaprateColumn className="minHeight"> 
                                        <UploadFileDetail className="borderField">
                                            <p>Investment</p> 
                                            <img src={CloseIcon} alt=""></img>
                                        </UploadFileDetail>
                                        <AddRemoveIcon>&#43;</AddRemoveIcon>
                                        <UploadFileDetail className="borderField">
                                            <p>Capital increase</p> 
                                            <img src={CloseIcon} alt=""></img>
                                        </UploadFileDetail>
                                        <AddRemoveIcon>&#45;</AddRemoveIcon>
                                        <UploadFileDetail className="borderField">
                                            <p>Monitoring fees</p> 
                                            <img src={CloseIcon} alt=""></img>
                                        </UploadFileDetail>
                                    </SaprateColumn> 
                                </GridColumn>
                            </Grid> 
                              
                        </SaprateColumn>
                        <FieldRow className="actionBtn">   
                            <CommonFillBtn onClick={props.close}>Create</CommonFillBtn>    
                        </FieldRow>   
                </FormWrapper>     
                   
            </>
        );
    }; 
    
    export default CalculationCreationAvanahCapital;     