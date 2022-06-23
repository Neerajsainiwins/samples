import styled from "styled-components";
import {  Grid, GridColumn } from "semantic-ui-react";


import Colors from "../../util/Colors";



//#region  styled css

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
//#endregion
 

const AddNewContact  = (props : any) => { 
    
    
    return (
            <>
               
            <CreateViewWrapper>
                <ModalContent>
                    <FieldRow className="formWrapper">
                        <Grid>
                            <GridColumn width={8}>
                                <p>Contact first name</p>
                                <input type="text" placeholder="David"></input>
                            </GridColumn>
                            <GridColumn width={8}>
                                <p>Contact last name</p>
                                <input type="text" placeholder="Mrejen"></input>
                            </GridColumn>
                        </Grid>                        
                    </FieldRow>                   

                    <FieldRow className="actionBtn">
                        <CommonFillBtn onClick={props.close}>Add new contact</CommonFillBtn>
                    </FieldRow>
                </ModalContent>
            </CreateViewWrapper>               
                
                   
            </>
        );
    };
    
    export default AddNewContact;