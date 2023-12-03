import { CircularProgress, Flex } from "@chakra-ui/react";
import React, { Suspense, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "../../components/ui/nav-bar/nav-bar";
import SideBar from "../../components/ui/side-bar/side-bar";
import "./admin.css";
const UserManagementLayout = React.lazy(() =>
  import("../user-management/user-management")
);

function AdminLayout() {
  const location = useLocation().pathname;
  // Define a state variable to store the navSize
  const [navSize, setNavSize] = useState("small");
  const style = {
    scrollbar: {
      width: "10px",
    },
    scrollbarTrack: {
      backgroundColor: "#222", /* Dark background color */
    },
    scrollbarThumb: {
      backgroundColor: "#444", /* Dark thumb color */
    },
    scrollbarThumbHover: {
      backgroundColor: "#666", /* Dark thumb color on hover */
    },

  };

  // Function to update the navSize state
  const updateNavSize = (newNavSize) => {
    setNavSize(newNavSize);
  };
  return (
    <div
    // style={
    //   {
    //     scrollbar: {
    //       width: "10px",
    //     },
    //     scrollbarTrack: {
    //       backgroundColor: "#222", /* Dark background color */
    //     },
    //     scrollbarThumb: {
    //       backgroundColor: "#444", /* Dark thumb color */
    //     },
    //     scrollbarThumbHover: {
    //       backgroundColor: "#666", /* Dark thumb color on hover */
    //     },
        
    //   }
    // }
    >
      <Flex w="100%">
        <SideBar updateNavSize={updateNavSize} />
        {navSize === "small" ? (
          <div className="app-container">
            <NavBar />
            <div className={"main-app"}>
              {location.includes("/users") ? (
                <Suspense
                  fallback={
                    <CircularProgress isIndeterminate color="action.100" />
                  }
                >
                  <UserManagementLayout />
                </Suspense>
              ) : (
                <Outlet />
              )}
            </div>
          </div>
        ) : (
          <div className="app-container-sm">
            <NavBar />
            <div className={"main-app"}>
              {location.includes("/users") ? (
                <Suspense
                  fallback={
                    <CircularProgress isIndeterminate color="action.100" />
                  }
                >
                  <UserManagementLayout />
                </Suspense>
              ) : (
                <Outlet />
              )}
            </div>
          </div>
        )}
      </Flex>
    </div>
  );
}

export default AdminLayout;
