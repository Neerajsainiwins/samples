import styled from "styled-components";
import { Grid, GridColumn } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";

import Icon from "../components/elements/Icon";
import { IconEnum as Icons } from "../components/elements/Icons";
import colors from "../util/Colors";
import UserThumb from "../assets/svg/user-thumb.png";
import ProfileIMage from "../assets/svg/Profile.jpg";
import routePaths from "../config/routepaths.config";
import CustomButton from "../components/Loader/CustomButton";

//#region  styled css

const PaegTitleWrapper = styled.div`
  background-color: ${colors.white};
  padding: 25px 20px 0;
  display: flex;
  align-items: flex-start;
  border-radius: 10px 10px 0 0;
  flex-direction: column;
  justify-content: center;
  @media screen and (max-width: 767px) {
    border-radius: 0px;
    padding: 20px 20px 0;
  }
`;
const PageTille = styled.h1`
  margin: 0;
  display: flex;
  align-items: center;
  font-family: "euclid_circular_asemibold";
  font-size: 32px;
  @media (max-width: 767px) {
    font-size: 18px !important;
  }
  svg {
    margin-right: 15px;
  }
`;
const GridWrapper = styled.div`
  background-color: ${colors.white};
  margin-top: 20px;
  padding: 20px;
  border-radius: 10px;
  @media screen and (max-width: 767px) {
    margin-top: 0px;
    border-radius: 0px;
    padding: 10px 20px 20px;
  }
`;
const TabOuterWrapper = styled.div`
  padding: 20px;
  background-color: ${colors.white};
  border-radius: 0;
  @media screen and (max-width: 767px) {
    padding: 15px 0 10px;
    border-radius: 0;
    width: 100%;
    overflow-x: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;
const TabWrapper = styled.div`
  display: flex;
  width: 100%;
  border: 1px solid ${colors.darkblue};
  border-radius: 10px;
  overflow: hidden;
  @media screen and (max-width: 767px) {
    margin-left: 20px;
    margin-right: 20px;
    min-width: 450px;
  }
`;
const TabButton = styled.button`
  margin: 0;
  width: 100%;
  border-radius: 0;
  border: none;
  background-color: ${colors.white};
  padding: 15px 10px;
  border-right: 1px solid ${colors.darkblue};
  font-family: "euclid_circular_aregular";
  cursor: pointer;
  font-size: 18px;
  @media screen and (max-width: 767px) {
    font-size: 14px;
  }
  &.removeBorder {
    border-right: 1px solid transparent;
  }
  &.active,
  &:hover {
    background-color: ${colors.darkblue};
    color: ${colors.white};
    font-family: "euclid_circular_abold";
  }
`;
const EditProfileWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: 0;
  background-color: ${colors.white};
  padding: 0px 20px 20px;
  border-radius: 0 0 10px 10px;
  @media screen and (max-width: 767px) {
    padding: 10px 20px;
    border-radius: 0;
    width: 100%;
    overflow-x: auto;
  }
`;
const UserImage = styled.div`
  width: 98px;
  height: 98px;
  border-radius: 50%;
  overflow: hidden;
  float: right;
  @media screen and (max-width: 767px) {
    width: 56px;
    height: 56px;
  }
  img {
    width: 98px;
    height: 98px;
    object-fit: cover;
    @media screen and (max-width: 767px) {
      width: 56px;
      height: 56px;
    }
  }
`;
const BorderWrapper = styled.div`
  margin: 15px 0;
  border: 1px solid ${colors.bordercolor};
  padding: 25px 15px 15px;
  border-radius: 10px;
  @media screen and (max-width: 767px) {
    padding: 15px 0 15px;
  }

  .grid {
    max-width: 70vw;
    @media screen and (max-width: 767px) {
      max-width: 100%;
      margin: 0;
    }
    &.highLabelWrap {
      max-width: 100%;
    }
  }

  h2 {
    font-size: 25px;
    color: ${colors.darkblue};
    font-family: "euclid_circular_abold";
    text-align: left;
    @media screen and (max-width: 767px) {
      font-size: 16px;
    }
  }
  label {
    font-size: 14px;
    font-family: "euclid_circular_aregular";
    color: ${colors.grey};
    margin-bottom: 6px;
    display: flex;
  }
  h4 {
    font-size: 18px;
    color: ${colors.black};
    font-family: "euclid_circular_aregular";
    margin: 0;
    text-align: left;
    @media screen and (max-width: 767px) {
      font-size: 14px;
    }
    .companyName {
      color: ${colors.blue1};
      background-color: ${colors.exlightblue};
      padding: 4px 10px;
      border-radius: 50px;
    }
    img {
      margin-right: 8px;
    }
  }
  h5 {
    font-size: 18px;
    color: ${colors.black};
    font-family: "euclid_circular_aMdIt";
    margin: 0;
    max-width: 70%;
    text-align: left;
    letter-spacing: 0.7px;
    @media screen and (max-width: 767px) {
      font-size: 14px;
    }
  }
`;
const TagWrap = styled.div`
  display: flex;
  grid-gap: 10px;
  span {
    font-size: 9px;
    font-family: "euclid_circular_aregular";
    color: ${colors.black};
    background-color: ${colors.bordercolor};
    padding: 1px 10px;
    border-radius: 5px;
    min-height: 20px;
  }
`;
const UserImages = styled.div`
  width: 34px;
  height: 34px;
  overflow: hidden;
  border-radius: 50%;
  object-fit: cover;
  &.overalpImage {
    margin-left: -13px;
    position: relative;
    z-index: 9;
    border: 1px solid ${colors.white};
  }
  img {
    width: 34px;
    height: 34px;
    object-fit: cover;
  }
`;
const UserImageWrapper = styled.div`
  display: flex;
  align-items: center;
  .userImage {
    width: 34px;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${colors.basecolor};
    border-radius: 50%;
    margin-left: -13px;
    position: relative;
    z-index: 99;
    color: ${colors.black};
    font-size: 14px;
    font-family: "euclid_circular_aregular";
  }
`;
//#endregion

const UserPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <PaegTitleWrapper>
        <PageTille>
          <Icon
            className="link"
            onClick={() => navigate(routePaths.CONTACT)}
            icon={Icons.Back}
          />{" "}
          David Mrejen
        </PageTille>
      </PaegTitleWrapper>
      <div className="stickyTab">
        <TabOuterWrapper>
          <TabWrapper>
            <TabButton
              className="active"
              onClick={() => navigate(routePaths.USER)}
            >
              General
            </TabButton>
            <TabButton onClick={() => navigate(routePaths.MANAGEMENTTEAM)}>
              Positions
            </TabButton>
            <TabButton onClick={() => navigate(routePaths.MEETINGSCALENDAER)}>
              Actions
            </TabButton>
            <TabButton
              onClick={() => navigate(routePaths.DOCUMENTS)}
              className="removeBorder"
            >
              Documents
            </TabButton>
          </TabWrapper>
        </TabOuterWrapper>
        <EditProfileWrap>
          <CustomButton onClick={()=> navigate(routePaths.USEREDIT)} icon={Icons.Edit}  buttonText="Edit Info" />
        </EditProfileWrap>
      </div>
      

      <GridWrapper className="TabEditButtonContent">
        <BorderWrapper>
          <Grid columns={2} className="highLabelWrap">
            <GridColumn width={12}>
              <h2>High level</h2>
            </GridColumn>
            <GridColumn width={4} textAlign="right">
              <UserImage>
                <img src={UserThumb} alt=""></img>
              </UserImage>
            </GridColumn>
          </Grid>
          <Grid columns={2} className="fullWidth">
            <GridColumn width={7} className="fullWidth">
              <label>Title</label>
              <h4>Manager</h4>
            </GridColumn>
            <GridColumn width={2} className="emptyCol"></GridColumn>
            <GridColumn width={7} className="fullWidth">
              <label>Last name</label>
              <h4>Mutawakkil</h4>
            </GridColumn>
            <GridColumn width={7} className="fullWidth">
              <label>Firts name</label>
              <h4>Akil</h4>
            </GridColumn>
            <GridColumn width={2} className="emptyCol"></GridColumn>
            <GridColumn width={7} className="fullWidth">
              <label>Middle name</label>
              <h4>Mutawakkil</h4>
            </GridColumn>
            <GridColumn width={7} className="fullWidth">
              <label>Type</label>
              <TagWrap>
                <span>Type 1</span>
                <span>Type 2</span>
                <span>Type 3</span>
              </TagWrap>
            </GridColumn>
            <GridColumn width={2} className="emptyCol"></GridColumn>
            <GridColumn width={7} className="fullWidth">
              <label>Team knowledge</label>
              <UserImageWrapper>
                <UserImages>
                  <img src={ProfileIMage} alt=""></img>
                </UserImages>
                <UserImages className="overalpImage">
                  <img src={ProfileIMage} alt=""></img>
                </UserImages>
                <UserImages className="overalpImage">
                  <img src={ProfileIMage} alt=""></img>
                </UserImages>
                <span className="userImage">+5</span>
              </UserImageWrapper>
            </GridColumn>
            <GridColumn width={7} className="fullWidth">
              <label>Notes</label>
              <h5>
                Augue dignissim lacus turpis nunc. Move forqard Augue dignissim
                lacus turpis nunc. Move forqard{" "}
              </h5>
            </GridColumn>
            <GridColumn width={2} className="emptyCol"></GridColumn>
            <GridColumn width={7} className="fullWidth">
              <label>Tags</label>
              <TagWrap>
                <span>Tag 1</span>
                <span>Tag 2</span>
                <span>Tag 3</span>
              </TagWrap>
            </GridColumn>
          </Grid>
        </BorderWrapper>
        <BorderWrapper>
          <Grid columns={2} className="fullWidth">
            <GridColumn width={16}>
              <h2>Company info</h2>
            </GridColumn>

            <GridColumn width={7} className="fullWidth">
              <label>Company</label>
              <h4>
                <span className="companyName">Apple</span>
              </h4>
            </GridColumn>
            <GridColumn width={2} className="emptyCol"></GridColumn>
            <GridColumn width={7} className="fullWidth">
              <label>Company type</label>
              <h4>Limited partner</h4>
            </GridColumn>
            <GridColumn width={7} className="fullWidth">
              <label>Country</label>
              <h4>
                <img src={Icons.FlagIcon} alt=""></img> USA
              </h4>
            </GridColumn>
            <GridColumn width={2} className="emptyCol"></GridColumn>
            <GridColumn width={7} className="fullWidth">
              <label>Address</label>
              <h4>5555 Park Avenue</h4>
            </GridColumn>
            <GridColumn width={7} className="fullWidth">
              <label>ZIP code</label>
              <h4>90210</h4>
            </GridColumn>
            <GridColumn width={2} className="emptyCol"></GridColumn>
            <GridColumn width={7} className="fullWidth">
              <label>City</label>
              <h4>New york</h4>
            </GridColumn>
            <GridColumn width={7} className="fullWidth">
              <label>State</label>
              <h4>NY</h4>
            </GridColumn>
            <GridColumn width={2} className="emptyCol"></GridColumn>
            <GridColumn width={7} className="fullWidth">
              <label>Company main line</label>
              <h4>+210 91020 02818</h4>
            </GridColumn>
          </Grid>
        </BorderWrapper>
        <BorderWrapper>
          <Grid columns={2} className="fullWidth">
            <GridColumn width={16}>
              <h2>Contact business info</h2>
            </GridColumn>

            <GridColumn width={7} className="fullWidth">
              <label>Business email</label>
              <h4>Davidmrejen@gmail.com</h4>
            </GridColumn>
            <GridColumn width={2} className="emptyCol"></GridColumn>
            <GridColumn width={7} className="fullWidth">
              <label>Direct line</label>
              <h4>+210 91020 02818</h4>
            </GridColumn>
            <GridColumn width={7} className="fullWidth">
              <label>Mobile</label>
              <h4>+1290 920 9210</h4>
            </GridColumn>
            <GridColumn width={2} className="emptyCol"></GridColumn>
            <GridColumn width={7} className="fullWidth">
              <label>2nd mobile</label>
              <h4>+210 91020 02818</h4>
            </GridColumn>
          </Grid>
        </BorderWrapper>
        <BorderWrapper>
          <Grid columns={2} className="fullWidth">
            <GridColumn width={16}>
              <h2>Personal</h2>
            </GridColumn>

            <GridColumn width={7} className="fullWidth">
              <label>Country</label>
              <h4>America</h4>
            </GridColumn>
            <GridColumn width={2} className="emptyCol"></GridColumn>
            <GridColumn width={7} className="fullWidth">
              <label>Address</label>
              <h4>1212 Sixth Avenue</h4>
            </GridColumn>
            <GridColumn width={7} className="fullWidth">
              <label>ZIP code</label>
              <h4>10210</h4>
            </GridColumn>
            <GridColumn width={2} className="emptyCol"></GridColumn>
            <GridColumn width={7} className="fullWidth">
              <label>City</label>
              <h4>Vancouver</h4>
            </GridColumn>
            <GridColumn width={7} className="fullWidth">
              <label>Personal mobile 1</label>
              <h4>+210 91020 02818</h4>
            </GridColumn>
            <GridColumn width={2} className="emptyCol"></GridColumn>
            <GridColumn width={7} className="fullWidth">
              <label>Personal mobile 2</label>
              <h4>+210 91020 02818</h4>
            </GridColumn>
            <GridColumn width={7} className="fullWidth">
              <label>Personal mobile 2</label>
              <h4>+210 91020 02818</h4>
            </GridColumn>
            <GridColumn width={2} className="emptyCol"></GridColumn>
            <GridColumn width={7} className="fullWidth">
              <label>Personal email</label>
              <h4>apple@gmail.com</h4>
            </GridColumn>
            <GridColumn width={7} className="fullWidth">
              <label>Linkedin</label>
              <h4>Linkedin</h4>
            </GridColumn>
            <GridColumn width={2} className="emptyCol"></GridColumn>
            <GridColumn width={7} className="fullWidth">
              <label>Date of birth</label>
              <h4>12/20/2020</h4>
            </GridColumn>
          </Grid>
        </BorderWrapper>
      </GridWrapper>
    </>
  );
};

export default UserPage;
