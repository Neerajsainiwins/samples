import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {   GridColumn } from "semantic-ui-react";
import { useState } from "react";

import Icon from "../../components/elements/Icon";
import { IconEnum as Icons } from "../../components/elements/Icons";
import colors from '../../util/Colors';
import routePaths from "../../config/routepaths.config";
import SearchBar from "../../components/SearchBar";
// import CheckBox from "../../components/CheckBox";
// import CustomButton from "../../components/Loader/CustomButton";
import PageTilleBack from "../../components/PageTitleBack";
import BaseModal, { ModalList } from "../../components/modal/BaseModal";
 
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

const GridWrapper = styled.div`
    background-color: ${colors.white};
    margin-top: 20px;
    padding: 20px;
    border-radius: 10px;
    @media screen and (max-width: 767px) {
        margin-top: 0;
        border-radius: 0px;
    }
`;
const TabOuterWrapper = styled.div`
    padding:20px;
    background-color: ${colors.white};
    border-radius: 0 0 10px 10px;
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
        min-width: 600px;
        white-space: nowrap;
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
    font-family: 'euclid_circular_aregular';
    cursor: pointer;
    font-size: 18px;
    @media screen and (max-width: 767px) {
        font-size: 14px;
    }
    &.removeBorder{
        border-right: 1px solid transparent; 
    }
    &.active,&:hover{
        background-color: ${colors.darkblue};
        color: ${colors.white};
        font-family: 'euclid_circular_abold';
    }
`;

const SubTabWrap = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%; 
    margin-top: 10px;   
    @media screen and (max-width: 991px) {
        align-items: initial;
        flex-direction: column;
    }
    @media screen and (max-width: 767px) {
        margin-left: 20px;
        margin-right: 20px;
        min-width: 600px;
        white-space: nowrap;
    }
`;
const ViewList = styled.div`
    display: flex;
    grid-gap: 30px;
    @media screen and (max-width: 991px) {
        white-space: nowrap;
        grid-gap: 20px;
        padding: 5px 0;
    }
    p{
        margin:0;
        color: ${colors.black2};
        font-size: 16px;
        font-family: 'euclid_circular_aregular';
        position:relative;
        padding: 5px 0;
        cursor: pointer;
        @media screen and (max-width: 991px) {
            font-size: 14px;
        }
        &.active,&:hover{
            color: ${colors.darkblue};
            font-family: 'euclid_circular_abold';
            &:before{
                position: absolute;
                content: "";
                background-color: ${colors.darkblue};
                height: 3px;
                width: 100%;
                left: 0;
                bottom: -2px;
            }
        } 
        
    }
`;
const ViewLink = styled.div`
    display: flex;
    min-width: 70px;
`;
const ViewWrapper = styled.div`
    display: flex;
    grid-gap: 15px;
    margin: 10px 0 5px;  
    -ms-overflow-style: none;  
    scrollbar-width: none; 
    &::-webkit-scrollbar {
        display: none;
    } 
    @media screen and (max-width: 767px) {
        overflow-x: auto;
    } 
`;
const AddCommittee = styled.div`
    display: flex;
    align-items: center;
    font-size: 16px;
    color: ${colors.black2};
    white-space: nowrap;
    cursor: pointer;
    @media screen and (max-width: 991px) { 
        font-size: 15px;
    }
    svg{
        color: ${colors.black} !important; 
        margin-right: 8px;
        font-size: 20px !important;
    }
    &:hover{
        color: ${colors.blue}; 
        svg{
            color: ${colors.blue} !important; 
        } 
    }
`;
const TableContent = styled.div`
    border-radius: 10px;
    // overflow: hidden;
    display: flex;
    width: 100%;
    margin-top: 10px;
    border: 1px solid ${colors.bordercolor};
    // overflow-y: auto;   
    // @media screen and (max-width: 991px){  
    //     display:none !important;
    // }
    @media screen and (max-width: 1024px) {
        overflow-x:auto;
        border: 1px solid ${colors.grey8};
    } 
    table{
        width: 100%;
        @media screen and (max-width: 767px) {
            border: 1px solid transparent;
            box-shadow: none;
        }
        thead{
            @media screen and (max-width: 767px) {
                display: none;
            } 
        }
        tbody{
            @media screen and (max-width: 767px) {
                tr{
                    border-bottom: 45px solid #F8F8F8;
                }
            } 
        }
        th{
            text-align:left;
            background-color: ${colors.blue};
            color: ${colors.white};
            padding: 15px; 
            font-size: 14px; 
            font-family: 'euclid_circular_abold';
            position: sticky; 
            top: 0;  
            z-index: 9;
            &:last-child{
                text-align:center; 
            }
            svg{
                color: ${colors.white} !important;  
                font-size: 15px !important;
            }
        }
        td{
            text-align:left;
            font-size: 14px;
            font-family: 'euclid_circular_aregular';
            padding: 15px;
            color: ${colors.black};
            @media screen and (max-width: 767px) {
                display: flex;
				text-align: right;
				font-size: 14px;
                box-shadow: 0 1px 1px ${colors.exlightblue};
                padding: 15px;
                align-items: center;
                font-family: 'euclid_circular_abold';
                justify-content: center;
            }
            &:last-child{
                text-align:center; 
                @media screen and (max-width: 767px) {
                    border-bottom: none;
                }
            }
            &:before{
                @media screen and (max-width: 767px) {
                    content: attr(data-label);
					float: left;
					font-size:13px;
					padding-right: 10px;
                    font-family: 'euclid_circular_aregular';
                    white-space: nowrap;
                    text-align: left;
                }
            }
            svg{
                color: ${colors.black} !important;  
                font-size: 15px !important;
                margin-right: 5px;
            }
            a{
                color: ${colors.black};  
                text-decoration: none;
                &:hover{
                    color: ${colors.blue};  
                }
            }
            .link{
                cursor: pointer;
                &:hover{
                    color: ${colors.darkblue};
                }
            }
            &.fixWidth{
                width: 64px;
                min-width: 64px;
                @media screen and (max-width: 767px) {
                    width: auto;
                    i{
                        text-align: right;
                    }
                }
            }
            .ellipseDropDown{
                i{
                    color: ${colors.shadegrey}; 
                }
                .menu {
                    left: auto;
                    right: 0;
                    border-radius: 8px;
                    min-width: 180px;
                    border: none;
                    box-shadow: 0 0px 8px rgba(34,36,38,10%);
                    overflow: hidden;
                    .item{
                        font-size:14px;
                        color: ${colors.black};
                        padding: 15px !important;
                        border-bottom: 1px solid ${colors.bordercolor};
                        font-family: 'euclid_circular_aregular';
                        i{
                            color: ${colors.grey};
                        }
                        &:hover {
                            background-color: ${colors.darkblue};
                            color: ${colors.white};
                            i{
                                color: ${colors.white};
                            }
                        }
                    }
                }
            }
        }
    }
`;
const SeacrhWrapper = styled.div`
    background-color: ${colors.white};
    align-items: center;
    justify-content: space-between;
    display: flex;
    grid-gap: 15px;
    width: 100%;
    align-items: flex-end;
    margin-bottom: 20px;
    @media screen and (max-width: 767px) {
        flex-direction: column;
    }
`;
 
const LeftCol = styled.div`
    display: flex;
    grid-gap: 15px;
    flex: 1;
    @media screen and (max-width: 767px) {
        width:100%;
    }
`;
const RightCol = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    grid-gap: 5px;
    span{
        font-size: 14px;
        color: ${colors.grey} ; 
        font-family: 'euclid_circular_aregular';
    }
    h6{
        font-size: 14px;
        margin:0;
        font-family: 'euclid_circular_abold';   
    }
    svg{
        font-size: 15px !important;
        color: ${colors.black} !important; 
        margin: 0 15px;
    }
`;



//#endregion

const BoardDirectors = () => {

    const navigate = useNavigate();
    const [CompanyCommitteeVisible, setCompanyCommitteeModalIsVisible] = useState(false);


return (


        <>
            <BaseModal
                    open={CompanyCommitteeVisible}
                    modalType={ModalList.CompanyCommittee}
                    onClose={setCompanyCommitteeModalIsVisible}
                />

            <PaegTitleWrapper>
            <PageTilleBack className="link" onClick={()=>navigate(routePaths.CONTACT)}icon={Icons.Back}  Text="David Mrejen" /> 

            </PaegTitleWrapper>
            <div className="stickyTab">
                <TabOuterWrapper>
                    <TabWrapper>
                        <TabButton onClick={()=> navigate(routePaths.GENERALPAGE)} >General</TabButton>
                        <TabButton className="active" onClick={()=> navigate(routePaths.EXECUTIVETEAM)}>Team</TabButton>
                        <TabButton onClick={()=> navigate(routePaths.COMPANYMEETINGSCALENDAR)}>Actions</TabButton>
                        <TabButton className="removeBorder" onClick={()=> navigate(routePaths.COMPANYDOCUMENTS)}>Documents</TabButton>
                    </TabWrapper>
                    <SubTabWrap>
                        <GridColumn width={16}>
                            <ViewWrapper>
                                <ViewList>
                                    <ViewLink onClick={()=> navigate(routePaths.EXECUTIVETEAM)}><p>Executive team</p></ViewLink>
                                    <ViewLink onClick={()=> navigate(routePaths.COMPANYBOARDDIRECTORS)}><p>Board of directors</p></ViewLink>
                                    <ViewLink onClick={()=> navigate(routePaths.COMPANYADVISORYBOARD)}><p className="active">Advisory board</p></ViewLink>
                                    <ViewLink onClick={()=> navigate(routePaths.DEALTEAM)}><p>Deal team</p></ViewLink>
                                    <ViewLink onClick={()=> navigate(routePaths.COMPANYSTRATEGYBOARD)}><p>Strategy board</p></ViewLink>
                                    <AddCommittee onClick={()=>setCompanyCommitteeModalIsVisible(true)}><Icon icon={Icons.Plus}/> Add committee</AddCommittee>
                                </ViewList>                            
                            </ViewWrapper>                        
                        </GridColumn> 
                        {/* <GridColumn width={6} className="smHide">   
                            <EditProfileWrap>
                            <CustomButton onClick={()=> navigate(routePaths.EXECUTIVETEAMEDIT)} icon={Icons.Edit}  buttonText=" Edit Info" />

                            </EditProfileWrap>
                        </GridColumn> */}
                    </SubTabWrap> 
                </TabOuterWrapper>
                {/* <EditProfileWrap className="rsContent"> 
                <CustomButton onClick={()=> navigate(routePaths.BOARDDIRECTORSEDIT)} icon={Icons.Edit} 
                                buttonText="Edit Info" />
                </EditProfileWrap> */}
            </div>
            

            <GridWrapper className="doubleTabContent">
                <SeacrhWrapper className="smHide">
                    <LeftCol>
                        <SearchBar placeholder="Search Team"></SearchBar>
                    </LeftCol>
                    <RightCol>
                        <span>Sort by :</span> <h6>Joined on</h6>  <Icon icon={Icons.LeftArrow}/> <span>01-12</span> <Icon icon={Icons.RightArrow}/>
                    </RightCol>                    
                </SeacrhWrapper>
                <TableContent>
                    <table cellSpacing="0" cellPadding="0">
                        <thead>
                            <tr>
                                <th>Company name</th>
                                <th>Acting on behalf of</th>
                                <th>Role</th>
                                <th>Joined on</th>
                                <th>Left on</th>
                                {/* <th className="fixWidth">
                                    <FLexBox>
                                        <WhiteCheckBox>
                                            <input type="checkbox"></input>
                                            <span className="checkmark"></span>
                                        </WhiteCheckBox> 
                                        <Icon icon={Icons.DownArrow}/>
                                    </FLexBox>                                    
                                </th> */}
                                <th className="fixWidth"><Icon icon={Icons.Delete}/></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan={6}>
                                    <div className="noDataFound">Oops, nothing found!</div>    
                                </td>                                
                            </tr>
                            
                        </tbody>
                        
                    </table>
                </TableContent>


                
                
                


            </GridWrapper>
            
               
        </>
    );
};

export default BoardDirectors;
