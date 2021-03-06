const API_URL = process.env.REACT_APP_API_URL;

const API_ENDPOINTS = {
    LOGIN: '/AuthAPI/UserLogin',
    CHANGEUSERPASSWORD: "/AuthAPI/ChangeUserPassword",
    LINKS: '/abcAPI/GetHelpfulLinks',
    ACCOUNTSUMMARIES : '/abcAPI/GetAccountSummaries',
    TODAYAGENDAS : '/abcAPI/GetTodaysAgendas',
    REMINDERS : '/abcAPI/GetClientTasks',
    RECENTACTIVITY : '/abcAPI/GetNotifications',
    GETCLIENTLEAVE : '/abcAPI/GetClientLeave',
    GETALLGLOBALCODES : '/api/GlobalCodeAPI/GetAllGlobalCodeRecords',
    GETALLMODIFIEDGLOBALCODES : '/api/GlobalCodeAPI/GetModifiedGlobalCodeRecords',
    GETALLACTIVEINACTIVEGLOBALCODES : '/api/GlobalCodeAPI/GetAllActiveInactiveGlobalCodeRecords',
    GETTABSOURCERECORDS : '/api/TabSourceAPI/GetTabSourceRecords',
    UPDATEGLOBALCODES : '/api/GlobalCodeAPI/Update',
}

export const getApiUrl = (key) => {
    return API_URL + API_ENDPOINTS[key];
}
export const source = process.env.REACT_APP_SOURCE;
export const TIMEOUT_IN_MINUTES = process.env.REACT_APP_TIMEOUT_IN_MINUTES;
export const TIMEOUT_IN_DAYS = process.env.REACT_APP_TIMEOUT_IN_DAYS;