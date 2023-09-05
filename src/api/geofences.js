import { globalErrorHandler } from "./api-helpers";
import { hasPermission } from "../helpers/permissions-helper";
import axios from "./axios-default";
import { getToken, setAuthToken } from "./user";
import { PERMISSIONS } from "../types/devices";

const baseUrl = "api-v2/spatial";
const geofencesUrl = "/geofences-v2";
const deviceGeofencesUrl = "/device-geofences-v2";
const routesUrl = "/routes-v2";
const tripsUrl = "/trips-v2";

export function getGeofences() {
  const hasPerm = hasPermission(PERMISSIONS.GET_GEOFENCES);
  setAuthToken(getToken());
  if (hasPerm !== null && hasPerm !== undefined) {
    return axios.get(baseUrl + geofencesUrl).catch(globalErrorHandler);
  }
  const promise = new Promise((resolve, reject) => {
    resolve({ data: { geofences: [] } });
  });
  return promise;
}

export function createGeofence(name, polygon) {
  return axios
    .post(baseUrl + geofencesUrl, {
      name,
      polygon,
      customer_id: 1,
    })
    .catch(globalErrorHandler);
}

export function deleteGeofence(id) {
  return axios
    .delete(baseUrl + geofencesUrl + `/${id}`, { data: { customer_id: 1 } })
    .catch(globalErrorHandler);
}

export function editGeofence(id, polygon) {
  return axios
    .put(baseUrl + geofencesUrl + `/${id}`, {
      polygon,
      customer_id: 1,
    })
    .catch(globalErrorHandler);
}

export function getDeviceGeofences(id) {
  return axios
    .get(baseUrl + deviceGeofencesUrl + `?device_id=${id}`)
    .catch(globalErrorHandler);
}

export function addGeofenceToDevice(
  geofenceId,
  deviceId,
  deviceType,
  geofenceType
) {
  return axios
    .post(baseUrl + deviceGeofencesUrl, {
      customer_id: 1,
      geofence_id: parseInt(geofenceId),
      device_type: deviceType,
      geofence_type: geofenceType,
      device_id: deviceId,
    })
    .catch(globalErrorHandler);
}

export function deleteDeviceGeofence(deviceId, geofenceId) {
  return axios
    .delete(baseUrl + deviceGeofencesUrl + `/${deviceId}/${geofenceId}`, {
      data: { customer_id: 1 },
    })
    .catch(globalErrorHandler);
}

export function editDeviceGeofence(deviceId, geofenceId, active) {
  return axios
    .put(baseUrl + deviceGeofencesUrl, {
      device_id: deviceId,
      geofence_id: parseInt(geofenceId),
      active: active !== "false",
    })
    .catch(globalErrorHandler);
}

export function getRoutes() {
  const hasPerm = hasPermission(PERMISSIONS.GET_ROUTES);
  setAuthToken(getToken());
  if (hasPerm !== null && hasPerm !== undefined) {
    return axios.get(baseUrl + routesUrl).catch(globalErrorHandler);
  }
  const promise = new Promise((resolve, reject) => {
    resolve({ data: { geofences: [] } });
  });
  return promise;
}

export function createRoute(name, points) {
  return axios
    .post(baseUrl + routesUrl, {
      name,
      points,
    })
    .catch(globalErrorHandler);
}

export function deleteRoute(id) {
  return axios.delete(baseUrl + routesUrl + `/${id}`).catch(globalErrorHandler);
}

export function getTripsByDevice(deviceId) {
  const hasPerm = hasPermission(PERMISSIONS.GET_DEVICE_TRIP);
  if (hasPerm !== null && hasPerm !== undefined) {
    return axios
      .get(baseUrl + tripsUrl + `?device_id=${deviceId}`)
      .catch(globalErrorHandler);
  }
  const promise = new Promise((resolve, reject) => {
    resolve({ data: { trips: [] } });
  });
  return promise;
}

export function addTrip(routeId, deviceId, startDate) {
  return axios
    .post(baseUrl + tripsUrl, {
      route_id: parseInt(routeId),
      device_id: deviceId,
      device_type: "cycollector",
      start_date: startDate,
    })
    .catch(globalErrorHandler);
}

export function changeTripStatus(tripId, status) {
  return axios
    .put(baseUrl + tripsUrl + `/${tripId}`, { status })
    .catch(globalErrorHandler);
}
