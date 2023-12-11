import React, { useEffect, useState, createContext } from "react";

const bigDipOruby = "#D70040";

const purple = "#2c3895";
const lightBlue = "#5cc8ff";
const lightOrange = "#ffd400";
const lightRed = "#e83151";
const lightGreen = "#9fd356";

const lightBlueDarken1 = "#039BE5";

const seaGreen = "#3E885B";
const yellowMunsell = "#E7C51C";
const smokyBlack = "#10100F";
const lightGray = "#CFD2D5";
const middleGray = "#898381";
const indigoBlue = "#2D4868";
const lapisLazuli = "#3b608aff";

const black = " #000000";
const royalbluedark = "#191d25";
const indigodye = "#9F7AEA";
const cgblue = "#1282a2ff";
const white = "#fefcfbff";

const lavenderweb = "#f8f9fa";
const periwinklecrayola2 = "#dee2e6";
const periwinklecrayola3 = "#ced4da77";
const lightsteelblue = "#adb5bd";
const babyblueeyes = "#6c757d";

const gradientColor1 = "rgb(155,41,231)";
const gradientColor2 = "rgb(119,22,237)";

const cardColor = `linear-gradient(90deg, ${gradientColor1} 0%, ${gradientColor2} 100%)`;

const gradientColor1_lo = "rgb(155,41,231, 0.8)";
const gradientColor2_lo = "rgb(119,22,237, 0.8)";

const purpleGrad = `linear-gradient(90deg, ${gradientColor1_lo} 0%, ${gradientColor2_lo} 100%)`;

const tablecellGray = "#2D3748";
const tablecelllight = "#f0f0f0";

//new Colors
const bosch_light_grey = "#e6e8eb";
const prim_blue = "#027bc0cc";
const sec_blue = "#229CE2";
const sec_blue_hover = "#0f8fd9";

const chat_bubble_light = "#F6F7FB";
const chat_bubble_dark = "#292d36";

const LIQUORICE = "#2d3748";

const purple1 = "#9b29e7";
const purple2 = "#9b29e7cc";

const purpleGradient = `linear-gradient(90deg, ${gradientColor1} 0%, ${gradientColor2} 100%)`;

const blueGrad1 = "rgb(34,156,226)";
const blueGrad2 = "rgb(0,86,145)";

const blueGrad = `linear-gradient(170deg, ${blueGrad1} 46%, ${blueGrad2} 100%)`;

const darkModeColors = {
  primary: {
    100: black,
    80: royalbluedark,
    60: indigodye,
    40: cgblue,
  },
  secondary: {
    100: lavenderweb,
    80: lightsteelblue,
    60: periwinklecrayola2,
    40: periwinklecrayola3,
    20: lightsteelblue,
    10: babyblueeyes,
  },
  success: {
    100: seaGreen,
  },
  warning: {
    100: yellowMunsell,
  },
  action: {
    100: purple1,
    80: purple1,
    60: purple2,
  },
  danger: {
    100: bigDipOruby,
  },
  text: {
    secondary: smokyBlack,
    gray: {
      100: lightGray,
      50: middleGray,
    },
    primary: white,
  },
  blue: {
    100: indigoBlue,
    50: lapisLazuli,
  },
  datetimepicker: {
    700: black,
    500: indigodye,
    200: cgblue,
  },
  chart: {
    100: purple,
    80: lightBlue,
    60: lightOrange,
    40: lightRed,
    20: lightGreen,
  },
  card: {
    100: LIQUORICE,
    80: purpleGrad,
    60: LIQUORICE,
    50: periwinklecrayola2,
  },
  company: {
    logo: periwinklecrayola2,
  },
  table: {
    cell: tablecellGray,
  },
  selected: {
    100: white,
  },
  chat: {
    bubble: chat_bubble_dark,
  },
};

const lightModeColors = {
  primary: {
    100: bosch_light_grey,
    80: white,
    60: periwinklecrayola2,
    40: periwinklecrayola3,
    20: lightsteelblue,
    10: babyblueeyes,
  },
  secondary: {
    100: black,
    80: royalbluedark,
    60: indigodye,
    40: periwinklecrayola3,
  },
  success: {
    100: seaGreen,
  },
  warning: {
    100: yellowMunsell,
  },
  action: {
    100: white,
    80: sec_blue,
    60: sec_blue_hover,
  },
  danger: {
    100: bigDipOruby,
  },
  text: {
    primary: smokyBlack,
    gray: {
      50: lightGray,
      100: middleGray,
    },
    secondary: white,
  },
  blue: {
    50: indigoBlue,
    100: lapisLazuli,
  },
  datetimepicker: {
    700: babyblueeyes,
    500: lightsteelblue,
    200: lavenderweb,
  },
  chart: {
    100: purple,
    80: lightBlue,
    60: lightOrange,
    40: lightRed,
    20: lightGreen,
  },
  card: {
    100: bosch_light_grey,
    80: blueGrad,
    60: periwinklecrayola3,
    50: cardColor,
  },
  company: {
    logo: periwinklecrayola2,
  },
  table: {
    cell: tablecelllight,
  },
  selected: {
    100: sec_blue,
  },
  chat: {
    bubble: chat_bubble_light,
  },
};

const ThemeContext = createContext();

function ThemeProvider(props) {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkmode") === "true"
  );
  const [theme, setTheme] = useState({});

  useEffect(() => {
    const colors = darkMode ? darkModeColors : lightModeColors;
    const theme = {
      colors,
      styles: {
        global: {
          body: {
            bg: "primary.100",
            fontFamily: "DM Sans",
          },
          html: {
            fontFamily: "DM Sans",
          },
          a: {
            color: "secondary.100",
            _hover: {
              textDecoration: "underline",
            },
          },
        },
      },
      components: {
        baseStyle: {
          Text: {
            primaryFontColor: "primary.100",
            secondaryFontColor: "secondary.100",
          },
        },
      },
    };
    setTheme(theme);
  }, [darkMode]);

  const toggleDarkMode = () => {
    const currentValue = localStorage.getItem("darkmode") === "true";
    localStorage.setItem("darkmode", !currentValue);
    setDarkMode(!currentValue);
  };

  return (
    <div>
      <ThemeContext.Provider value={{ theme, toggleDarkMode, darkMode }}>
        {props.children}
      </ThemeContext.Provider>
    </div>
  );
}

export { ThemeContext, ThemeProvider };
