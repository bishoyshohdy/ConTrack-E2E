import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import React, { useContext } from "react";
import { ThemeContext } from "../../../context/theme";

function ThemeButton() {
  const themCtx = useContext(ThemeContext);
  return (
    <IconButton
      aria-label="toggle dark mode"
      bg= {"primary.100"} 
      _hover={{ bg: "action.60" }}
      color={"text.primary  "}
      rounded="full"
      size={"md"}
      onClick={themCtx.toggleDarkMode}
      icon={themCtx.darkMode ? <SunIcon /> : <MoonIcon />}
    />
  );
}

export default ThemeButton;
