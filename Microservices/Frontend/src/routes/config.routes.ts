import { lazy } from "react";
import routePaths from "../config/routepaths.config";
import WithAdminLayout from "../pages/admin/WithAdminLayout";

// const AdminSettingsLayout = () => WithAdminLayout(lazy(() => import("../pages/admin/AdminSettings")), "");
// const AdminLabelsLayout = () => WithAdminLayout(lazy(() => import("../pages/admin/AdminLabels")),"GeneralConfiguration");
// const AdminFieldsLayout = () => WithAdminLayout(lazy(() => import("../pages/admin/AdminFields")),"GeneralConfiguration");
// const AdminSettingsEditLayout = () => WithAdminLayout(lazy(() => import("../pages/admin/AdminSettingsEdit")),"GeneralConfiguration");
// const RoleListLayout = () => WithAdminLayout(lazy(() => import("../pages/admin/UserRoleAdmin/RoleList")),"UsersAndRoles");
// const UserAdminLayout = () => WithAdminLayout(lazy(() => import("../pages/admin/UserRoleAdmin/UserAdmin")),"UsersAndRoles");
const AdminDocumentsLayout = () => WithAdminLayout(lazy(() => import("../pages/admin/AdminDocuments")),"GeneralConfiguration");
// const AdminDropDownsLayout = () => WithAdminLayout(lazy(() => import("../pages/admin/AdminDropDowns")),"GeneralConfiguration");
const FinancialCurrenciesLayout = () => WithAdminLayout(lazy(() => import("../pages/admin/FinancialCurrencies")), "Financial");
const FinancialDealStagesLayout = () => WithAdminLayout(lazy(() => import("../pages/admin/FinancialDealStages")), "Financial");
const FinancialKeyFiguresLayout = () => WithAdminLayout(lazy(() => import("../pages/admin/FinancialKeyFigures")), "Financial");
const FinancialCalculationsLayout = () => WithAdminLayout(lazy(() => import("../pages/admin/FinancialCalculations")), "Financial");
const FinancialFundWaterfallLayout = () => WithAdminLayout(lazy(() => import("../pages/admin/FundWaterfall")), "Financial"); 


const AuditTrailsLayout = () => WithAdminLayout(lazy(() => import("../pages/admin/AuditChangeHistory")), "AuditTrails");

const AuditRecycleBinLayout = () => WithAdminLayout(lazy(() => import("../pages/admin/AuditRecycleBin")), "AuditTrails");
const AuditFieldHistoryLayout = () => WithAdminLayout(lazy(() => import("../pages/admin/AuditFieldHistory")), "AuditTrails");

const ReportsValidationsLayout = () => WithAdminLayout(lazy(() => import("../pages/admin/ReportsValidations")), "Reports");
const ReportsTemplatesLayout = () => WithAdminLayout(lazy(() => import("../pages/admin/ReportsTemplates")), "Reports");





export const configRotues = [
    {
        path: `${routePaths.TENANTNOTFOUND}`,
        private: false,
        element: lazy(() => import("../pages/TenantNotFound"))
    },
    {
        path: `${routePaths.HOME}`,
        private: true,
        element: lazy(() => import("../pages/Home"))
    },
    {
        path: `${routePaths.REGISTER}`,
        private: false,
        element: lazy(() => import("../pages/LogIn/RegisterAccount"))
    },
    {
        path: `${routePaths.CONFIRM_EMAIL}`,
        private: false,
        element: lazy(() => import("../pages/LogIn/UserEmailVerification"))
    },
    {
        path: `${routePaths.FORGOT_PASSWORD}`,
        private: false,
        element: lazy(() => import("../pages/LogIn/UserForgetPassword"))
    },
    {
        path: `${routePaths.RESET_PASSWORD}`,
        private: false,
        element: lazy(() => import("../pages/LogIn/ResetPassword"))
    },    
    {
        path: `${routePaths.CONTACT}`,
        private: true,
        element: lazy(() => import("../pages/Dashboard"))
    },
    {
        path: `${routePaths.CONTACTVIEW}`,
        private: true,
        element: lazy(() => import("../pages/DashboardView"))
    },
    {
        path: `${routePaths.USER}`,
        private: true,
        element: lazy(() => import("../pages/UserPage"))
    },
    {
        path: `${routePaths.USEREDIT}`,
        private: true,
        element: lazy(() => import("../pages/UserPage"))
    },
    {
        path: `${routePaths.MANAGEMENTTEAM}`,
        private: true,
        element: lazy(() => import("../pages/ManagementTeam"))
    },
    {
        path: `${routePaths.BOARDDIRECTORS}`,
        private: true,
        element: lazy(() => import("../pages/BoardDirectors"))
    },
    {
        path: `${routePaths.BOARDDIRECTORSEDIT}`,
        private: true,
        element: lazy(() => import("../pages/BoardDirectorsEdit"))
    },
    {
        path: `${routePaths.ACTIONMEETINGS}`,
        private: true,
        element: lazy(() => import("../pages/ActionMeetings"))
    },
    {
        path: `${routePaths.MEETINGSCALENDAER}`,
        private: true,
        element: lazy(() => import("../pages/MeetingsCalendar"))
    },
    {
        path: `${routePaths.TASKCALENDAR}`,
        private: true,
        element: lazy(() => import("../pages/TaskCalender"))
    },
    {
        path: `${routePaths.TASKGRID}`,
        private: true,
        element: lazy(() => import("../pages/TaskGrid"))
    },
    {
        path: `${routePaths.EMAILGRID}`,
        private: true,
        element: lazy(() => import("../pages/EmailGrid"))
    },
    {
        path: `${routePaths.NOTEGRID}`,
        private: true,
        element: lazy(() => import("../pages/NoteGrid"))
    },
    {
        path: `${routePaths.NOTEGRIDEDIT}`,
        private: true,
        element: lazy(() => import("../pages/NoteGridEdit"))
    },
    {
        path: `${routePaths.DOCUMENTS}`,
        private: true,
        element: lazy(() => import("../pages/Documents"))
    },
    {
        path: `${routePaths.DOCUMENTSGRID}`,
        private: true,
        element: lazy(() => import("../pages/DocumentsGrid"))
    },
    {
        path: `${routePaths.COMPANY}`,
        private: true,
        element: lazy(() => import("../pages/company/Company"))
    },
    {
        path: `${routePaths.COMPANYVIEW}`,
        private: true,
        element: lazy(() => import("../pages/company/CompanyView"))
    },
    {
        path: `${routePaths.GENERALPAGE}`,
        private: true,
        element: lazy(() => import("../pages/company/GeneralPage"))
    },
    {
        path: `${routePaths.GENERALEDITPAGE}`,
        private: true,
        element: lazy(() => import("../pages/company/GeneralEditPage"))
    },
    {
        path: `${routePaths.EXECUTIVETEAM}`,
        private: true,
        element: lazy(() => import("../pages/company/ExecutiveTeam"))
    },
    {
        path: `${routePaths.EXECUTIVETEAMEDIT}`,
        private: true,
        element: lazy(() => import("../pages/company/ExecutiveTeamEdit"))
    },
    {
        path: `${routePaths.COMPANYBOARDDIRECTORS}`,
        private: true,
        element: lazy(() => import("../pages/company/CompanyBoardDirectors"))
    },
    {
        path: `${routePaths.COMPANYBOARDDIRECTORSEDIT}`,
        private: true,
        element: lazy(() => import("../pages/company/CompanyBoardDirectorsEdit"))
    },
    {
        path: `${routePaths.DEALTEAM}`,
        private: true,
        element: lazy(() => import("../pages/company/DealTeam"))
    },
    {
        path: `${routePaths.DEALTEAMEDIT}`,
        private: true,
        element: lazy(() => import("../pages/company/DealTeamEdit"))
    },
    {
        path: `${routePaths.COMPANYMEETINGSCALENDAR}`,
        private: true,
        element: lazy(() => import("../pages/company/CompanyMeetingsCalendar"))
    },
    {
        path: `${routePaths.COMPANYMEETINGSGRID}`,
        private: true,
        element: lazy(() => import("../pages/company/CompanyMeetingsGrid"))
    },
    {
        path: `${routePaths.COMPANYTASKCALENDAR}`,
        private: true,
        element: lazy(() => import("../pages/company/CompanyMeetingsGrid"))
    },
    {
        path: `${routePaths.COMPANYMEETINGSGRID}`,
        private: true,
        element: lazy(() => import("../pages/company/CompanyTaskCalender"))
    },
    {
        path: `${routePaths.COMPANYTASKGRID}`,
        private: true,
        element: lazy(() => import("../pages/company/CompanyTaskGrid"))
    },
    {
        path: `${routePaths.COMPANYEMAILGRID}`,
        private: true,
        element: lazy(() => import("../pages/company/CompanyEmailGrid"))
    },
    {
        path: `${routePaths.COMPANYNOTEGRID}`,
        private: true,
        element: lazy(() => import("../pages/company/CompanyNoteGrid"))
    },
    {
        path: `${routePaths.COMPANYEMAILGRID}`,
        private: true,
        element: lazy(() => import("../pages/company/CompanyEmailGrid"))
    },
    {
        path: `${routePaths.COMPANYNOTEGRIDEDIT}`,
        private: true,
        element: lazy(() => import("../pages/company/CompanyNoteGridEdit"))
    },
    {
        path: `${routePaths.COMPANYDOCUMENTS}`,
        private: true,
        element: lazy(() => import("../pages/company/CompanyDocuments"))
    },
    {
        path: `${routePaths.COMPANYDOCUMENTSGRID}`,
        private: true,
        element: lazy(() => import("../pages/company/CompanyDocumentsGrid"))
    },
    {
        path: `${routePaths.SUPERADMIN}`,
        private: true,
        element: lazy(() => import("../pages/superAdmin/SuperAdmin"))
    },
    {
        path: `${routePaths.USERADMIN}`,
        private: true,
        element: lazy(() => import("../pages/admin/UserRoleAdmin/UserAdmin"))
    },
    {
        path: `${routePaths.EDITPROFILE}`,
        private: true,
        element: lazy(() => import("../pages/EditProfile"))
    },
    {
        path: `${routePaths.ROLELIST}`,
        private: true,
        element: lazy(() => import("../pages/admin/UserRoleAdmin/RoleList"))
    },
    {
        path: `${routePaths.FINANCIALCURRENCIES}`,
        private: true,
        element: FinancialCurrenciesLayout
    },
    {
        path: `${routePaths.FINANCIALCURRENCIESEdit}`,
        private: true,
        element: lazy(() => import("../pages/admin/FinancialCurrenciesEdit"))
    },
    {
        path: `${routePaths.FINANCIALDEALSTAGES}`,
        private: true,
        element: FinancialDealStagesLayout
    },
    {
        path: `${routePaths.FINANCIALDEALSTAGESEDIT}`,
        private: true,
        element: FinancialDealStagesLayout
    },
    {
        path: `${routePaths.ADMINSETTINGS}`,
        private: true,
        element: lazy(() => import("../pages/admin/AdminSettings"))
    },
    {
        path: `${routePaths.ADMINDOCUMENTS}`,
        private: true,
        element: AdminDocumentsLayout
    },
    {
        path: `${routePaths.ADMINDROPDOWNS}`,
        private: true,
        element: lazy(() => import("../pages/admin/AdminDropDowns"))
    },
    {
        path: `${routePaths.ADMINLABELS}`,
        private: true,
        element: lazy(() => import("../pages/admin/AdminLabels"))
    },
    // {
    //     path: `${routePaths.ADMINLABELSEDIT}`,
    //     private: true,
    //     element: lazy(() => import("../pages/admin/AdminLabelsEdit"))
    // },
    
    {
        path: `${routePaths.ADMINFIELDS}`,
        private: true,
        element: lazy(() => import("../pages/admin/AdminFields"))
    },
    // {
    //     path: `${routePaths.ADMINFIELDSEDIT}`,
    //     private: true,
    //     element: lazy(() => import("../pages/admin/AdminFieldsEdit"))
    // },
    {
        path: `${routePaths.REPORTSVALIDATIONS}`,
        private: true,
        element: ReportsValidationsLayout
    },
    {
        path: `${routePaths.REPORTSVALIDATIONSEDIT}`,
        private: true,
        element: lazy(() => import("../pages/admin/ReportsValidationsEdit"))
    },
    {
        path: `${routePaths.REPORTSTEMPLATES}`,
        private: true,
        element: ReportsTemplatesLayout
    },
    {
        path: `${routePaths.AUDITCHANGEHISTORY}`,
        private: true,
        element: AuditTrailsLayout
    },
    {
        path: `${routePaths.AUDITRECYCLEBIN}`,
        private: true,
        element: AuditRecycleBinLayout
    },
    {
        path: `${routePaths.AUDITFIELDHISTORY}`,
        private: true,
        element: AuditFieldHistoryLayout
    },
    {
        path: `/`,
        private: true,
        element: lazy(() => import("../pages/admin/AdminFieldsForm"))
    },
    {
        path: `${routePaths.FINANCIALCALCULATIONS}`,
        private: true,
        element: FinancialCalculationsLayout
    },
    {
        path: `${routePaths.FINANCIALCALKEYFIGURES}`,
        private: true,
        element: FinancialKeyFiguresLayout
    },
    {
        path: `${routePaths.FINANCIALCALKEYFIGURESEDIT}`,
        private: true,
        element: lazy(() => import("../pages/admin/FinancialKeyFiguresEdit"))
    },
    {
        path: `${routePaths.FUNDWATERFALL}`,
        private: true,
        element: FinancialFundWaterfallLayout
    },
    {
        path: `${routePaths.GLOBALSEARCH}`,
        private: true,
        element: lazy(() => import("../pages/GlobalSearch"))
    },
    {
        path: `${routePaths.ADVISORYBOARD}`,
        private: true,
        element: lazy(() => import("../pages/AdvisoryBoard"))
    },
    {
        path: `${routePaths.COMPANYADVISORYBOARD}`,
        private: true,
        element: lazy(() => import("../pages/company/CompanyAdvisoryBoard"))
    },
    {
        path: `${routePaths.COMPANYSTRATEGYBOARD}`,
        private: true,
        element: lazy(() => import("../pages/company/CompanyStrategyBoard"))
    },   
];
