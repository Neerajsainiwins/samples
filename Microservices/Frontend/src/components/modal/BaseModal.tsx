/* eslint-disable react/jsx-props-no-spreading */
import { useEffect } from 'react';
import styled from 'styled-components';
import Popup from 'reactjs-popup';
import Icon from "../elements/Icon";
import { IconEnum as Icons } from "../elements/Icons";
import 'reactjs-popup/dist/index.css';
import Colors from '../../util/Colors';
import CreateView from './CreateView';
import CustomizeView from './CustomizeView';
import AdvanceFilter from './AdvanceFilter';
import ContactCreation from './ContactCreation';
import ContactCreations from './ContactCreations';
import AdvancedFiltersMeetings from './AdvancedFiltersMeetings';
import MeetingCreation from './MeetingCreation';
import MeetingDetails from './MeetingDetails';
import FiltersTask from './FiltersTask';
import TaskCreation from './TaskCreation';
import TaskDetails from './TaskDetails';
import AddNewCompany from './AddNewCompany';
import AddNewContact from './AddNewContact';
import AddNewDeal from './AddNewDeal';
import AdvanceFilterEmail from './AdvanceFilterEmail';
import EmailDetails from './EmailDetails';
import AdvancedFiltersNotes from './AdvancedFiltersNotes';
import AdvancedFiltersDoc from './AdvancedFiltersDoc';
import CreateFolder from './CreateFolder';
import DocumentPreview from './DocumentPreview';
import AdvanceCompaniesFilters from './company/AdvanceCompaniesFilters';
import CompanyCreation from './company/CompanyCreation';
import CompanyCreateView from './company/CompanyCreateView';
import CompanyCustomizeView from './company/CompanyCustomizeView';
import CompanyDetails from './company/CompanyDetails';
import CompanyCommittee from './company/CompanyCommittee';
import CompanyMeetingDetails from './company/CompanyMeetingDetails';
import CreateTenant from './superAdmin/CreateTenant';
import CompanyTaskCreation from './company/CompanyTaskCreation';
import UserCreation from './admin/UserCreation';
import UserDetail from './admin/UserDetail';
import CreateSuperAdmin from './superAdmin/CreateSuperAdmin';
import RoleCreation from './admin/RoleCreation';
import RoleDetail from './admin/RoleDetail';
import FolderCreate from './admin/FolderCreate';
import EditFieldProperties from './admin/EditFieldProperties';
import FieldPropertiesDetail from './admin/FieldPropertiesDetail';
import DropDownCreation from './admin/DropDownCreation';
import TemplateCreation from './admin/TemplateCreation';
import TemplateCreationDetails from './admin/TemplateCreationDetails';
import AdvancedFiltersFieldHistory from './admin/AdvancedFiltersFieldHistory';
import CalculationCreationAvanahCapital from './admin/CalculationCreationAvanahCapital';
import RefreshModal from './admin/RefreshModal';
import KeyFigures from './admin/KeyFigures';
import WaterfallDetails from './admin/WaterfallDetails';
import WaterfallDetailsEdit from './admin/WaterfallDetailsEdit';
import CompanyDocumentPreview from './company/CompanyDocumentPreview';
import DeleteTenent from './superAdmin/DeleteTenent';
import ViewSuperAdminDetails from '../../pages/superAdmin/ViewSuperAdminDetails';



const modalStyle = {
  display: 'flex',
  flexDirection: 'column',
  background: 'white',
  borderRadius: '10px',
  padding: '0px',
  maxHeight: '85vh',
  overflowY: 'auto',
  maxWidth: '65vw',
};
const Title = styled.div`
  font-size: 24px;
  color: ${Colors.black};
  font-family: 'euclid_circular_abold';
  @media screen and (max-width: 767px) {
    font-size: 18px;
  }
`;
const SubTitle = styled.div`
  font-size: 18px;
  color: ${Colors.grey};
  font-family: 'euclid_circular_amedium';
  margin-top: 10px;
`;
const CloseIcon = styled.span`
  width: 30px;
  height: 30px;
  background-color: ${Colors.exlightblue};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
      cursor: pointer;
  svg{
    color: ${Colors.blue} !important;
    font-size: 16px !important;
  }
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding:20px;
  border-bottom: 2px solid ${Colors.bordercolor};
  
`;
export const CommonFillBtn = styled.button`
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
export const FormWrapper = styled.div`
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
export const FieldRow = styled.div` 
    margin: 25px 0 0;   
    &.actionBtn{
        display: flex;
        justify-content: flex-end;
        grid-gap: 15px;
    }
`;

export const ModalList = Object.freeze({
  CreateView: 'Create View',
  CustomizeView: "Customize View",
  AdvanceFilter: "Advanced Filters Contacts",
  ContactCreation: "Contact Creation",
  ContactCreations: "Contact Creations",
  AdvancedFiltersMeetings: "Advanced Filters Meetings",
  MeetingCreation: "Meeting Creation",
  MeetingDetails: "Meeting Details",
  FiltersTask: "Advanced Filters Task",
  TaskCreation: "Task Creation",
  TaskDetails: "Task Details",
  AddNewCompany: "Add New Company",
  AddNewContact: "Add New Contact",
  AddNewDeal: "Add New Deal",
  AdvanceFilterEmail: "Advanced Filters Emails",
  EmailDetails: "Email Details",
  AdvancedFiltersNotes: "Advanced Filters Notes",
  AdvancedFiltersDoc: "Advanced Filters Documents",
  CreateFolder: "Create Folder",
  DocumentPreview: "Document Preview",

  AdvanceCompaniesFilters: "Advanced Filters Companies",
  CompanyCreation: "Company Creation",
  CompanyCreateView: "Create View ",
  CompanyCustomizeView: "Customize View ",
  CompanyDetails: "Venga",
  CompanyCommittee: "Add New Committee",
  CompanyMeetingDetails: "Meeting Details ",
  CompanyTaskCreation: "Task creation ",
  CompanyDocumentPreview: "Preview Introduction.doc",

  CreateTenant: "Create Tenant",
  CreateSuperAdmin: "Create Super Admin ",

  UserCreation: "User creation ",
  UserUpdate: "User update ",
  UserDetail: "User detail ",
  RoleCreation: "Role creation",
  RoleUpdate: "Role update",
  RoleDetail: "Role detail ",
  FolderCreate: "Create Folder ",
  CreateFieldProperties: "Create field properties",
  EditFieldProperties: "Edit field properties",
  FieldPropertiesDetail: "Field properties detail",
  DropDownCreation: "Drop down value creation",
  TemplateCreation: "Template creation Avanah Capital I",
  TemplateCreationDetails: "Template detail Avanah Capital I",
  AdvancedFiltersFieldHistory: "Advanced filters field history",
  CalculationCreationAvanahCapital: "Calculation creation Avanah Capital I",
  RefreshModal: "RefreshModal",
  KeyFigures: "Key figures Label Avanah Capital I Software",
  WaterfallDetails: "Waterfall Avanah Capital I",
  WaterfallDetailsEdit: "Waterfall creation Avanah Capital I",
  DeleteTenent: "Are you sure you want to delete this tenant?",
  ViewSuperAdminDetails: "View Super Admin Details"



});
export default function BaseModal({
  open, modalType, subTitle, onClose, showHeading = true, ...rest
}: any): any {
  const renderModal = (modalType: any, close: any) => {
    switch (modalType) {
      case ModalList.CreateView:
        return <CreateView close={close} {...rest} />;
      case ModalList.CustomizeView:
        return <CustomizeView close={close} {...rest} />;
      case ModalList.AdvanceFilter:
        return <AdvanceFilter close={close} {...rest} />;
      case ModalList.ContactCreation:
        return <ContactCreation close={close} {...rest} />;
      case ModalList.ContactCreations:
        return <ContactCreations close={close} {...rest} />;
      case ModalList.AdvancedFiltersMeetings:
        return <AdvancedFiltersMeetings close={close} {...rest} />;
      case ModalList.MeetingCreation:
        return <MeetingCreation close={close} {...rest} />;
      case ModalList.MeetingDetails:
        return <MeetingDetails close={close} {...rest} />;
      case ModalList.FiltersTask:
        return <FiltersTask close={close} {...rest} />;
      case ModalList.TaskCreation:
        return <TaskCreation close={close} {...rest} />;
      case ModalList.TaskDetails:
        return <TaskDetails close={close} {...rest} />;
      case ModalList.AddNewCompany:
        return <AddNewCompany close={close} {...rest} />;
      case ModalList.AddNewContact:
        return <AddNewContact close={close} {...rest} />;
      case ModalList.AddNewDeal:
        return <AddNewDeal close={close} {...rest} />;
      case ModalList.AdvanceFilterEmail:
        return <AdvanceFilterEmail close={close} {...rest} />;
      case ModalList.EmailDetails:
        return <EmailDetails close={close} {...rest} />;
      case ModalList.AdvancedFiltersNotes:
        return <AdvancedFiltersNotes close={close} {...rest} />;
      case ModalList.AdvancedFiltersDoc:
        return <AdvancedFiltersDoc close={close} {...rest} />;
      case ModalList.CreateFolder:
        return <CreateFolder close={close} {...rest} />;
      case ModalList.DocumentPreview:
        return <DocumentPreview close={close} {...rest} />;

      case ModalList.AdvanceCompaniesFilters:
        return <AdvanceCompaniesFilters close={close} {...rest} />;
      case ModalList.CompanyCreation:
        return <CompanyCreation close={close} {...rest} />;
      case ModalList.CompanyCreateView:
        return <CompanyCreateView close={close} {...rest} />;
      case ModalList.CompanyCustomizeView:
        return <CompanyCustomizeView close={close} {...rest} />;
      case ModalList.CompanyDetails:
        return <CompanyDetails close={close} {...rest} />;
      case ModalList.CompanyCommittee:
        return <CompanyCommittee close={close} {...rest} />;
      case ModalList.CompanyMeetingDetails:
        return <CompanyMeetingDetails close={close} {...rest} />;
      case ModalList.CompanyTaskCreation:
        return <CompanyTaskCreation close={close} {...rest} />;
      case ModalList.CompanyDocumentPreview:
        return <CompanyDocumentPreview close={close} {...rest} />;
      case ModalList.DeleteTenent:
        return <DeleteTenent close={close} {...rest} />;
      case ModalList.ViewSuperAdminDetails:
        return <ViewSuperAdminDetails close={close} {...rest} />;

      case ModalList.CreateTenant:
        return <CreateTenant close={close} {...rest} />;
      case ModalList.CreateSuperAdmin:
        return <CreateSuperAdmin close={close} {...rest} />;

      case ModalList.UserCreation:
        return <UserCreation close={close} {...rest} />;
      case ModalList.UserUpdate:
        return <UserCreation close={close} {...rest} />;
      case ModalList.UserDetail:
        return <UserDetail close={close} {...rest} />;
      case ModalList.RoleCreation:
        return <RoleCreation close={close} {...rest} />;
      case ModalList.RoleUpdate:
        return <RoleCreation close={close} {...rest} />;
      case ModalList.RoleDetail:
        return <RoleDetail close={close} {...rest} />;
      case ModalList.FolderCreate:
        return <FolderCreate close={close} {...rest} />;
      case ModalList.CreateFieldProperties:
        return <EditFieldProperties close={close} {...rest} />;
      case ModalList.EditFieldProperties:
        return <EditFieldProperties close={close} {...rest} />;
      case ModalList.FieldPropertiesDetail:
        return <FieldPropertiesDetail close={close} {...rest} />;
      case ModalList.DropDownCreation:
        return <DropDownCreation close={close} {...rest} />;
      case ModalList.TemplateCreation:
        return <TemplateCreation close={close} {...rest} />;
      case ModalList.TemplateCreationDetails:
        return <TemplateCreationDetails close={close} {...rest} />;
      case ModalList.AdvancedFiltersFieldHistory:
        return <AdvancedFiltersFieldHistory close={close} {...rest} />;
      case ModalList.CalculationCreationAvanahCapital:
        return <CalculationCreationAvanahCapital close={close} {...rest} />;
      case ModalList.RefreshModal:
        return <RefreshModal close={close} {...rest} />;
      case ModalList.KeyFigures:
        return <KeyFigures close={close} {...rest} />;
      case ModalList.WaterfallDetails:
        return <WaterfallDetails close={close} {...rest} />;
      case ModalList.WaterfallDetailsEdit:
        return <WaterfallDetailsEdit close={close} {...rest} />;
      default:
        return null;
    }
  };



  useEffect(() => {
    const HamBergerElement = document.getElementById('hamberger');

    if (HamBergerElement?.style) {
      if (open) {
        HamBergerElement.style.zIndex = '1';
      } else {
        HamBergerElement.style.zIndex = '20';
      }
    }
  }, [open, modalType]);

  return (
    <Popup
      modal
      open={open}
      closeOnDocumentClick={false}
      onClose={() => onClose(false)}
      contentStyle={modalStyle as any}

    >
      {(close: any) => (
        <>
          {showHeading && <Header>
            <Title>{modalType} {subTitle && <SubTitle>{subTitle}</SubTitle>}</Title>
            <CloseIcon onClick={() => close()}>
              <Icon
                icon={Icons.TimesSolid}
                size={18}
              />
            </CloseIcon>

          </Header>
          }
          {renderModal(modalType, close)}
        </>
      )}
    </Popup>
  );
}
