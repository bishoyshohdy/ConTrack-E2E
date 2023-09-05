import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { createGeofence } from "../../../api/geofences";
import { showsuccess } from "../../../helpers/toast-emitter";
import Map from "../../ui/map/map";
import ComplexTable from "../../ui/table/complex-table";
import { FaMapMarkedAlt } from "react-icons/fa";
import { extractGeoHeaders } from "../../../helpers/array-map";
import { Icon } from "@chakra-ui/icons";
import FunctionalModal from "../../ui/functional-modal/functional-modal";
import "./geofences.css";
import { DevicesContext } from "../../../context/devices";
import { hasPermission } from "../../../helpers/permissions-helper";
import { PERMISSIONS } from "../../../types/devices";

function Geofences() {
  const [geoFences, setGeofences] = useState([]);
  const [routes, setRoutes] = useState([]);

  const [update, setUpdate] = useState(false);
  const deviceCtx = useContext(DevicesContext);

  useEffect(() => {
    deviceCtx.getGeofencesCall();
  }, []);

  useEffect(() => {
    if (update) {
      deviceCtx && deviceCtx.getGeofencesCall() && deviceCtx.getRoutesCall();
      setUpdate(false);
    }
    deviceCtx.geofences &&
      setGeofences(
        
        deviceCtx.geofences.map((geo) => {
          return {
            ...geo,
            callBack: setUpdate,
          };
        })
      );
    deviceCtx.routes &&
      setRoutes(
        deviceCtx.routes.map((route) => {
          return {
            ...route,
            callBack: setUpdate,
          };
        })
      );
  }, [deviceCtx, update]);

  const onPolygonComplete = (polygon) => {
    const pointList = polygon.getPath().getArray();
    console.log(polygon.getPath().getArray());
    const resPolygon = [];
    pointList.forEach((element) => {
      resPolygon.push({ lat: element.lat(), lng: element.lng() });
    });
    console.log(resPolygon);
    setNewGeoPolygon(resPolygon);
  };
  const [newGeoName, setNewGeoName] = useState("");
  const [newGeoPolygon, setNewGeoPolygon] = useState([]);
  const createNewGeo = () => {
    createGeofence(
      newGeoName,
      newGeoPolygon.map((point) => [point.lat, point.lng])
    ).then((res) => {
      showsuccess("Successfully created new geofence");
      setUpdate(true);
    });
  };
  return (
    <>
      <Box
        p={2}
        className={"grid"}
        w={"100%"}
        h={"600px"}
        bg={"primary.80"}
        borderRadius={"5px"}
      >
        <Box className={"grid-item"} w={"100%"}>
          <ComplexTable
            title={"GeoFences"}
            extractFn={extractGeoHeaders}
            data={ hasPermission(PERMISSIONS.DELETE_GEOFENCES) || hasPermission(PERMISSIONS.EDIT_GEOFENCES) ?
              geoFences.map((geo) => {
              return {
                val: geo.name,
                id: geo.id,
                Geofence_Actions: { geofence: geo, geofences: geoFences },
              };
            })
          :
          geoFences.map((geo) => {
            return {
              val: geo.name,
              id: geo.id,
            };
          })
          }
            icon={
              <Icon as={FaMapMarkedAlt} boxSize={"30px"} color={"action.100"} />
            }
          >
            {hasPermission(PERMISSIONS.CREATE_GEOFENCES)&&
            (
              <FunctionalModal
              modalTitle={"Create Geofence"}
              btnTitle={"Create Geofence"}
              btnSize={"sm"}
              modalMinH={"700px"}
              modalMinW={"80%"}
              iconSize={"20px"}
              btnAction={
                <Button
                  isDisabled={
                    newGeoName.trim().length === 0 || newGeoPolygon.length === 0
                  }
                  onClick={createNewGeo}
                  bg={"primary.100"}
                  color={"text.primary"}
                >
                  Create Geofence
                </Button>
              }
              btnColor={"action.100"}
            >
              <Box
                gap={2}
                alignItems={"baseline"}
                justifyContent={"space-between"}
                as={Flex}
                mb={2}
                w={"100%"}
                bg={"primary.80"}
                borderRadius={"5px"}
              >
                <Text>Name:</Text>
                <Input
                  value={newGeoName}
                  onChange={(e) => setNewGeoName(e.target.value)}
                />
              </Box>
              <Box w={"100%"} h={"80%"} bg={"primary.80"} borderRadius={"5px"}>
                <Map
                  draw={true}
                  drawingComplete={onPolygonComplete}
                  zoom={14}
                  trips={false}
                  geofences={geoFences}
                />
              </Box>
            </FunctionalModal>
            )}

          </ComplexTable>
        </Box>
        <Box
          className={"grid-item"}
          w={"100%"}
          h={"100%"}
          bg={"primary.80"}
          borderRadius={"5px"}
        >
          <Map zoom={14} trips={false} geofences={geoFences} />
        </Box>
      </Box>
    </>
  );
}

export default Geofences;
