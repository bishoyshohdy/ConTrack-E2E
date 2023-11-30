import { Center } from "@chakra-ui/react";
import React from "react";
import { useEffect, useContext, useState } from "react";
import Chart from "react-apexcharts";
import { ThemeContext } from "../../../../context/theme";

function LineChart({ ops, data }) {
  const Theme = useContext(ThemeContext);
  const [color, setColor] = useState(Theme.darkMode ? "#9b29e7" : "#229CE2");
  const [opsFiltered, setOpsFiltered] = useState({ ...ops });
  //re-render when theme changes
  useEffect(() => {
    setColor(Theme.darkMode ? "#9b29e7" : "#229CE2");
    setOpsFiltered((opsFiltered) => ({
      ...opsFiltered,
      colors: [color],
    }));
  }, [Theme.darkMode, color]);
  return (
    <>
      {data.length !== 0 ? (
        <Chart
          options={opsFiltered}
          series={data}
          type="area"
          width="100%"
          height="500px"
        />
      ) : (
        <Center mt={10} color={"text.primary"}></Center>
      )}
    </>
  );
}

export default LineChart;
