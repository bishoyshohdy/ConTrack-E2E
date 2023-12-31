import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  SkeletonText,
  Text,
  useRadioGroup,
} from "@chakra-ui/react";
import { FaLocationArrow, FaTimes } from "react-icons/fa";
import {
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
  PolylineF,
} from "@react-google-maps/api";
import ComplexMarker from "../../ui/map/marker/complex-marker";
import "./routes-map.css";
import { DevicesContext } from "../../../context/devices";
import Polygon from "../map/polygon/polygon";
import { ThemeContext } from "../../../context/theme";
import StyledSelect from "../styled-select/styled-select";
import { path1, path2 } from "../map/paths-test";
import { MdReplay } from "react-icons/md";
import { BsFillPlayFill, BsFillPauseFill } from "react-icons/bs";
import { RadioCard } from "../radio-card/radio-card";

function RoutesMap({
  markers = [],
  routes = [],
  geofences = [],
  setRoute = false,
  zoom = 14,
  drawingComplete,
  children,
  tripChoices,
  trips,
  Trips,
}) {
  const deviceCtx = useContext(DevicesContext);
  const [center, setCenter] = useState();
  useEffect(() => {
    if (markers.length === 1) {
      setCenter(markers[0].position);
    } else if (deviceCtx && deviceCtx.location) {
      setCenter(deviceCtx.location);
    }
  }, [markers, deviceCtx]);

  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef();
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destiantionRef = useRef();

  if (!deviceCtx | !deviceCtx.isLoaded) {
    return <SkeletonText />;
  }

  async function calculateRoute() {
    if (originRef.current.value === "" || destiantionRef.current.value === "") {
      return;
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destiantionRef.current.value,
      provideRouteAlternatives: true,
      optimizeWaypoints: true,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
    drawingComplete(
      results.routes[0].overview_path.map((obj) => {
        return [obj.lat(), obj.lng()];
      })
    );
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    originRef.current.value = "";
    destiantionRef.current.value = "";
  }
  const options = {
    strokeColor: "#191d25",
    strokeOpacity: 1,
    strokeWeight: 4,
    fillColor: "#191d25",
    fillOpacity: 1,
    clickable: true,
    draggable: false,
    editable: false,
    visible: true,
    radius: 300000,
  };

  const darkMapStyle = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#263c3f" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6b9a76" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212a37" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9ca5b3" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#746855" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#1f2835" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#f3d19c" }],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#2f3948" }],
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#515c6d" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#17263c" }],
    },
    {
      zoomControl: true,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: true,
    },
  ];

  const theme = useContext(ThemeContext);
  const Theme = theme.darkMode ? darkMapStyle : null;

  const mapOptions = {
    styles: Theme,
  };

  return (
    <>
      <Flex
        position="relative"
        flexDirection="column"
        alignItems="center"
        h="100%"
        w="100%"
      >
        {setRoute ? (
          <Box
            p={4}
            borderRadius="lg"
            m={4}
            bgColor="primary.80"
            shadow="base"
            minW="100%"
          >
            <HStack spacing={2} justifyContent="space-between">
              <Box flexGrow={1}>
                <Autocomplete>
                  <Input
                    type="text"
                    color={"text.primary"}
                    border={"1px solid #aaaa"}
                    placeholder="Origin"
                    ref={originRef}
                  />
                </Autocomplete>
              </Box>
              <Box flexGrow={1}>
                <Autocomplete>
                  <Input
                    color={"text.primary"}
                    border={"1px solid #aaaa"}
                    type="text"
                    placeholder="Destination"
                    ref={destiantionRef}
                  />
                </Autocomplete>
              </Box>
              <Box flexGrow={1}>{children}</Box>
              <ButtonGroup>
                <Button
                  bg="action.80"
                  color={"white"}
                  _hover={{ bg: "action.60" }}
                  type="submit"
                  onClick={calculateRoute}
                >
                  Calculate Route
                </Button>
                <IconButton
                  bg={"danger.100"}
                  color={"white"}
                  _hover={{ opacity: 0.8 }}
                  aria-label="center back"
                  icon={<FaTimes color={"text.primary"} />}
                  onClick={clearRoute}
                />
              </ButtonGroup>
            </HStack>
            <HStack spacing={4} mt={4} justifyContent="space-between">
              <Text color={"text.primary"}>Distance: {distance} </Text>
              <Text color={"text.primary"}>Duration: {duration} </Text>
              <IconButton
                bg={"action.80"}
                _hover={{ bg: "action.60" }}
                color={"white"}
                aria-label="center back"
                icon={<FaLocationArrow color={"text.primary"} />}
                isRound
                onClick={() => {
                  map.panTo(center);
                  map.setZoom(15);
                }}
              />
            </HStack>
          </Box>
        ) : (
          tripChoices
        )}
        <Box h="100%" w="100%">
          {/* Google Map Box */}
          {deviceCtx && deviceCtx.isLoaded && (
            <GoogleMap
              center={center}
              zoom={zoom}
              mapContainerStyle={{
                minHeight: "500px",
                width: "100%",
                height: "90%",
              }}
              options={mapOptions}
              onLoad={(map) => setMap(map)}
            >
              {routes &&
                routes.map((route) => {
                  return (
                    <PolylineF
                      key={route.id}
                      path={route.points}
                      options={options}
                    />
                  );
                })}
              {markers.map((marker, index) => {
                return (
                  <>
                    <ComplexMarker key={index} marker={marker} />
                  </>
                );
              })}
              {geofences.map((geofence) => {
                return (
                  <Polygon
                    key={geofence.id}
                    center={geofence.center}
                    name={geofence.name}
                    oldpath={geofence.polygon}
                    editMode={geofence.editMode}
                    editAction={geofence.edit}
                  />
                );
              })}
              <Marker position={center} />
              {directionsResponse && (
                <DirectionsRenderer
                  options={{
                    polylineOptions: options,
                    draggable: true,
                    hideRouteList: false,
                  }}
                  directions={directionsResponse}
                />
              )}
            </GoogleMap>
          )}
        </Box>
      </Flex>
    </>
  );
}

export default RoutesMap;
