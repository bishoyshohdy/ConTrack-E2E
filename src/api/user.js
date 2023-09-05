import axios from 'axios';
import { CUSTOMERS } from '../types/customers';

const baseUrl = process.env.REACT_APP_SERVER_URL + 'api-v2/';

export function setAuthToken (token) {
    if (token) {
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else { delete axios.defaults.headers.common.Authorization; }
}

export function isLoggedIn () {
    return !!localStorage.getItem('auth.token');
}
export function getToken () {
    return localStorage.getItem('auth.token');
}
export function getUser () {
    localStorage.getItem('user_info');
}

export function saveToken (token) {
    localStorage.setItem('auth.token', token);
}

export function saveTermsAndConditionsFlag (customer) {
    localStorage.setItem(`accept.terms.${customer}`, true);
}

export function acceptedTermsAndConditions (customer) {
    return localStorage.getItem(`accept.terms.${customer}`);
}

export function hasTermsAndConditions (customer) {
    return customer === CUSTOMERS.BOSCH;
}

export function saveUserData (data) {
    localStorage.setItem('user_info', JSON.stringify(data));
}

export function getUserInfo () {
    const user = JSON.parse(localStorage.getItem('user_info'));
    return user || {};
}

export function signOut () {
    localStorage.removeItem('auth.token');
    window.location.href = '/login';
}

export async function firstStepLogin (username, password) {
    const loginPayload = { user_name: username, password };
    return axios.post(baseUrl + 'authorization/login', loginPayload).then(res => {
        return {
            token: res.data.access_token,
            userInfo: res.data.user_info
        }
    });
}

export async function secondStepLogin (token, userInfo) {
    setAuthToken(token);
    saveToken(token);
    saveUserData(userInfo);
    saveTermsAndConditionsFlag(userInfo.customer);
    window.location.href = '/';
}

export async function login (username, password) {
    const loginPayload = { user_name: username, password };
    return axios.post(baseUrl + 'authorization/login', loginPayload).then(res => {
        const token = res.data.access_token;
        setAuthToken(token);
        saveToken(token);
        saveUserData(res.data.user_info);
        window.location.href = '/';
    });
}
