import React, { useContext, useEffect, useState } from "react";
import { Flex, Box, Spacer } from "@chakra-ui/react";
import MenuItem from "./components/menu-item/menu-item";
import { useLocation } from "react-router";
import { sideBarData } from "../../../data/side-bar";
import Logo from "./components/logo/logo";
import LightLogo from "../../../assets/images/logo/logo-light.png";
import DarkLogo from "../../../assets/images/logo/logo-dark.png";
import DarkLogoSm from "../../../assets/images/logo/logo-sm-light.png";
import LightLogoSm from "../../../assets/images/logo/logo-sm-dark.png";
import { ThemeContext } from "../../../context/theme";
import useScreenSize from "../../../hooks/screen-size";
import { SCREEN_SIZE } from "../../../types/screen";
import AlexPortImg from "../../../assets/images/logo/alex-port-en.png";
import AlexPortDarkImg from "../../../assets/images/logo/alex-port-dark-en.png";
import { getUserInfo } from "../../../api/user";
import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi";
import "./side-bar.css";

export default function SideBar({ updateNavSize }) {
  const [navSize, changeNavSize] = useState("small");
  const getNavSize = () => {
    return navSize;
  };
  const location = useLocation();
  const size = useScreenSize();
  const { darkMode } = useContext(ThemeContext);
  const handleSidebarToggle = () => {
    changeNavSize(navSize === "small" ? "large" : "small");
    updateNavSize(navSize === "small" ? "large" : "small");
  };
  const [lightImage, setLightImage] = useState("");
  const [darkImage, setDarkImage] = useState("");

  useEffect(() => {
    if (getUserInfo()) {
      if (getUserInfo().customer === "customer1") {
        setLightImage(AlexPortImg);
        setDarkImage(AlexPortDarkImg);
      }
    }
  }, []);

  return (
    <>
      {size >= SCREEN_SIZE.LG && (
        <Box
          maxW={navSize === "small" ? "5%" : "17.9999%"}
          height={"100vh"}
          pt={2}
          bg={"primary.80"}
          left={0}
          position={"fixed"}
          zIndex={2}
          boxShadow={"lg"}
        >
          <Flex
            p={2}
            flexDir="column"
            w="100%"
            alignItems={"center"}
            as="nav"
            gap={2}
          >
            {navSize === "small" ? (
              <Logo
                h={"17%"}
                mt={4}
                mb={4}
                pl={2}
                pr={2}
                _hover={{ background: "none" }}
                logo={darkMode ? LightLogoSm : DarkLogoSm}
              />
            ) : (
              <>
                <Logo
                  w={"80%"}
                  h={"15%"}
                  mt={4}
                  mb={4}
                  _hover={{ background: "none" }}
                  logo={darkMode ? LightLogo : DarkLogo}
                />
              </>
            )}

            {sideBarData.data.map((ele) => {
              return (
                <MenuItem
                  key={ele.id}
                  navSize={navSize}
                  icon={ele.icon}
                  title={ele.name}
                  path={ele.path}
                  active={location.pathname === ele.path}
                  choices={ele.choices}
                />
              );
            })}

            <Spacer />
            <Spacer />
            <Spacer />
            <Spacer />

            <Box onClick={handleSidebarToggle} w="100%">
              <MenuItem
                navSize={navSize}
                icon={navSize === "small" ? FiChevronsRight : FiChevronsLeft}
                title={"Collapse Sidebar"}
              />
            </Box>
          </Flex>
        </Box>
      )}
    </>
  );
}
