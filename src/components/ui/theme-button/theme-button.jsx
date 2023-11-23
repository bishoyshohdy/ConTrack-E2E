import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import React, { useContext } from "react";
import { ThemeContext } from "../../../context/theme";

function ThemeButton() {
  const themCtx = useContext(ThemeContext);
  return (
    <IconButton
      aria-label="toggle dark mode"
      colorScheme="purple"
      color={"white"}
      rounded="full"
      size={"sm"}
      onClick={themCtx.toggleDarkMode}
      icon={themCtx.darkMode ? <SunIcon /> : <MoonIcon />}
    />
  );
}

export default ThemeButton;
