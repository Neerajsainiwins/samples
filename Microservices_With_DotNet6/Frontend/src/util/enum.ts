export enum ModalTypes {
    Create = "Create",
    Task = "Task",
    Meeting = "Meeting"
}


export enum ModuleTypes {
    Company = "Company",
    Contact = "Contact",
    SuperAdmin = "SuperAdmin"
}

export enum ModuleName {
    Initial = "Initial",
    SuperAdmin = "SuperAdmin",
    ModuleAccess = "ModuleAccess",
    AdminTenant = "AdminTenant",
    UserList = "UserList",
    RoleList = "RoleList",
    AdminDropDowns = "AdminDropDowns",
    AdminFields = "AdminFields"

}

export enum ModalProperty {
    Show = "Show",
    Close = "Close"
}


export enum SuperAdminTab {
    SuperAdmins = "Super admins",
    TenantDetails = "Tenant details",
    MouleAccess = "Module access"
}


export enum TabButtons {
    SaveInfo = "Save info",
    EditInfo = "Edit info",
    DeleteInfo = "Delete tenant",

}


export enum UserRoles {
    Owner = "Owner",
    GeneralUser = "General user",
    Admin = "Admin",
    SuperAdmin = "Super admin"
}


export enum PermissionKeys {
    ReadPermission = "ReadPermission",
    EditPermission = "EditPermission",
    CreatePermission = "CreatePermission",
    DeletePermission = "DeletePermission",
    ExcelPermission = "ExcelPermission"
}

export enum LoaderSizes  {
    VerySmall = 24,
    Small = 30,
    Medium = 40,
    Large = 60
 };

 export enum FieldType{
    Amount = "Amount",
    FreeText = "Free Text",
    AutoSuggestMultipleContacts ="Auto Suggest Multiple Contacts",
    url = "Url",
    Number="Number",
    SingleSelectDropdownList = "Single Select Dropdown List",
    MultipleSelectDropdownList ="Multiple Select Dropdown List",
    Date = "Date",
    Boolean = "Boolean",
    RichText = "Rich Text"
 }