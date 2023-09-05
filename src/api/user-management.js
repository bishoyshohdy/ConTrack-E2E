import axios from './axios-default';
import { globalErrorHandler } from './api-helpers';
import { getToken, setAuthToken } from './user';

const baseURL = 'api-v2/';

export async function getAllUsers () {
    setAuthToken(getToken());
    return axios.get(baseURL + 'users/').catch(globalErrorHandler);
}

export async function createUser (username, password, name, email, roles, devices) {
    setAuthToken(getToken());
    return axios.post(baseURL + 'users/', {
        user_name: username,
        password,
        name,
        email,
        roles,
        devices
    }).catch(globalErrorHandler);
}

export async function getMyUser () {
    setAuthToken(getToken());
    return axios.get(baseURL + 'users/me').catch(globalErrorHandler);
}

export async function assignRoles (userId, roles, devices) {
    setAuthToken(getToken());
    return axios.put(baseURL + 'users/roles', {
        user_id: userId,
        role_id_list: roles,
        device_id_list: devices,
    }).catch(globalErrorHandler);
}

export async function editUserDeviceRoles (user, device, roles) {
    setAuthToken(getToken());
    return axios.put(baseURL + 'devices/roles', {
        user_id: user, device_id: device, role_id_list: roles
    }).catch(globalErrorHandler);
}
