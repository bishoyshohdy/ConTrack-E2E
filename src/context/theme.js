import React, { useEffect, useState, createContext } from 'react';

const bigDipOruby = '#D70040';

const purple = '#2c3895';
const lightBlue = '#5cc8ff';
const lightOrange = '#ffd400';
const lightRed = '#e83151';
// const hanPurple = '#628C8F';
const lightGreen = '#9fd356';

const lightBlueDarken1 = '#039BE5';

const seaGreen = '#3E885B';
const yellowMunsell = '#E7C51C';
const smokyBlack = '#10100F';
const lightGray = '#CFD2D5';
const middleGray = '#898381';
const indigoBlue = '#2D4868';
const lapisLazuli = '#3b608aff';

const oxfordblue = ' #000000';
const royalbluedark = '#191d25';
const indigodye = '#9F7AEA';
const cgblue = '#1282a2ff';
const white = '#fefcfbff';

const lavenderweb = '#f8f9fa';
const periwinklecrayola2 = '#dee2e6';
const periwinklecrayola3 = '#ced4da';
const lightsteelblue = '#adb5bd';
const babyblueeyes = '#6c757d';

const cardColor = '#1b254b';

const tablecellGray = '#2D3748';
const tablecelllight = '#f0f0f0';

const purple1 = "#9b29e7";

const darkModeColors = {
    primary: {
        100: oxfordblue,
        80: royalbluedark,
        60: indigodye,
        40: cgblue
    },
    secondary: {
        100: lavenderweb,
        80: lightsteelblue,
        60: periwinklecrayola2,
        40: periwinklecrayola3,
        20: lightsteelblue,
        10: babyblueeyes
    },
    success: {
        100: seaGreen
    },
    warning: {
        100: yellowMunsell
    },
    action: {
        100: purple1
    },
    danger: {
        100: bigDipOruby
    },
    text: {
        secondary: smokyBlack,
        gray: {
            100: lightGray,
            50: middleGray
        },
        primary: white
    },
    blue: {
        100: indigoBlue,
        50: lapisLazuli
    },
    datetimepicker: {
        700: oxfordblue,
        500: indigodye,
        200: cgblue
    },
    chart: {
        100: purple,
        80: lightBlue,
        60: lightOrange,
        40: lightRed,
        20: lightGreen
    },
    card: {
        100: cardColor,
        50: periwinklecrayola2
    },
    company: {
        logo: periwinklecrayola2
    },
    table: {
        cell: tablecellGray
    }
};

const lightModeColors = {
    primary: {
        100: lavenderweb,
        80: lightsteelblue,
        60: periwinklecrayola2,
        40: periwinklecrayola3,
        20: lightsteelblue,
        10: babyblueeyes
    },
    secondary: {
        100: oxfordblue,
        80: royalbluedark,
        60: indigodye,
        40: cgblue
    },
    success: {
        100: seaGreen
    },
    warning: {
        100: yellowMunsell
    },
    action: {
        100: lightBlueDarken1
    },
    danger: {
        100: bigDipOruby
    },
    text: {
        primary: smokyBlack,
        gray: {
            50: lightGray,
            100: middleGray
        },
        secondary: white
    },
    blue: {
        50: indigoBlue,
        100: lapisLazuli
    },
    datetimepicker: {
        700: babyblueeyes,
        500: lightsteelblue,
        200: lavenderweb
    },
    chart: {
        100: purple,
        80: lightBlue,
        60: lightOrange,
        40: lightRed,
        20: lightGreen
    },
    card: {
        100: periwinklecrayola2,
        50: cardColor
    },
    company: {
        logo: periwinklecrayola2
    },
    table: {
        cell: tablecelllight
    }
};

const ThemeContext = createContext();

function ThemeProvider (props) {
    const [darkMode, setDarkMode] = useState(localStorage.getItem('darkmode') === 'true');
    const [theme, setTheme] = useState({});

    useEffect(() => {
        const colors = darkMode ? darkModeColors : lightModeColors;
        const theme = {
            colors,
            styles: {
                global: {
                    body: {
                        bg: 'primary.100',
                        fontFamily: 'DM Sans'
                    },
                    html: {
                        fontFamily: 'DM Sans'
                    },
                    a: {
                        color: 'secondary.100',
                        _hover: {
                            textDecoration: 'underline'
                        }
                    }
                }
            },
            components: {
                baseStyle: {
                    Text: {
                        primaryFontColor: 'primary.100',
                        secondaryFontColor: 'secondary.100'
                    }
                }
            }
        };
        setTheme(theme);
    }, [darkMode]);

    const toggleDarkMode = () => {
        const currentValue = localStorage.getItem('darkmode') === 'true';
        localStorage.setItem('darkmode', !currentValue);
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
