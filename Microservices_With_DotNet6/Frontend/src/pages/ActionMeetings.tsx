
import { useState } from "react";
import styled from "styled-components";
import { Dropdown, Grid, GridColumn } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";




import routePaths from "../config/routepaths.config";
import Icon from "../components/elements/Icon";
import { IconEnum as Icons } from "../components/elements/Icons";
import colors from '../util/Colors';
import ProfileIMage  from '../assets/svg/Profile.jpg';
import BaseModal, { ModalList } from "../components/modal/BaseModal";
import SearchBar from "../components/SearchBar";
import CheckBox from "../components/CheckBox";
import PageTilleBack from "../components/PageTitleBack";


//#region  styled css
const PaegTitleWrapper = styled.div`
    background-color: ${colors.white};
    padding: 25px 20px 0;
    display: flex;
    align-items: flex-start;
    border-radius: 10px 10px 0 0;
    flex-direction: column;
    justify-content: center;
    .headerWrapper{
        width:100%;
    }
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
        padding: 20px 0 0;
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
                @media screen and (max-width: 767px) {
                    bottom: -5px;
                }
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
    align-items: flex-end;
    @media screen and (max-width: 767px) {
        width:100%;
        flex-flow: wrap;
        align-items: center;
        justify-content: space-between;
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
const GridFilter = styled.div`
    display: inline-flex;
    border: 1px solid ${colors.darkblue};
    border-radius: 8px;
    align-items: center;
    justify-content: center;
    background-color: ${colors.basecolor};
    overflow: hidden;
    margin-right: -25px;
    span{
        display: flex;
        width: 35px;
        height: 35px;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-radius: 7px;
        &.active,&:hover{
            background-color: ${colors.darkblue};
            img{
                filter: brightness(10);
                -webkit-filter: brightness(10);
            }
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

//#endregion

const ActionMeetings = () => {
    const [contactAdvancedFiltersMeetingsVisible, setAdvancedFiltersMeetingsModalIsVisible] = useState(false);
    const navigate = useNavigate();
    const [meetingDetailsModalIsVisible, setMeetingDetailsModalIsVisible] = useState(false);
    

return (


        <>
        <BaseModal
                    open={contactAdvancedFiltersMeetingsVisible}
                    modalType={ModalList.AdvancedFiltersMeetings}
                    onClose={setAdvancedFiltersMeetingsModalIsVisible}
                />
        <BaseModal
            open={meetingDetailsModalIsVisible}
            modalType={ModalList.MeetingDetails}
            subTitle={"Linkbynet"}
            onClose={setMeetingDetailsModalIsVisible}
            />
            <PaegTitleWrapper>
                <Grid className="headerWrapper">
                    <GridColumn width={10}>
                    <PageTilleBack className="link" onClick={()=>navigate(routePaths.CONTACT)}icon={Icons.Back}  Text="David Mrejen" /> 
                    </GridColumn>
                    <GridColumn width={6} textAlign="right">
                        <GridFilter>
                            <span onClick={()=> navigate(routePaths.MEETINGSCALENDAER)}><img src={Icons.CalendarIcon}alt=""></img></span>
                            <span className="active" onClick={()=> navigate(routePaths.ACTIONMEETINGS)}><img src={Icons.FilterIcon}alt=""></img></span>
                        </GridFilter>
                    </GridColumn>
                </Grid>
            </PaegTitleWrapper>
            <TabOuterWrapper className="stickyTab"> 
                <TabWrapper> 
                    <TabButton onClick={()=> navigate(routePaths.USER)} >General</TabButton>
                    <TabButton onClick={()=> navigate(routePaths.MANAGEMENTTEAM)}>Positions</TabButton>
                    <TabButton className="active" onClick={()=> navigate(routePaths.MEETINGSCALENDAER)}>Actions</TabButton>
                    <TabButton onClick={()=> navigate(routePaths.DOCUMENTS)} className="removeBorder">Documents</TabButton>
                </TabWrapper>
                <SubTabWrap>
                    <GridColumn width={16}>
                        <ViewWrapper>
                            <ViewList>
                                <ViewLink onClick={()=> navigate(routePaths.MEETINGSCALENDAER)}><p className="active">Meetings</p></ViewLink>
                                <ViewLink onClick={()=> navigate(routePaths.TASKCALENDAR)}><p>Tasks</p></ViewLink>
                                <ViewLink onClick={()=> navigate(routePaths.EMAILGRID)}><p>Emails</p></ViewLink>
                                <ViewLink onClick={()=> navigate(routePaths.NOTEGRID)}><p>Notes</p></ViewLink>
                            </ViewList>                            
                        </ViewWrapper>                        
                    </GridColumn>
                </SubTabWrap>
            </TabOuterWrapper>
            <GridWrapper className="doubleTabContent">
                <SeacrhWrapper>
                    <LeftCol>
                        <SearchBar placeholder="Search meetings"></SearchBar>
                        <FilterBtn onClick={()=>setAdvancedFiltersMeetingsModalIsVisible(true)}><Icon icon={Icons.Filter}/> <span>Advanced</span> filters</FilterBtn>                      
                        <RightCol className="rsContent">
                            <span>Sort by :</span> <h6>Date</h6> 
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
                                <th>Meeting subject</th>
                                <th>Participants</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Notes</th>
                                <th className="fixWidth">
                                    <FLexBox>
                                        <WhiteCheckBox>
                                            <input type="checkbox"></input>
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
                                <td data-label="Meeting subject"><span className="link" onClick={()=>setMeetingDetailsModalIsVisible(true)}>Presentation deal flow</span></td>
                                <td data-label="Participants">
                                    <UserImageWrapper>
                                        <UserImage><img src={ProfileIMage }alt=""></img></UserImage>
                                        <UserImage className="overalpImage"><img src={ProfileIMage}alt=""></img></UserImage>
                                        <UserImage className="overalpImage"><img src={ProfileIMage}alt=""></img></UserImage>
                                        <span className="userImage">+5</span>
                                    </UserImageWrapper>
                                    
                                </td>
                                <td data-label="Date">10/10/2021</td>
                                <td data-label="Time">09:30 - 10:30</td>
                                <td data-label="Notes"><img src={Icons.FileIcon}alt=""></img></td>                                
                                <td data-label="select" className="fixWidth">
                                <CheckBox ></CheckBox> 
                                </td>
                                <td data-label="Action" className="fixWidth">
                                    <Dropdown icon='ellipsis vertical' className='icon ellipseDropDown'>
                                        <Dropdown.Menu>
                                            <Dropdown.Item icon='eye' text='View details' onClick={()=>setMeetingDetailsModalIsVisible(true)} />
                                            <Dropdown.Item icon='unlink' text='Unlink' />
                                            <Dropdown.Item icon='download' text='Download' />
                                            <Dropdown.Item icon='trash' text='Remove' />
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </td>
                            </tr>
                            <tr>
                                <td data-label="Meeting subject"><span className="link" onClick={()=>setMeetingDetailsModalIsVisible(true)}>Presentation deal flow</span></td>
                                <td data-label="Participants">
                                    <UserImageWrapper>
                                        <UserImage><img src={ProfileIMage}alt=""></img></UserImage>
                                        <UserImage className="overalpImage"><img src={ProfileIMage}alt=""></img></UserImage>
                                        <UserImage className="overalpImage"><img src={ProfileIMage}alt=""></img></UserImage>
                                        <span className="userImage">+5</span>
                                    </UserImageWrapper>
                                    
                                </td>
                                <td data-label="Date">10/10/2021</td>
                                <td data-label="Time">09:30 - 10:30</td>
                                <td data-label="Notes"><img src={Icons.FileIcon}alt=""></img></td>                                
                                <td data-label="select" className="fixWidth">
                                <CheckBox ></CheckBox>  
                                </td>
                                <td data-label="Action" className="fixWidth">
                                    <Dropdown icon='ellipsis vertical' className='icon ellipseDropDown'>
                                        <Dropdown.Menu>
                                            <Dropdown.Item icon='eye' text='View details' onClick={()=>setMeetingDetailsModalIsVisible(true)} />
                                            <Dropdown.Item icon='unlink' text='Unlink' />
                                            <Dropdown.Item icon='download' text='Download' />
                                            <Dropdown.Item icon='trash' text='Remove' />
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </td>
                            </tr>
                            <tr>
                                <td data-label="Meeting subject"><span className="link" onClick={()=>setMeetingDetailsModalIsVisible(true)}>Presentation deal flow</span></td>
                                <td data-label="Participants">
                                    <UserImageWrapper>
                                        <UserImage><img src={ProfileIMage}alt=""></img></UserImage>
                                        <UserImage className="overalpImage"><img src={ProfileIMage}alt=""></img></UserImage>
                                        <UserImage className="overalpImage"><img src={ProfileIMage}alt=""></img></UserImage>
                                        <span className="userImage">+5</span>
                                    </UserImageWrapper>
                                    
                                </td>
                                <td data-label="Date">10/10/2021</td>
                                <td data-label="Time">09:30 - 10:30</td>
                                <td data-label="Notes"><img src={Icons.FileIcon}alt=""></img></td>                                
                                <td data-label="select" className="fixWidth">
                                <CheckBox ></CheckBox> 
                                </td>
                                <td data-label="Action" className="fixWidth">
                                    <Dropdown icon='ellipsis vertical' className='icon ellipseDropDown'>
                                        <Dropdown.Menu>
                                            <Dropdown.Item icon='eye' text='View details' onClick={()=>setMeetingDetailsModalIsVisible(true)} />
                                            <Dropdown.Item icon='unlink' text='Unlink' />
                                            <Dropdown.Item icon='download' text='Download' />
                                            <Dropdown.Item icon='trash' text='Remove' />
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </td>
                            </tr>
                            <tr>
                                <td data-label="Meeting subject"><span className="link" onClick={()=>setMeetingDetailsModalIsVisible(true)}>Presentation deal flow</span></td>
                                <td data-label="Participants">
                                    <UserImageWrapper>
                                        <UserImage><img src={ProfileIMage}alt=""></img></UserImage>
                                        <UserImage className="overalpImage"><img src={ProfileIMage}alt=""></img></UserImage>
                                        <UserImage className="overalpImage"><img src={ProfileIMage}alt=""></img></UserImage>
                                        <span className="userImage">+5</span>
                                    </UserImageWrapper>
                                    
                                </td>
                                <td data-label="Date">10/10/2021</td>
                                <td data-label="Time">09:30 - 10:30</td>
                                <td data-label="Notes"><img src={Icons.FileIcon}alt=""></img></td>                                
                                <td data-label="select" className="fixWidth">
                                <CheckBox ></CheckBox> 
                                </td>
                                <td data-label="Action" className="fixWidth">
                                    <Dropdown icon='ellipsis vertical' className='icon ellipseDropDown'>
                                        <Dropdown.Menu>
                                            <Dropdown.Item icon='eye' text='View details' onClick={()=>setMeetingDetailsModalIsVisible(true)} />
                                            <Dropdown.Item icon='unlink' text='Unlink' />
                                            <Dropdown.Item icon='download' text='Download' />
                                            <Dropdown.Item icon='trash' text='Remove' />
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </td>
                            </tr>
                            <tr>
                                <td data-label="Meeting subject"><span className="link" onClick={()=>setMeetingDetailsModalIsVisible(true)}>Presentation deal flow</span></td>
                                <td data-label="Participants">
                                    <UserImageWrapper>
                                        <UserImage><img src={ProfileIMage}alt=""></img></UserImage>
                                        <UserImage className="overalpImage"><img src={ProfileIMage}alt=""></img></UserImage>
                                        <UserImage className="overalpImage"><img src={ProfileIMage}alt=""></img></UserImage>
                                        <span className="userImage">+5</span>
                                    </UserImageWrapper>
                                    
                                </td>
                                <td data-label="Date">10/10/2021</td>
                                <td data-label="Time">09:30 - 10:30</td>
                                <td data-label="Notes"><img src={Icons.FileIcon}alt=""></img></td>                                
                                <td data-label="select" className="fixWidth">
                                <CheckBox ></CheckBox> 
                                </td>
                                <td data-label="Action" className="fixWidth">
                                    <Dropdown icon='ellipsis vertical' className='icon ellipseDropDown'>
                                        <Dropdown.Menu>
                                            <Dropdown.Item icon='eye' text='View details' onClick={()=>setMeetingDetailsModalIsVisible(true)} />
                                            <Dropdown.Item icon='unlink' text='Unlink' />
                                            <Dropdown.Item icon='download' text='Download' />
                                            <Dropdown.Item icon='trash' text='Remove' />
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </td>
                            </tr>
                            <tr>
                                <td data-label="Meeting subject"><span className="link" onClick={()=>setMeetingDetailsModalIsVisible(true)}>Presentation deal flow</span></td>
                                <td data-label="Participants">
                                    <UserImageWrapper>
                                        <UserImage><img src={ProfileIMage}alt=""></img></UserImage>
                                        <UserImage className="overalpImage"><img src={ProfileIMage}alt=""></img></UserImage>
                                        <UserImage className="overalpImage"><img src={ProfileIMage}alt=""></img></UserImage>
                                        <span className="userImage">+5</span>
                                    </UserImageWrapper>
                                    
                                </td>
                                <td data-label="Date">10/10/2021</td>
                                <td data-label="Time">09:30 - 10:30</td>
                                <td data-label="Notes"><img src={Icons.FileIcon}alt=""></img></td>                                
                                <td data-label="select" className="fixWidth">
                                <CheckBox ></CheckBox> 
                                </td>
                                <td data-label="Action" className="fixWidth">
                                    <Dropdown icon='ellipsis vertical' className='icon ellipseDropDown'>
                                        <Dropdown.Menu>
                                            <Dropdown.Item icon='eye' text='View details' onClick={()=>setMeetingDetailsModalIsVisible(true)} />
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

export default ActionMeetings;


