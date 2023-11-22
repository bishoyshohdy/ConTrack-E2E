import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Heading,
  Spacer,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  ButtonGroup,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { createGeofence } from "../../../api/geofences";
import { editGeofence } from "../../../api/geofences";
import { showsuccess } from "../../../helpers/toast-emitter";
import Map from "../../ui/map/map";
import GeofenceTable from "../../ui/table/geofence-table";
import { extractGeoHeaders } from "../../../helpers/array-map";
import { Icon } from "@chakra-ui/icons";
import "./geofences.css";
import { DevicesContext } from "../../../context/devices";
import { hasPermission } from "../../../helpers/permissions-helper";
import { PERMISSIONS } from "../../../types/devices";
import { deleteGeofence } from "../../../api/geofences";
import EditGeofence from "../../pages/geofences/edit-geofence/edit-geofence";
import DeleteGeofence from "../../pages/geofences/delete-geofence/delete-geofence";
import { FaMapMarkedAlt, FaEye } from "react-icons/fa";
import { use } from "marked";
import { MdAdd } from "react-icons/md";

function Geofences() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const [geoFences, setGeofences] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [update, setUpdate] = useState(false);
  const deviceCtx = useContext(DevicesContext);
  const [selectedGeofence, setSelectedGeofence] = useState(null);
  const [selectedGeofences, setSelectedGeofences] = useState(null);
  const [newGeoName, setNewGeoName] = useState("");
  const [editGeoName, setEditGeoName] = useState(null);
  const [isCreatingGeoFence, setIsCreatingGeoFence] = useState(false);
  const [isEditingGeoFence, setIsEditingGeoFence] = useState(false);
  const [isViewingGeoFence, setIsViewingGeoFence] = useState(false);
  // Rerender the Map component when creating a new geofence or editing an existing one
  const [mapKey, setMapKey] = useState(0);

  const createGeofencePermission = hasPermission(PERMISSIONS.CREATE_GEOFENCES);
  const viewGeofencesPermission = hasPermission(PERMISSIONS.GET_GEOFENCES);
  useEffect(() => {
    deviceCtx.getGeofencesCall();
  }, [update]);

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

  const [newGeoPolygon, setNewGeoPolygon] = useState([]);
  const createNewGeo = () => {
    createGeofence(
      newGeoName,
      newGeoPolygon.map((point) => [point.lat, point.lng])
    ).then((res) => {
      showsuccess("Successfully created new geofence");
      setUpdate(true);
      setNewGeoName("");
      setNewGeoPolygon([]);
      geo.callBack(true);
    });
  };

  const editGeoFenceAction = () => {
    editGeofence(
      selectedGeofence.id,
      selectedGeofence.polygon.map((point) => [point.lat, point.lng]),
      editGeoName
    ).then((res) => {
      showsuccess("Successfully updated geofence");
      selectedGeofence.callBack(true);
    });
  };

  const handleViewClick = (geofences, geofence) => {
    setSelectedGeofence(geofence);
    setSelectedGeofences(geofences);
    setEditGeoName(geofence.name);
    setIsViewingGeoFence(true);
    onClose();
  };

  return (
    <>
      {selectedGeofence !== null && (
        <Card
          borderRadius={"30px 30px 30px 30px"}
          minW={"250px"}
          minH={"200px"}
          position={"absolute"}
          zIndex={2}
          top={"12%"}
          left={"2%"}
          bg={"#2d3748"}
          color="secondary.100"
          border="2px solid #2d3748"
          maxW={"250px"}
          backgroundColor={"primary.80"}
          borderColor={"primary.60"}
          _hover={{
            backgroundColor: "primary.100",
            borderColor: "primary.60",
          }}
        >
          <Flex justifyContent={"start"} gap={2}>
            <Button
              colorScheme="red"
              variant="solid"
              size="sm"
              ml={2}
              mt={4}
              mr={4}
              pos={"absolute"}
              right={"0px"}
              top={"0px"}
              onClick={() => {
                setSelectedGeofence(null);
                setSelectedGeofences(null);
                setIsViewingGeoFence(false);
                setUpdate(true);
                setMapKey((prevKey) => prevKey + 1);
              }}
              borderRadius={"50%"}
            >
              <Text>X</Text>
            </Button>
          </Flex>
          <CardHeader mt={8} pb={"10px"}>
            <Flex alignItems={"center"}>
              <Heading size="md" mb={"10px"}>
                <Text mb={2} fontSize={"xl"}>
                  {selectedGeofence.name}
                </Text>
                <Text fontSize={"lg"}>ID: {selectedGeofence.id}</Text>
              </Heading>
              <Spacer />
            </Flex>
            <hr style={{ width: "60%", color: "blue" }} />
          </CardHeader>

          <CardBody pt={"10px"} pb={"0px"} pr={"0px"}>
            <Flex justifyContent={"start"} gap={2}>
              <EditGeofence
                geofence={selectedGeofence}
                geofences={selectedGeofence}
                setIsEditingGeoFence={setIsEditingGeoFence}
                setMapKey={setMapKey}
                setUpdate={setUpdate}
                setSelectedGeofence={setSelectedGeofence}
                setSelectedGeofences={setSelectedGeofences}
              />

              <DeleteGeofence
                name={selectedGeofence.name}
                callBack={selectedGeofence.callBack}
                id={selectedGeofence.id}
                deleteAction={deleteGeofence}
                onDelete={() => setMapKey((prevKey) => prevKey + 1)}
                setMapKey={setMapKey}
                setUpdate={setUpdate}
                setIsViewingGeoFence={setIsViewingGeoFence}
                setSelectedGeofence={setSelectedGeofence}
                setSelectedGeofences={setSelectedGeofences}
              />
            </Flex>
          </CardBody>
        </Card>
      )}

      <ButtonGroup
        isAttached
        zIndex={2}
        position={"absolute"}
        bottom={"4%"}
        left={"50%"}
        transform={"translateX(-50%)"}
      >
        {createGeofencePermission &&
          !isCreatingGeoFence &&
          !isEditingGeoFence &&
          !isViewingGeoFence && (
            <Button
              colorScheme="purple"
              border={"1px solid #ffff"}
              borderRadius={"full"}
              variant="solid"
              size={"lg"}
              onClick={() => {
                setIsCreatingGeoFence(true);
                setUpdate(true);
                // Rerender the Map component
                setMapKey((prevKey) => prevKey + 1);
              }}
            >
              <Icon as={MdAdd} w={5} h={5} me={{ base: "0", md: "2" }} />
              <Text display={{ base: "none", md: "block" }}>
                Create GeoFence
              </Text>
            </Button>
          )}
        {viewGeofencesPermission &&
          !isCreatingGeoFence &&
          !isEditingGeoFence &&
          !isViewingGeoFence && (
            <>
              <Button
                ref={btnRef}
                border={"1px solid #ffff"}
                borderRadius={"full"}
                colorScheme="purple"
                variant="solid"
                size={"lg"}
                onClick={onOpen}
              >
                <Icon as={FaEye} w={5} h={5} me={{ base: "0", md: "2" }} />
                <Text display={{ base: "none", md: "block" }}>
                  View GeoFences
                </Text>
              </Button>

              <Drawer
                isOpen={isOpen}
                placement="bottom"
                onClose={onClose}
                finalFocusRef={btnRef}
              >
                <DrawerOverlay />
                <DrawerContent
                  bg={"primary.80"}
                  color={"text.primary"}
                  borderRadius={"10px"}
                >
                  <DrawerCloseButton />
                  <DrawerBody>
                    <GeofenceTable
                      title={"GeoFences"}
                      extractFn={extractGeoHeaders}
                      data={
                        hasPermission(PERMISSIONS.DELETE_GEOFENCES) ||
                        hasPermission(PERMISSIONS.EDIT_GEOFENCES)
                          ? geoFences.map((geo) => {
                              return {
                                val: geo.name,
                                id: geo.id,
                                Geofence_Actions: {
                                  geofence: geo,
                                  geofences: geoFences,
                                },
                              };
                            })
                          : geoFences.map((geo) => {
                              return {
                                val: geo.name,
                                id: geo.id,
                              };
                            })
                      }
                      handleViewClick={handleViewClick}
                      setIsEditingGeoFence={setIsEditingGeoFence}
                      setMapKey={setMapKey}
                      setUpdate={setUpdate}
                      setSelectedGeofence={setSelectedGeofence}
                      setSelectedGeofences={setSelectedGeofences}
                    ></GeofenceTable>
                  </DrawerBody>

                  <DrawerFooter></DrawerFooter>
                </DrawerContent>
              </Drawer>
            </>
          )}
      </ButtonGroup>

      <Box>
        {isCreatingGeoFence ? (
          <Box
            zIndex={2}
            position={"absolute"}
            mx={5}
            mt={14}
            mb={5}
            bg={"primary.80"}
            color={"text.primary"}
            borderRadius={"10px"}
            p={3}
          >
            {/* Title */}
            <Text
              fontSize={"xl"}
              fontWeight={"bold"}
              color={"text.primary"}
              mb={2}
            >
              Create new geofence
            </Text>

            <Text
              fontSize={"lg"}
              fontWeight={"bold"}
              color={"text.primary"}
              mb={2}
            >
              Name:
            </Text>
            <Input
              mb={2}
              placeholder={"Enter name"}
              value={newGeoName}
              onChange={(e) => setNewGeoName(e.target.value)}
            />
            <Button
              btnSize={"md"}
              mr={3}
              mt={2}
              mb={1}
              onClick={() => {
                setNewGeoName("");
                setNewGeoPolygon([]);
                setIsCreatingGeoFence(false);
                setUpdate(true);
                // Rerender the Map component
                setMapKey((prevKey) => prevKey + 1);
              }}
            >
              <Text>Cancel</Text>
            </Button>
            <Button
              btnSize={"md"}
              mr={3}
              mb={1}
              mt={2}
              iconBtn={MdAdd}
              iconSize={"20px"}
              isDisabled={
                newGeoName.trim().length === 0 || newGeoPolygon.length === 0
              }
              onClick={() => {
                createNewGeo();
                setIsCreatingGeoFence(false);
                setUpdate(true);
                // Rerender the Map component
                setMapKey((prevKey) => prevKey + 1);
              }}
              colorScheme="purple"
            >
              <Text>Create</Text>
            </Button>
          </Box>
        ) : null}

        {isEditingGeoFence ? (
          <Box
            zIndex={2}
            position={"absolute"}
            mx={"16%"}
            mt={14}
            mb={5}
            bg={"primary.80"}
            color={"text.primary"}
            borderRadius={"10px"}
            p={3}
          >
            <Text
              fontSize={"lg"}
              fontWeight={"bold"}
              color={"text.primary"}
              mb={2}
            >
              Edit name:
            </Text>
            <Input
              mb={2}
              value={
                editGeoName === null
                  ? selectedGeofence
                    ? selectedGeofence.name
                    : ""
                  : editGeoName
              }
              placeholder={selectedGeofence ? selectedGeofence.name : ""}
              onChange={(e) => setEditGeoName(e.target.value)}
            />
            <Button
              btnSize={"md"}
              mr={3}
              mt={2}
              mb={1}
              onClick={() => {
                setNewGeoName("");
                setNewGeoPolygon([]);
                setIsEditingGeoFence(false);
                setEditGeoName(null);
                setUpdate(true);
                // Rerender the Map component
                setMapKey((prevKey) => prevKey + 1);
              }}
            >
              <Text>Cancel</Text>
            </Button>
            <Button
              btnSize={"md"}
              mr={3}
              mb={1}
              mt={2}
              iconSize={"20px"}
              isDisabled={
                editGeoName === null
                  ? selectedGeofence
                    ? selectedGeofence.name.trim().length === 0
                    : ""
                  : editGeoName.trim().length === 0
              }
              onClick={() => {
                editGeoFenceAction();
                setNewGeoName("");
                setNewGeoPolygon([]);
                setEditGeoName(null);
                setIsEditingGeoFence(false);
                setUpdate(true);
                // Rerender the Map component
                setMapKey((prevKey) => prevKey + 1);
              }}
              colorScheme="purple"
            >
              <Text>Edit</Text>
            </Button>
          </Box>
        ) : null}

        <Map
          key={mapKey}
          zoom={selectedGeofence ? 16 : 12}
          trips={false}
          geofences={selectedGeofences ? [selectedGeofence] : geoFences}
          oldCenter={selectedGeofence ? selectedGeofence.center : null}
          drawingComplete={isCreatingGeoFence ? onPolygonComplete : null}
          draw={isCreatingGeoFence ? true : isEditingGeoFence ? true : false}
        />
      </Box>
    </>
  );
}

export default Geofences;
