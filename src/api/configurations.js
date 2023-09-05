import axios from './axios-default';
import { globalErrorHandler } from './api-helpers';

axios.defaults.headers.common.Authorization = null;

export function getDeviceConfigurations (imei) {
    return axios
        .get(`configurations/cycollectors/${imei}`)
        .catch(globalErrorHandler);
}

export function getPreDeviceConfigurations (imei) {
    return axios
        .get(`device/configuration?IMEI=${imei}`)
        .catch(globalErrorHandler);
}

export function getDeviceModes (imei) {
    return axios.get(`device/mode?IMEI=${imei}`).catch(globalErrorHandler);
}

export function getFirmwareLastUpdate (imei) {
    return axios
        .get(
            `https://beyti.cypod.solutions:5000/remote/update/version?IMEI=${imei}`
        )
        .catch(globalErrorHandler);
}

export function editDeviceMode (IMEI, mode) {
    return axios
        .post('/device/configuration', {
            IMEI,
            conf_id: mode
        })
        .catch(globalErrorHandler);
}

export function editDeviceConfigurations (
    IMEI,
    gpsInterval,
    scanInterval,
    mode
) {
    return axios
        .post('device/mode', {
            IMEI,
            gps_interval: gpsInterval,
            mode,
            scan_interval: scanInterval
        })
        .catch(globalErrorHandler);
}

export function editDeviceThresholds (
    IMEI,
    minTempThreshold,
    maxTempThreshold,
    minHumidityThreshold,
    maxHumidityThreshold,
    minLightThreshold,
    maxLightThreshold
) {
    return axios
        .post('device/thresholds', {
            IMEI,
            min_temp_threshold: minTempThreshold,
            max_temp_threshold: maxTempThreshold,
            min_humidity_threshold: minHumidityThreshold,
            max_humidity_threshold: maxHumidityThreshold,
            min_light_threshold: minLightThreshold,
            max_light_threshold: maxLightThreshold
        })
        .catch(globalErrorHandler);
}

export function getWifiUsername (imei) {
    return axios.get(`cycollector/wifi?IMEI=${imei}`).catch(globalErrorHandler);
}

export function changeWifiConfigrations (imei, username, password) {
    return axios
        .post('cycollector/wifi', {
            IMEI: imei,
            Username: username,
            Password: password
        })
        .catch(globalErrorHandler);
}

export function assignCytag (cytagId, cycollectorId) {
    return axios.put(`cytags/${cytagId}`, { cycollector_id: cycollectorId });
}

export function deleteAssignedCytag (cytagId) {
    return axios.delete(`cytags/${cytagId}`);
}

export function uploadFirmWareFile (imei, file, version) {
    const bodyFormData = new FormData();
    bodyFormData.append('File', file);
    bodyFormData.append('IMEI', imei);
    bodyFormData.append('version', version);
    return axios({
        method: 'post',
        url: 'remote/update',
        data: bodyFormData,
        headers: {
            'Content-Type': `multipart/form-data; boundary=${bodyFormData._boundary}`
        }
    }).catch(globalErrorHandler);
}

export function getDeviceAlarmInterval (imei) {
    return axios.get(`device/mode?IMEI=${imei}`).catch(globalErrorHandler);
}
export function editDeviceAlarmInterval (IMEI, alarmInterval) {
    return axios
        .post('/api-v2/cycollector/update', {
            imei: IMEI,
            update_type: 'alarm_interval',
            update_value: parseInt(alarmInterval)
        })
        .catch(globalErrorHandler);
}
