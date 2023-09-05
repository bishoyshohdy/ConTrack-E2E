import axios from './axios-default';
import { globalErrorHandler } from './api-helpers';
import { getToken, setAuthToken } from './user';
import { hasPermission } from "../helpers/permissions-helper";
import { PERMISSIONS } from '../types/devices';

const baseUrl = 'alarms';
const settingsUrl = 'settings';
const assignUrl = 'assign/';

export function getAlarms (filters) {
    setAuthToken(getToken());
    let filterStr = '/';
    if (filters) {
        filterStr += '?';
        Object.keys(filters).forEach((key, index) => {
            if (filters[key]) {
                filterStr += `${key}=${filters[key]}`;
                if (index < Object.keys(filters).length - 1) {
                    filterStr += '&';
                }
            }
        });
    }
    return axios.get(baseUrl + filterStr).catch(globalErrorHandler);
}

export function getAlarmsTypes () {
    setAuthToken(getToken());
    const hasPerm = hasPermission(PERMISSIONS.GET_ALARMS_TYPES)
    if( hasPerm !== null && hasPerm !== undefined)
    {
        return axios.get(baseUrl + '/types?entity_type=device').catch(globalErrorHandler);
    }
    const promise = new Promise((resolve, reject) => {
        resolve({"data":[]});
      });
    return promise
    
}

export function getAlarmSettings () {
    return axios.get(baseUrl + '/' + settingsUrl).catch(globalErrorHandler);
}

export function getAlarmSettingsByEntity (id) {
    return axios.get(baseUrl + '/' + assignUrl + settingsUrl + `?entity_id=${id}&enabled=1`).catch(globalErrorHandler);
}

export function assignAlarmSettingToEntity (alarmSettingId, listOfEntityIds) {
    return axios.post(baseUrl + '/' + assignUrl + settingsUrl, {
        alarm_settings_id: alarmSettingId, list_of_entity_ids: listOfEntityIds
    }).catch(globalErrorHandler);
}

export function createAlarmSetting (alarmType, configurations, severity, enabled) {
    return axios.post(baseUrl + '/' + settingsUrl, {
        alarm_type: alarmType, configurations, severity, enabled
    }).catch(globalErrorHandler);
}

export function editAlarmSetting (editObject) {
    return axios.put(baseUrl + '/' + settingsUrl, editObject).catch(globalErrorHandler);
}

export function actionAlarm (alarmId, action) {
    return axios.put(baseUrl + '/', { alarm_id: alarmId, status: action}).catch(globalErrorHandler);
}

export function deleteAlarmSettings(alarmSettingId) {
    return axios.delete(baseUrl + '/settings',  { data: { alarm_settings_id: alarmSettingId }});
}
