import styled from "styled-components";
import {  Grid, GridColumn } from "semantic-ui-react";



import Colors from "../../../util/Colors";


const CreateViewWrapper = styled.div`
    padding: 20px;
    margin: 10px 0;
    height: 100%;
    overflow-y: auto;
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
    input,textarea{
        width: 100%;  
        padding: 12px 15px;
        border-radius: 10px;
        border: 1px solid ${Colors.bordercolor};
        font-family: 'euclid_circular_abold';
        &:focus-visible{
            outline:none;            
        }
    }
    textarea{
        min-height:80px;
        resize:none;
    }
      
    &.actionBtn{
        display: flex;
        justify-content: flex-end;
        grid-gap: 15px; 
        margin-bottom: 0px;
    }   
    .dropdown{
        padding: 14px 15px !important;
        border-radius: 8px !important;
        background-color: ${Colors.basecolor} !important; 
        &.icon {
            font-size: 18px !important;
            padding: 10px !important;
        } 
    } 
    &.formWrapper{
        min-height: 240px;
        max-height: 240px;
        overflow-y: auto;
        overflow-x: hidden;
        margin-bottom: 0px;
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
    flex: 1;
    
    &:hover{
        background-color: ${Colors.blue}; 
        color: ${Colors.white};
    }
`;


const CompanyCommittee  = (props : any) => { 
    
    
    return (
            <>
               
            <CreateViewWrapper>
                <ModalContent>
                    <FieldRow className="formWrapper">
                        <Grid>
                            <GridColumn width={16}>
                                <p>Committee name</p>
                                <input type="text" placeholder="Strategy board"></input>
                            </GridColumn> 
                            <GridColumn width={16}>
                                <p>Notes</p>
                                <textarea></textarea>
                            </GridColumn>
                        </Grid>                        
                    </FieldRow>                    

                    <FieldRow className="actionBtn">
                        <CommonFillBtn onClick={props.close}>Add new committee</CommonFillBtn>
                    </FieldRow>
                </ModalContent>
            </CreateViewWrapper>               
                
                   
            </>
        );
    };
    
    export default CompanyCommittee;