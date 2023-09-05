import axios from './axios-default';
import { globalErrorHandler } from './api-helpers';
import { getToken, setAuthToken } from './user';

const baseUrl = 'notifications/';
const settingsUrl = 'settings';
const optionsUrl = '/options';

export function getNotificationsSettings () {
    setAuthToken(getToken());
    return axios.get(baseUrl + settingsUrl).catch(globalErrorHandler);
}

export function getNotificationsSettingsOptions () {
    setAuthToken(getToken());
    return axios.get(baseUrl + settingsUrl + optionsUrl).catch(globalErrorHandler);
}

export function editNotificationsSettings (body) {
    setAuthToken(getToken());
    return axios.put(baseUrl + settingsUrl, body).catch(globalErrorHandler);
}
