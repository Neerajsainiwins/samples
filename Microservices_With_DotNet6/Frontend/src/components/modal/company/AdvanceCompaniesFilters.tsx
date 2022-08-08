import React, { useState } from "react";
import styled from "styled-components";
import { Grid, GridColumn, Search, Header, Dropdown } from "semantic-ui-react";

import Colors from "../../../util/Colors";
import ProfileImage from "../../../assets/svg/Profile.jpg";
import "react-datepicker/dist/react-datepicker.css";

const rmOption = [
  {
    key: "Jenny Hess",
    text: "Jenny Hess",
    value: "Jenny Hess",
    image: { avatar: true, src: ProfileImage },
  },
  {
    key: "Elliot Fu",
    text: "Elliot Fu",
    value: "Elliot Fu",
    image: { avatar: true, src: ProfileImage },
  },
  {
    key: "Stevie Feliciano",
    text: "Stevie Feliciano",
    value: "Stevie Feliciano",
    image: { avatar: true, src: ProfileImage },
  },
  {
    key: "Christian",
    text: "Christian",
    value: "Christian",
    image: { avatar: true, src: ProfileImage },
  },
  {
    key: "Matt",
    text: "Matt",
    value: "Matt",
    image: { avatar: true, src: ProfileImage },
  },
  {
    key: "Justen Kitsune",
    text: "Justen Kitsune",
    value: "Justen Kitsune",
    image: { avatar: true, src: ProfileImage },
  },
];
const type = [
  {
    key: "External advisor",
    value: "External advisor",
    text: "External advisor",
  },
  {
    key: "External advisor 1",
    value: "External advisor 1",
    text: "External advisor 1",
  },
  {
    key: "External advisor 2",
    value: "External advisor 2",
    text: "External advisor 2",
  },
  {
    key: "External advisor 3",
    value: "External advisor 3",
    text: "External advisor 3",
  },
  {
    key: "External advisor 4",
    value: "External advisor 4",
    text: "External advisor 4",
  },
];
const subType = [
  { key: "Lawyer", value: "Lawyer", text: "Lawyer" },
  { key: "Lawyer 1", value: "Lawyer 1", text: "Lawyer 1" },
  { key: "Lawyer 2", value: "Lawyer 2", text: "Lawyer 2" },
  { key: "Lawyer 3", value: "Lawyer 3", text: "Lawyer 3" },
  { key: "Lawyer 4", value: "Lawyer 4", text: "Lawyer 4" },
];
const contactOption = [
  { key: "Contact 1", value: "Contact 1", text: "Contact 1" },
  { key: "Contact 2", value: "Contact 2", text: "Contact 2" },
];
const businessCountry = [
  { key: "France", value: "France", text: "France" },
  { key: "USA", value: "USA", text: "USA" },
  { key: "China", value: "China", text: "China" },
  { key: "Japan", value: "Japan", text: "Japan" },
];
const cityOption = [
  { key: "Paris", value: "Paris", text: "Paris" },
  { key: "Lyon", value: "Lyon", text: "Lyon" },
];
const dealSrage = [
  { key: "Preliminary", value: "Preliminary", text: "Preliminary" },
  {
    key: "Letter of intent",
    value: "Letter of intent",
    text: "Letter of intent",
  },
];
const dealAssociated = [
  { key: "Venga", value: "Venga", text: "Venga" },
  { key: "Venga 1", value: "Venga 1", text: "Venga 1" },
];
const FieldRow = styled.div`
  margin: 25px 0 0;
  &.actionBtn {
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
  font-family: "euclid_circular_abold";
  border: 1px solid ${Colors.blue};
  min-width: 160px;
  border-radius: 10px;
  cursor: pointer;
  &:hover {
    background-color: ${Colors.blue};
    color: ${Colors.white};
  }
  @media (max-width: 767px) {
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
const SaprateColumn = styled.div`
  padding: 10px 15px;
  margin: 15px 0;
  border: 1px solid ${Colors.bordercolor};
  border-radius: 10px;
  .column {
    &.wide {
      padding-bottom: 0 !important;
      margin-bottom: 15px;
      padding-top: 0 !important;
      &.captionCol {
        padding-top: 1rem !important;
        padding-bottom: 12px !important;
      }
    }
  }
  .captionCol {
    border-bottom: 1px solid ${Colors.bordercolor};
    .header {
      font-size: 16px;
      font-family: "euclid_circular_abold";
      color: ${Colors.darkblue};
      margin-top: 0 !important;
    }
  }
`;

const AdvanceCompaniesFilters = (props: any) => {
  return (
    <>
      <FormWrapper>
        <Grid columns={2}>
          <GridColumn width={16}>
            <Search
              className="normalFont"
              placeholder="Search document"
              input={{ icon: "search", iconPosition: "left" }}
            />
          </GridColumn>
        </Grid>
        <SaprateColumn>
          <Grid columns={2}>
            <GridColumn width={16} className="captionCol">
              <Header size="small">General filters</Header>
            </GridColumn>
            <GridColumn width={8} className="fullWidth">
              <label>Type</label>
              <Dropdown
                fluid
                selection
                options={type}
                placeholder="Select Type"
              />
            </GridColumn>
            <GridColumn width={8} className="fullWidth">
              <label>Sub Type</label>
              <Dropdown
                fluid
                selection
                options={subType}
                placeholder="Select Subtype"
              />
            </GridColumn>
            <GridColumn width={8} className="fullWidth notSelected">
              <label>Position</label>
              <Dropdown
                fluid
                selection
                options={type}
                placeholder="Not selected"
              />
            </GridColumn>

            <GridColumn width={8} className="fullWidth notSelected">
              <label>Department</label>
              <Dropdown
                fluid
                selection
                options={type}
                placeholder="Not selected"
              />
            </GridColumn>
          </Grid>
        </SaprateColumn>

        <SaprateColumn>
          <Grid columns={2}>
            <GridColumn width={16} className="captionCol">
              <Header size="small">People</Header>
            </GridColumn>
            <GridColumn width={16}>
              <label>RM</label>
              <Dropdown
                className="multiSelect"
                fluid
                multiple
                selection
                options={rmOption}
              />
            </GridColumn>
            <GridColumn width={16} className="fullWidth">
              <label>Management</label>
              <Dropdown
                fluid
                selection
                multiple
                options={contactOption}
                className="multiSelect chooseMultiOption"
              />
            </GridColumn>
            <GridColumn width={16} className="fullWidth">
              <label>Board members</label>
              <Dropdown
                fluid
                selection
                multiple
                options={contactOption}
                className="multiSelect chooseMultiOption"
              />
            </GridColumn>
          </Grid>
        </SaprateColumn>

        <SaprateColumn>
          <Grid columns={2}>
            <GridColumn width={16} className="captionCol">
              <Header size="small">Geography</Header>
            </GridColumn>
            <GridColumn width={8} className="fullWidth">
              <label>Country</label>
              <Dropdown
                fluid
                selection
                multiple
                options={businessCountry}
                className="multiSelect chooseMultiOption"
              />
            </GridColumn>
            <GridColumn width={8} className="fullWidth">
              <label>City</label>
              <Dropdown
                fluid
                selection
                multiple
                options={cityOption}
                className="multiSelect chooseMultiOption"
              />
            </GridColumn>
          </Grid>
        </SaprateColumn>

        <SaprateColumn>
          <Grid columns={2}>
            <GridColumn width={16} className="captionCol">
              <Header size="small">Deals</Header>
            </GridColumn>
            <GridColumn width={8} className="fullWidth">
              <label>Deal stages</label>
              <Dropdown
                fluid
                selection
                multiple
                options={dealSrage}
                className="multiSelect chooseMultiOption"
              />
            </GridColumn>
            <GridColumn width={8} className="fullWidth">
              <label>Deal associated</label>
              <Dropdown
                fluid
                selection
                multiple
                options={dealAssociated}
                className="multiSelect chooseMultiOption"
              />
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

export default AdvanceCompaniesFilters;
