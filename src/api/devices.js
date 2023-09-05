import axios from "./axios-default";
import { getToken, setAuthToken } from "./user";
import { globalErrorHandler } from "./api-helpers";
import { formatLocalToISOUTC } from "../helpers/array-map";

const baseURL = "api-v2/";
const hotelsURL = "hotel/";
const bandsURL = "bands";

export async function getDevices() {
  setAuthToken(getToken());
  return axios.get(baseURL + "devices/").catch(globalErrorHandler);
}

export function getTelemetry(imei, startDate, endDate, offset, limit) {
  const startDateISO = formatLocalToISOUTC(startDate);
  const endDateISO = formatLocalToISOUTC(endDate);
  setAuthToken(getToken());
  let url = `devices/${imei}`;
  const params = {};
  if (startDate) {
    params.start_date = startDateISO;
  }
  if (endDate) {
    params.end_date = endDateISO;
  }
  if (offset) {
    params.offset = offset;
  }
  if (limit) {
    params.limit = limit;
  }
  return axios.get(baseURL + url, { params }).catch(globalErrorHandler);
}

export function exportTelemetry(imei, startDate, endDate) {
  const startDateISO = formatLocalToISOUTC(startDate);
  const endDateISO = formatLocalToISOUTC(endDate);
  setAuthToken(getToken());
  let url = `devices/devices-details-export/${imei}`;
  const params = {};
  if (startDate) {
    params.start_date = startDateISO;
  }
  if (endDate) {
    params.end_date = endDateISO;
  }
  return axios
    .get(baseURL + url, { responseType: "blob" }, { params })
    .catch(globalErrorHandler);
}

export function changeLockStatus(imei, status) {
  return axios
    .post(baseURL + "actions/cylock/lock-action", {
      IMEI: imei,
      Status: status,
    })
    .catch(globalErrorHandler);
}

export function getBands() {
  return axios.get(hotelsURL + bandsURL).catch(globalErrorHandler);
}

export function getAllContainers() {
  setAuthToken(getToken());
  return axios
    .get(baseURL + "actions/cylock/unlock/status")
    .catch(globalErrorHandler);
}

export function getContainerStat(startDate) {
  setAuthToken(getToken());
  let req = "actions/containers-stats";
  if (startDate) {
    req = req + `?start_date=${startDate}`;
  }
  return axios.get(baseURL + req).catch(globalErrorHandler);
}

export function getDeviceTypes() {
  setAuthToken(getToken());
  return axios
    .get(baseURL + "actions/cylock/unlock/status")
    .catch(globalErrorHandler);
}

export function getDeviceTypesById(deviceId) {
  setAuthToken(getToken());
  return axios
    .get(baseURL + `messages/types?device_id=${deviceId}`)
    .catch(globalErrorHandler);
}

export function getMessagesWithType(type, limit, device, startDate, endDate) {
  let req = `api-v2/messages/?device_id=${device}`;
  if (typeof type === "string") {
    req += `&msg_type=${type}`;
  } else {
    req += `&msg_type=${type.toString()}`;
  }
  if (startDate && endDate) {
    req += `&start_date=${startDate}&end_date=${endDate}`;
  } else {
    req += `&number_of_msgs=${limit}`;
  }
  return axios.get(req).catch(globalErrorHandler);
}
