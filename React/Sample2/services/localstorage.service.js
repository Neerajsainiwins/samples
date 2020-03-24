

import { TIMEOUT_IN_MINUTES, TIMEOUT_IN_DAYS } from '../config/api.config';

const LOCALSTORAGE_AUTH_USER = 'AuthUser';
const LOCALSTORAGE_TOKEN_KEY = 'AuthToken';
const LOCALSTORAGE_EXPIRES_AT = "ExpiresAt";
const LOCALSTORAGE_REMEMBER_ME = "RememberMe";


const getUserDetail = () => {

    let userDetailData = localStorage.getItem(LOCALSTORAGE_AUTH_USER);

    if (userDetailData)
        return JSON.parse(userDetailData);

    return null;
}

const storeAuthToken = (token) => {
    localStorage.setItem(LOCALSTORAGE_TOKEN_KEY, token);
}

const removeAuthToken = () => {
    localStorage.removeItem(LOCALSTORAGE_TOKEN_KEY);
}

const getAuthorizationToken = () => {
    return localStorage.getItem(LOCALSTORAGE_TOKEN_KEY);
}

const isAuthenticated = () => {
    if (localStorage.getItem(LOCALSTORAGE_AUTH_USER)) {
        if (localStorage.getItem(LOCALSTORAGE_EXPIRES_AT)) {
            if (IsPasswordActive()) {
                return true;
            }
            else {
                clearLocalStorage();
                return false;
            }
        }
        else {
            return true;
        }
    }
    return false;
}

const storeAuthUser = (data, remember = false) => {
    storeAuthToken(data.Token);
    delete data.Token;
    localStorage.setItem(LOCALSTORAGE_AUTH_USER, JSON.stringify(data));
    if (remember === true) {
        SetExpiresAtInDays();
    }
    else {
        SetExpiresAtInMinutes();
    }
}

const isRememberMeChecked = () => {
    return localStorage.getItem(LOCALSTORAGE_REMEMBER_ME) ? true : false;
}
const clearLocalStorage = () => {
    localStorage.clear();
}

const SetExpiresAtInMinutes = () => {
    var currentDate = new Date();
    currentDate.setMinutes(currentDate.getMinutes() + TIMEOUT_IN_MINUTES);
    var expiryMiliseconds = currentDate.getTime();
    localStorage.setItem(LOCALSTORAGE_EXPIRES_AT, String(expiryMiliseconds));
}

const SetExpiresAtInDays = () => {
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + TIMEOUT_IN_DAYS);
    var expiryMiliseconds = currentDate.getTime();
    localStorage.setItem(LOCALSTORAGE_EXPIRES_AT, String(expiryMiliseconds));
    localStorage.setItem(LOCALSTORAGE_REMEMBER_ME, "true");
}

const IsPasswordActive = () => {
    const expirtyTime = Number(localStorage.getItem(LOCALSTORAGE_EXPIRES_AT))
    const currentTime = new Date().getTime();
    if (expirtyTime > currentTime) {
        return true;
    }
    else {
        return false;
    }
}

export const localStorageService = {
    getUserDetail,
    getAuthorizationToken,
    isAuthenticated,
    storeAuthUser,
    clearLocalStorage,
    storeAuthToken,
    removeAuthToken,
    isRememberMeChecked,
    SetExpiresAtInMinutes,
    SetExpiresAtInDays,
    IsPasswordActive
}
