import axios from './axios-default';
import { globalErrorHandler } from './api-helpers';
import { getToken, setAuthToken } from './user';
import { formatLocalToISOUTC } from '../helpers/array-map';

const baseUrl = 'api-v2/actions/audit-logs';
const scheduledReportsUrl = 'scheduled-reports/';

export function getOptions () {
    setAuthToken(getToken());
    return axios.get(baseUrl + '/options').catch(globalErrorHandler);
}

export function getData (entity, actionType, startDate, endDate, entityId, fields) {
    setAuthToken(getToken());
    let req = `?entity=${entity}`;
    if (actionType) {
        req = req + `&action_type=${actionType}`;
    }
    if (fields.length !== 0) {
        Object.keys(fields).forEach((key) => {
            if (fields[key] && fields[key].length !== 0) {
                req = req + '&' + key + '=' + fields[key];
            }
        });
    }
    if (startDate) {
        const startDateISO = formatLocalToISOUTC(startDate);
        const endDateISO = formatLocalToISOUTC(endDate);
        req = req + `&start_date=${startDateISO}&end_date=${endDateISO}`;
    }
    return axios.get(baseUrl + "/me" + req).catch(globalErrorHandler);
}

export function getElectricityOptions () {
    return axios.get(baseUrl + 'electricity/options');
}

export function getElectricityData (startDate, endDate, entityId) {
    const startDateISO = formatLocalToISOUTC(startDate);
    const endDateISO = formatLocalToISOUTC(endDate);
    return axios.get(baseUrl + `electricity?start_date=${startDateISO}&end_date=${endDateISO}&room=${entityId}`).catch(globalErrorHandler);
}

export function getScheduledReports () {
    return axios.get(scheduledReportsUrl).catch(globalErrorHandler);
}

export function getScheduledReportsOptions () {
    setAuthToken(getToken());
    return axios.get(scheduledReportsUrl + 'options').catch(globalErrorHandler);
}

export function createScheduledReports (scheduled_report_options, entity, actionType, fields) {
    let req = {};
    let report_query_params = {};
    if (actionType) {
        report_query_params['action_type'] = actionType;
    }
    if(entity){
        report_query_params['entity_type'] = entity + ''
    }
    if (fields && fields.length !== 0) {
        Object.keys(fields).forEach((key) => {
            if (fields[key] && fields[key].length !== 0) {
                report_query_params[key] = fields[key] + '';
            }
        });
    }
    req['report_query_params'] = report_query_params;
    req['scheduled_report_options'] = scheduled_report_options;
    setAuthToken(getToken());
    return axios.post(scheduledReportsUrl, req).catch(globalErrorHandler);
}
