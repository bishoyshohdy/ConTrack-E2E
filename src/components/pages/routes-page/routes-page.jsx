import { Box, Button, Input } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icons";
import React, { useEffect, useState, useContext } from "react";

import { DevicesContext } from "../../../context/devices";
import { extractRouteHeaders } from "../../../helpers/array-map";
import FunctionalModal from "../../ui/functional-modal/functional-modal";
import RoutesMap from "../../ui/routes-map/routes-map";
import ComplexTable from "../../ui/table/complex-table";
import { FaMapMarkedAlt } from "react-icons/fa";
import { createRoute } from "../../../api/geofences";
import { showsuccess } from "../../../helpers/toast-emitter";
import { hasPermission } from "../../../helpers/permissions-helper";
import { PERMISSIONS } from "../../../types/devices";

function RoutesPage() {
  const deviceCtx = useContext(DevicesContext);
  const [routes, setRoutes] = useState([]);
  const [update, setUpdate] = useState(false);
  const [name, setName] = useState("");
  const [points, setPoints] = useState([]);
  const [markers, setMarkers] = useState([]);
  useEffect(() => {
    deviceCtx.getRoutesCall();
  }, []);
  useEffect(() => {
    if (update) {
      deviceCtx.getRoutesCall();
      setUpdate(false);
    }
    deviceCtx &&
      deviceCtx.routes &&
      setRoutes(
        deviceCtx.routes.map((route) => {
          return {
            ...route,
            callBack: setUpdate,
          };
        })
      );
    setMarkers(
      routes
        .map((route) => {
          return route.points.length !== 0
            ? [
                {
                  msg: `${route.name} origin`,
                  name: "A",
                  position: route.points[0],
                },
                {
                  msg: `${route.name} Destination`,
                  name: "B",
                  position: route.points[route.points.length - 1],
                },
              ]
            : [];
        })
        .flat()
    );
  }, [update, deviceCtx]);

  const createRouteAction = () => {
    createRoute(name, points).then((res) => {
      showsuccess("Successfully created new route");
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
            title={"Routes"}
            extractFn={extractRouteHeaders}
            data={routes.map((geo) => {
              if (hasPermission(PERMISSIONS.DELETE_ROUTES)) {
                return {
                  val: geo.name,
                  id: geo.id,
                  Route_Actions: { geofence: geo, geofences: routes },
                };
              }else{
                return {
                  val: geo.name,
                  id: geo.id,
                };
              }
              
            })}
            icon={
              <Icon as={FaMapMarkedAlt} boxSize={"30px"} color={"action.100"} />
            }
          >
            {hasPermission(PERMISSIONS.CREATE_ROUTES) &&(
            <FunctionalModal
            modalTitle={"Create Route"}
            btnTitle={"Create Route"}
            btnSize={"sm"}
            modalMinH={"1000px"}
            modalMinW={"80%"}
            iconSize={"20px"}
            btnAction={
              <Button
                onClick={createRouteAction}
                bg={"primary.100"}
                color={"text.primary"}
              >
                Create Route
              </Button>
            }
            btnColor={"action.100"}
          >
                          <Box
                w={"100%"}
                h={"100%"}
                bg={"transparent"}
                borderRadius={"5px"}
              >
                <RoutesMap
                  markers={markers}
                  drawingComplete={setPoints}
                  routes={routes}
                  setRoute
                >
                  <Input
                    placeholder="Route Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </RoutesMap>
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
          <RoutesMap markers={markers} routes={routes} />
        </Box>
      </Box>
    </>
  );
}

export default RoutesPage;
