import { globalErrorHandler } from './api-helpers';
import axios from './axios-default';
import { getToken, setAuthToken } from './user';

export function createCycollector ({ id, name }) {
    return axios.post('thuraya/cycollector', {
        IMEI: id,
        cycollector_name: name
    }).catch(globalErrorHandler);
}

export function deleteCycollector ({ id }) {
    return axios.post('thuraya/cycollector', {
        IMEI: id
    }).catch(globalErrorHandler);
}

export function createCytag ({ id, name }) {
    return axios.post('cytags', {
        ble_id: id,
        name
    }).catch(globalErrorHandler);
}

export function deleteCytag ({ id }) {
    return axios.delete('cytags', {
        ble_id: id
    }).catch(globalErrorHandler);
}

export function assignCytag (cytagId, cycollectorId) {
    setAuthToken(getToken());
    return axios.put('/api-v2/actions/cylock/assign-tags', { device_id: cycollectorId, cytags: [{ ble_id: cytagId }] }).catch(globalErrorHandler);
}

export function unAssignCytag (cytagId, cycollectorId) {
    setAuthToken(getToken());
    return axios.delete('/api-v2/actions/cylock/assign-tags', { data: { device_id: cycollectorId, cytags: [{ ble_id: cytagId }] } }).catch(globalErrorHandler);
}

export function CreateDeviceUserRole({imei,DeviceType,userChosen,roleChosen,deviceName}){
    setAuthToken(getToken());
    return axios.post('/api-v2/devices/crud',{device_id:imei,device_type_id:DeviceType,user_id:Number(userChosen),role_id:Number(roleChosen),device_name:deviceName}).then((res)=>{console.log(res)}).catch(globalErrorHandler);
}