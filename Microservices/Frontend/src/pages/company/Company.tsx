
import React, { useState } from "react";
import styled from "styled-components";
import { Dropdown } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";



import Icon from "../../components/elements/Icon";
import { IconEnum as Icons } from "../../components/elements/Icons";
import colors from '../../util/Colors';
import ProfileIMage  from '../../assets/svg/Profile.jpg';
import BaseModal, { ModalList } from "../../components/modal/BaseModal";
import routePaths from "../../config/routepaths.config";
import CheckBox from "../../components/CheckBox";

 

const PaegTitleWrapper = styled.div`
    background-color: ${colors.white};
    padding: 25px 20px;
    display: flex;
    align-items: center;
    border-radius: 10px;
    @media screen and (max-width: 767px) {
        padding: 15px 20px 0;
        border-radius: 0;
        justify-content: space-between;
    }
`;
const PageTille = styled.h1`
    margin:0;
    display: flex;
    align-items: center;
    font-family: 'euclid_circular_asemibold';
    font-size: 32px;
    @media (max-width:767px){  
        font-size: 18px !important;
    }
    svg{
        margin-right: 15px; 
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
const SearchBar = styled.div`
    position: relative;
    width: 100%;
    max-width: 520px;
    display: flex;
    align-items: center;
    border: 1px solid ${colors.bordercolor};
    padding: 15px 20px;
    border-radius: 10px;
    background-color: ${colors.white};
    @media (max-width:1300px){
        max-width: 440px;
    }
    @media (max-width:767px){
        max-width: 100%;
    }
    input{
        width:100%;
        border: none;
        width: 100%;
        border: none;
        padding-left: 30px;
        font-size: 14px;
        font-family: 'euclid_circular_aregular';
        &:focus-visible{
            outline:none;
            border: none;
        }
    }
    img{
        position: absolute;
        left: 18px;
    }
`;
const ViewAdd = styled.div`
    display: flex;
    align-items: center;
    font-size: 20px;
    color: ${colors.black2};
    white-space: nowrap;
    cursor: pointer;
    min-height: 45px;
    font-family: 'euclid_circular_aregular';
    @media screen and (max-width: 767px) {
        font-size: 16px;
    }
    svg{
        color: ${colors.black} !important; 
        margin-right: 8px;
        font-size: 20px !important;
        @media screen and (max-width: 767px) {
            font-size: 18px !important;
        }
    }
    &:hover{
        color: ${colors.blue}; 
        svg{
            color: ${colors.blue} !important; 
        } 
    }
`;
const LeftCol = styled.div`
    display: flex;
    grid-gap: 15px;
    flex: 1;
    align-items: flex-end;
    flex-flow: wrap;
    width: 100%;
    @media (max-width:767px){ 
        align-items: center;
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
const TableContent = styled.div`
    border-radius: 10px;
    display: flex;
    width: 100%;
    margin-top: 10px;
    border: 1px solid ${colors.bordercolor};
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
            white-space: nowrap;
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
                justify-content: space-between;
                align-items: center;
                font-family: 'euclid_circular_abold';
            }
            &:last-child{
                text-align:center; 
                @media screen and (max-width: 767px) {
                    border-bottom: 15px solid ${colors.basecolor};
                }
            }
            &:before{
                @media screen and (max-width: 767px) {
                    content: attr(data-label);
					float: left;
                    font-family: 'euclid_circular_aregular';
					font-size:13px;					
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
const UserImageWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
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
        z-index: 9;
        color: ${colors.black};
        font-size: 14px;
        font-family: 'euclid_circular_amedium';
    }
`;
const UserImage = styled.div`
    width: 34px;
    height: 34px;
    overflow: hidden;
    border-radius: 50%;
    object-fit: cover;
    &.overalpImage{
        margin-left: -13px;
        position: relative;
        z-index: 9;
        border: 1px solid ${colors.white};
    }
    img{
        width: 34px;
        height: 34px;
        object-fit: cover;
    }
`;
const WhiteCheckBox = styled.label`
    display: block;
    position: relative;
    cursor: pointer;
    font-size: 22px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    min-height: 18px;
    input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
        &:checked ~ .checkmark {
            background-color: ${colors.white};
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
        background-color: ${colors.white};
        border-radius: 3px;        
        &:after {
            content: "";
            position: absolute;
            display: none;
            left: 7px;
            top: 4px;
            width: 4px;
            height: 9px;
            border: solid ${colors.blue};
            border-width: 0 2px 0px 0;
            -webkit-transform: rotate(90deg);
            -ms-transform: rotate(90deg);
            transform: rotate(90deg);
        }
      }
`;
const FLexBox = styled.div`
      display:flex;
      align-items: center;
      justify-content: space-between;
`;
const FilterBtn = styled.button`
    background-color: ${colors.white};
    border: 1px solid ${colors.bordercolor};
    border-radius: 50px;
    padding: 8px 15px;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: ${colors.darkblue};
    cursor: pointer;
    white-space: nowrap;
    font-family: 'euclid_circular_aregular';
    @media screen and (max-width: 767px) {
        text-transform: capitalize;
    }
    svg{
        color: ${colors.darkblue} !important;
        width: 19px;
        margin-right: 10px;
    }
    span{
        display: flex;
        margin-right: 5px;
        @media screen and (max-width: 1024px) {
            display:none;
        }
    }
    
`;
const Company = () => { 
 
    const [CompanyCreateViewModalIsVisible, setCompanyCreateViewModalIsVisible] = useState(false);
    const [AdvanceCompaniesFiltersModalIsVisible, setAdvanceCompaniesFiltersModalIsVisible] = useState(false);
    const [CompanyDetailsModalIsVisible, setCompanyDetailsModalIsVisible] = useState(false);
    const navigate = useNavigate();

return (  
        <>

<BaseModal
            open={CompanyCreateViewModalIsVisible}
            modalType={ModalList.CompanyCreateView} 
            onClose={setCompanyCreateViewModalIsVisible}
            // getinfo={getCardInfo}      // getCardInfo will replaced by any function
         />
             <BaseModal
            open={AdvanceCompaniesFiltersModalIsVisible}
            modalType={ModalList.AdvanceCompaniesFilters}
            onClose={setAdvanceCompaniesFiltersModalIsVisible}
         />
         <BaseModal
            open={CompanyDetailsModalIsVisible}
            modalType={ModalList.CompanyDetails}
            onClose={setCompanyDetailsModalIsVisible}
         />
            <PaegTitleWrapper>
                <PageTille>  <span className="smHide">Companies</span></PageTille>
                <div className="rsContent">
                    <ViewAdd onClick={()=>setCompanyCreateViewModalIsVisible(true)}><Icon icon={Icons.Plus}/> Add view</ViewAdd>
                </div>                
            </PaegTitleWrapper>

            <GridWrapper>
                <SeacrhWrapper>
                    <LeftCol>
                        <SearchBar>
                            <input type="text" placeholder='Search companies'></input>
                            <img src={Icons.SearchIcon}alt=""></img> 
                        </SearchBar>

                        <FilterBtn onClick={()=>setAdvanceCompaniesFiltersModalIsVisible(true)}><Icon icon={Icons.Filter}/><span>Advanced</span> filters</FilterBtn>    

                        <ViewAdd className="smHide" onClick={()=>setCompanyCreateViewModalIsVisible(true)}><Icon icon={Icons.Plus}/> Add view</ViewAdd>
                        <RightCol className="responsiveContent">
                            <span>Sort by :</span> <h6>Created on</h6> 
                        </RightCol> 
                    </LeftCol>
                    <RightCol className="smHide">
                        <span>Sort by :</span> <h6>Created on</h6>  <Icon icon={Icons.LeftArrow}/> <span>01-12</span> <Icon icon={Icons.RightArrow}/>
                    </RightCol>                    
                </SeacrhWrapper>
                <TableContent>  
                    <table cellSpacing="0" cellPadding="0">
                        <thead>
                            <tr>
                                <th>Company name</th>
                                <th>RMs</th>
                                <th>Main contact</th>
                                <th>Position</th>
                                <th>Last Contacted on</th>
                                <th>Created on</th>
                                <th className="fixWidth">
                                    <FLexBox>
                                        <WhiteCheckBox>
                                            <input type="checkbox" checked></input>
                                            <span className="checkmark"></span>
                                        </WhiteCheckBox> 
                                        <Icon icon={Icons.DownArrow}/>
                                    </FLexBox>                                    
                                </th>
                                <th className="fixWidth"><Icon icon={Icons.Delete}/></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td data-label="Contact name"><span className="link" onClick={()=> navigate(routePaths.GENERALPAGE)}>Apple</span></td>
                                <td data-label="RMs">
                                    <UserImageWrapper>
                                        <UserImage><img src={ProfileIMage}alt=""></img></UserImage>
                                        <UserImage className="overalpImage"><img src={ProfileIMage}alt=""></img></UserImage>
                                        <UserImage className="overalpImage"><img src={ProfileIMage}alt=""></img></UserImage>
                                        <span className="userImage">+5</span>
                                    </UserImageWrapper>
                                    
                                </td>
                                <td data-label="Company">Benjamin Cohen</td>
                                <td data-label="Position">Managing Director</td>
                                <td data-label="Last Contacted on">10/10/2021</td>
                                <td data-label="Created on">10/10/2021</td>
                                <td  data-label="Select" className="fixWidth">
                                <CheckBox ></CheckBox>                                     
                                </td>
                                <td  data-label="Action" className="fixWidth">
                                    <Dropdown icon='ellipsis vertical' className='icon ellipseDropDown'>                                        
                                        <Dropdown.Menu>
                                            <Dropdown.Item icon='eye' text='View details' onClick={()=>setCompanyDetailsModalIsVisible(true)} />
                                            <Dropdown.Item icon='unlink' text='Unlink' />
                                            <Dropdown.Item icon='download' text='Download' />
                                            <Dropdown.Item icon='trash' text='Remove' />
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </td>
                            </tr>
                            <tr>
                                <td data-label="Contact name"><span className="link" onClick={()=> navigate(routePaths.GENERALPAGE)}>Amazon</span></td>
                                <td data-label="RMs">
                                    <UserImageWrapper>
                                        <UserImage><img src={ProfileIMage}alt=""></img></UserImage>
                                        <UserImage className="overalpImage"><img src={ProfileIMage}alt=""></img></UserImage>
                                        <UserImage className="overalpImage"><img src={ProfileIMage}alt=""></img></UserImage>
                                        <span className="userImage">+5</span>
                                    </UserImageWrapper>
                                    
                                </td>
                                <td data-label="Company">Benjamin Cohen</td>
                                <td data-label="Position">Managing Director</td>
                                <td data-label="Last Contacted on">10/10/2021</td>
                                <td data-label="Created on">10/10/2021</td>
                                <td  data-label="Select" className="fixWidth">
                                <CheckBox ></CheckBox>                                      
                                </td>
                                <td  data-label="Action" className="fixWidth">
                                    <Dropdown icon='ellipsis vertical' className='icon ellipseDropDown'>                                        
                                        <Dropdown.Menu>
                                            <Dropdown.Item icon='eye' text='View details' onClick={()=>setCompanyDetailsModalIsVisible(true)} />
                                            <Dropdown.Item icon='unlink' text='Unlink' />
                                            <Dropdown.Item icon='download' text='Download' />
                                            <Dropdown.Item icon='trash' text='Remove' />
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </td>
                            </tr>
                            <tr>
                                <td data-label="Contact name"><span className="link" onClick={()=> navigate(routePaths.GENERALPAGE)}>Microsoft</span></td>
                                <td data-label="RMs">
                                    <UserImageWrapper>
                                        <UserImage><img src={ProfileIMage}alt=""></img></UserImage>
                                        <UserImage className="overalpImage"><img src={ProfileIMage}alt=""></img></UserImage>
                                        <UserImage className="overalpImage"><img src={ProfileIMage}alt=""></img></UserImage>
                                        <span className="userImage">+5</span>
                                    </UserImageWrapper>
                                    
                                </td>
                                <td data-label="Company">Benjamin Cohen</td>
                                <td data-label="Position">Managing Director</td>
                                <td data-label="Last Contacted on">10/10/2021</td>
                                <td data-label="Created on">10/10/2021</td>
                                <td  data-label="Select" className="fixWidth">
                                <CheckBox ></CheckBox>                                       
                                </td>
                                <td  data-label="Action" className="fixWidth">
                                    <Dropdown icon='ellipsis vertical' className='icon ellipseDropDown'>                                        
                                        <Dropdown.Menu>
                                            <Dropdown.Item icon='eye' text='View details' onClick={()=>setCompanyDetailsModalIsVisible(true)} />
                                            <Dropdown.Item icon='unlink' text='Unlink' />
                                            <Dropdown.Item icon='download' text='Download' />
                                            <Dropdown.Item icon='trash' text='Remove' />
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </td>
                            </tr>
                            <tr>
                                <td data-label="Contact name"><span className="link" onClick={()=> navigate(routePaths.GENERALPAGE)}>Apple</span></td>
                                <td data-label="RMs">
                                    <UserImageWrapper>
                                        <UserImage><img src={ProfileIMage}alt=""></img></UserImage>
                                        <UserImage className="overalpImage"><img src={ProfileIMage}alt=""></img></UserImage>
                                        <UserImage className="overalpImage"><img src={ProfileIMage}alt=""></img></UserImage>
                                        <span className="userImage">+5</span>
                                    </UserImageWrapper>
                                    
                                </td>
                                <td data-label="Company">Benjamin Cohen</td>
                                <td data-label="Position">Managing Director</td>
                                <td data-label="Last Contacted on">10/10/2021</td>
                                <td data-label="Created on">10/10/2021</td>
                                <td  data-label="Select" className="fixWidth">
                                <CheckBox ></CheckBox>                                      
                                </td>
                                <td  data-label="Action" className="fixWidth">
                                    <Dropdown icon='ellipsis vertical' className='icon ellipseDropDown'>                                        
                                        <Dropdown.Menu>
                                            <Dropdown.Item icon='eye' text='View details' onClick={()=>setCompanyDetailsModalIsVisible(true)} />
                                            <Dropdown.Item icon='unlink' text='Unlink' />
                                            <Dropdown.Item icon='download' text='Download' />
                                            <Dropdown.Item icon='trash' text='Remove' />
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </td>
                            </tr>
                            <tr>
                                <td data-label="Contact name"><span className="link" onClick={()=> navigate(routePaths.GENERALPAGE)}>Amazon</span></td>
                                <td data-label="RMs">
                                    <UserImageWrapper>
                                        <UserImage><img src={ProfileIMage}alt=""></img></UserImage>
                                        <UserImage className="overalpImage"><img src={ProfileIMage}alt=""></img></UserImage>
                                        <UserImage className="overalpImage"><img src={ProfileIMage}alt=""></img></UserImage>
                                        <span className="userImage">+5</span>
                                    </UserImageWrapper>
                                    
                                </td>
                                <td data-label="Company">Benjamin Cohen</td>
                                <td data-label="Position">Managing Director</td>
                                <td data-label="Last Contacted on">10/10/2021</td>
                                <td data-label="Created on">10/10/2021</td>
                                <td  data-label="Select" className="fixWidth">
                                <CheckBox ></CheckBox>                                      
                                </td>
                                <td  data-label="Action" className="fixWidth">
                                    <Dropdown icon='ellipsis vertical' className='icon ellipseDropDown'>                                        
                                        <Dropdown.Menu>
                                            <Dropdown.Item icon='eye' text='View details' onClick={()=>setCompanyDetailsModalIsVisible(true)} />
                                            <Dropdown.Item icon='unlink' text='Unlink' />
                                            <Dropdown.Item icon='download' text='Download' />
                                            <Dropdown.Item icon='trash' text='Remove' />
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </td>
                            </tr>
                            <tr>
                                <td data-label="Contact name"><span className="link" onClick={()=> navigate(routePaths.GENERALPAGE)}>Microsoft</span></td>
                                <td data-label="RMs">
                                    <UserImageWrapper>
                                        <UserImage><img src={ProfileIMage}alt=""></img></UserImage>
                                        <UserImage className="overalpImage"><img src={ProfileIMage}alt=""></img></UserImage>
                                        <UserImage className="overalpImage"><img src={ProfileIMage}alt=""></img></UserImage>
                                        <span className="userImage">+5</span>
                                    </UserImageWrapper>
                                    
                                </td>
                                <td data-label="Company">Benjamin Cohen</td>
                                <td data-label="Position">Managing Director</td>
                                <td data-label="Last Contacted on">10/10/2021</td>
                                <td data-label="Created on">10/10/2021</td>
                                <td  data-label="Select" className="fixWidth">
                                <CheckBox ></CheckBox>                                     
                                </td>
                                <td  data-label="Action" className="fixWidth">
                                    <Dropdown icon='ellipsis vertical' className='icon ellipseDropDown'>                                        
                                        <Dropdown.Menu>
                                            <Dropdown.Item icon='eye' text='View details' onClick={()=>setCompanyDetailsModalIsVisible(true)} />
                                            <Dropdown.Item icon='unlink' text='Unlink' />
                                            <Dropdown.Item icon='download' text='Download' />
                                            <Dropdown.Item icon='trash' text='Remove' />
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </td>
                            </tr>
                        </tbody>
                        
                    </table>
                </TableContent>
            </GridWrapper>
            
               
        </>
    );
};

export default Company;
