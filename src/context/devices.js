import React, { useEffect, useState, createContext } from "react";

import {
  getAllContainers,
  getContainerStat,
  getDevices,
  getTelemetry,
} from "../api/devices";
import { getGeofences, getRoutes } from "../api/geofences";
import { DEVICES, PERMISSIONS } from "../types/devices";
import { useJsApiLoader } from "@react-google-maps/api";
import { hasPermission } from "../helpers/permissions-helper";

const DevicesContext = createContext();

const libraries = ["places", "drawing"];

function DevicesProvider(props) {
  const [devicesObj, setDevices] = useState({
    devices: { cycollector: [], cytag: [], cypower: [], band: [], pir: [] },
    types: [],
  });
  const [containers, setContainers] = useState([]);
  const [geofences, setGeofences] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [location, setLocation] = useState();
  const [statToday, setStatToday] = useState();
  const [statYesterday, setStatYesterday] = useState();
  const [statLastWeek, setStatLastWeek] = useState();
  const [statLastMonth, setStatLastMonth] = useState();

  const { isLoaded } = useJsApiLoader({
    id: "google-map-routes",
    googleMapsApiKey: process.env.REACT_APP_GOOGLEMAPS_API_KEY_ROUTES,
    libraries,
  });
  useEffect(() => {
    getDevicesCall();
    getContainersCall();
    // getGeofencesCall();
    // getRoutesCall();
    getContainerStatsCall();
    const intervalId = setInterval(() => {
      // getDevicesCall();
      // getContainersCall();
      // getGeofencesCall();
      // getRoutesCall();
      getContainerStatsCall();
    }, 60000);
    getCurrentLocation();
    return () => clearInterval(intervalId);
  }, []);
  const getContainerStatsCall = () => {
    if (hasPermission(PERMISSIONS.GET_REPORTS_STATS)) {
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      const lastWeek = new Date();
      lastWeek.setDate(today.getDate() - 7);
      const lastMonth = new Date();
      lastMonth.setMonth(today.getMonth() - 1);
      getContainerStat().then((res) => {
        setStatToday(res.data.data);
      });
      getContainerStat(yesterday.toISOString().split("T")[0]).then((res) => {
        setStatYesterday(res.data.data);
      });
      getContainerStat(lastWeek.toISOString().split("T")[0]).then((res) => {
        setStatLastWeek(res.data.data);
      });
      getContainerStat(lastMonth.toISOString().split("T")[0]).then((res) => {
        setStatLastMonth(res.data.data);
      });
    }
  };
  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  };
  const getContainersCall = () => {
    getAllContainers().then((res) => {
      setContainers(res.data);
    });
  };
  const getDevicesCall = () => {
    getDevices().then((res) => {
      setDevices({
        devices: res.data.devices,
        types: res.data.device_types.map((type) => {
          if (type === DEVICES.CYCOLLECTOR) {
            return "cylock";
          } else {
            return type;
          }
        }),
      });
    });
  };
  const getTelemetryData = (imei, startDate, endDate) => {
    getTelemetry(imei, startDate, endDate).then((res) => {
      return res.data.data;
    });
  };
  const getDevice = (name, type) => {
    const cylocks = [];
    const cytags = [];
    const cypowers = [];
    const cybands = [];
    const pirs = [];

    if (devicesObj.devices.cycollector) {
      cylocks.push(...devicesObj.devices.cycollector);
    }
    if (devicesObj.devices.cytag) {
      cytags.push(...devicesObj.devices.cytag);
    }
    if (devicesObj.devices.cypower) {
      cypowers.push(...devicesObj.devices.cypower);
    }
    if (devicesObj.devices.band) {
      cybands.push(...devicesObj.devices.band);
    }
    if (devicesObj.devices.pir) {
      pirs.push(...devicesObj.devices.pir);
    }
    if (devicesObj) {
      switch (type) {
        case DEVICES.CYCOLLECTOR:
          return cylocks.find((dev) => dev.name === name);
        case DEVICES.CYTAG:
          return cytags.find((dev) => dev.name === name);
        case DEVICES.CYPOWER:
          return cypowers.find((dev) => dev.name === name);
        case DEVICES.CYBAND:
          return cybands.find((dev) => dev.name === name);
        case DEVICES.PIR:
          return pirs.find((dev) => dev.name === name);
        default:
          return [...cytags, ...cylocks, ...cypowers, ...pirs, ...cybands].find(
            (dev) => dev.name === name
          );
      }
    }
  };
  const getDeviceById = (id, type) => {
    const cylocks = [];
    const cytags = [];
    const cypowers = [];
    const cybands = [];
    const pirs = [];

    if (devicesObj.devices.cycollector) {
      cylocks.push(...devicesObj.devices.cycollector);
    }
    if (devicesObj.devices.cytag) {
      cytags.push(...devicesObj.devices.cytag);
    }
    if (devicesObj.devices.cypower) {
      cypowers.push(...devicesObj.devices.cypower);
    }
    if (devicesObj.devices.band) {
      cybands.push(...devicesObj.devices.band);
    }
    if (devicesObj.devices.pir) {
      pirs.push(...devicesObj.devices.pir);
    }
    if (devicesObj) {
      switch (type) {
        case DEVICES.CYCOLLECTOR:
          return cylocks.find((dev) => dev.id === id);
        case DEVICES.CYTAG:
          return cytags.find((dev) => dev.id === id);
        case DEVICES.CYPOWER:
          return cypowers.find((dev) => dev.id === id);
        case DEVICES.CYBAND:
          return cybands.find((dev) => dev.id === id);
        case DEVICES.PIR:
          return pirs.find((dev) => dev.id === id);
        default:
          return [...cylocks, ...cytags, ...cypowers, ...cybands, ...pirs].find(
            (dev) => dev.id === id
          );
      }
    }
  };

  const getRelatedCyband = (cypowerId) => {
    return devicesObj.devices.band
      ? devicesObj.devices.band
          .filter((bd) => bd.Controller && bd.Controller.id === cypowerId)
          .map((dev) => {
            return { ...dev, id: dev.bluetooth_id };
          })
      : [];
  };

  const getRelatedPir = (cypowerId) => {
    return devicesObj.devices.pir
      ? devicesObj.devices.pir
          .filter((pr) => pr.cypower && pr.cypower.id === cypowerId)
          .map((dev) => {
            return { ...dev, id: dev.mac_address };
          })
      : [];
  };

  const getGeofencesCall = () => {
    getGeofences().then((res) => {
      setGeofences(
        res.data.geofences.map((geo) => {
          return {
            ...geo,
            center: { lat: geo.center[0], lng: geo.center[1] },
            polygon: geo.polygon.map((latlng) => {
              return { lat: latlng[0], lng: latlng[1] };
            }),
            editMode: false,
            edit: null,
            callBack: null,
          };
        })
      );
    });
  };

  const getRoutesCall = () => {
    getRoutes().then((res) => {
      setRoutes(
        res.data.routes.map((route) => {
          return {
            ...route,
            points: route.points.map((latlng) => {
              return { lat: latlng[0], lng: latlng[1] };
            }),
            editMode: false,
            edit: null,
            callBack: null,
          };
        })
      );
    });
  };

  const getAssignedCytags = (cycollectorId) => {
    if (devicesObj) {
      return devicesObj.devices.cytag
        ? devicesObj.devices.cytag.filter(
            (dev) => dev.cycollector_id === cycollectorId
          )
        : [];
    }
  };

  return (
    <div>
      <DevicesContext.Provider
        value={{
          statToday,
          statYesterday,
          statLastWeek,
          statLastMonth,
          isLoaded,
          devicesObj,
          getDevice,
          getTelemetryData,
          getDeviceById,
          getAssignedCytags,
          getDevicesCall,
          geofences,
          getGeofencesCall,
          routes,
          getRoutesCall,
          containers,
          getContainersCall,
          location,
          getRelatedCyband,
          getRelatedPir,
        }}
      >
        {props.children}
      </DevicesContext.Provider>
    </div>
  );
}
export { DevicesContext, DevicesProvider };
