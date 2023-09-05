import { Select as ChakraSelect } from "@chakra-ui/select";
import React, { useContext } from "react";
import { ThemeContext } from "../../../context/theme";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import "./styled-select.css";

function StyledSelect({
  removeNoChoice,
  disabled = false,
  borderRadius = "10px",
  options,
  onchange,
  value,
  size,
  multi = false,
  placeholder,
}) {
  const { theme, darkMode } = useContext(ThemeContext);
  const animatedComponents = makeAnimated();
  const optsStyle = {
    backgroundColor: !theme.colors ? "transparent" : theme.colors.primary[100],
    color: !theme.colors ? "black" : theme.colors.text.primary,
    fontFamily: "DM Sans",
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: "10px",
    borderColor: "transparent",
  };

  return (
    <div>
      {!multi ? (
        <ChakraSelect
          isDisabled={disabled}
          bg={"primary.100"}
          borderWidth={"2px"}
          borderRadius={borderRadius}
          size={size}
          width={"100%"}
          color={"text.primary"}
          onChange={(e) => {
            onchange(e.target.value + "");
          }}
          value={value}
        >
          {!removeNoChoice && (
            <option style={optsStyle} value={-1}>
              --Choose an option--
            </option>
          )}
          {options &&
            options.map((ops) => {
              return (
                <option key={ops.value} style={optsStyle} value={ops.value}>
                  {ops.label.replaceAll("_", " ")}
                </option>
              );
            })}
        </ChakraSelect>
      ) : (
        options && (
          <Select
            isMulti
            theme={darkMode}
            className={darkMode ? "multi-select-dark" : "multi-select-light"}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                ...optsStyle,
              }),
              multiValueLabel: (styles, { data }) => ({
                ...styles,
                width: "300px",
              }),
            }}
            value={value}
            closeMenuOnSelect={false}
            components={animatedComponents}
            defaultValue={value}
            onChange={onchange}
            options={options}

            // id={id}
          />
        )
      )}
    </div>
  );
}
export default StyledSelect;
