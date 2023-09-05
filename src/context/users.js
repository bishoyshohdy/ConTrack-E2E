import React, { useEffect, useState, createContext } from "react";
import { getAllUsers, getMyUser } from "../api/user-management";

const UsersContext = createContext();

function UsersProvider(props) {
  const [users, setUsers] = useState([]);
  const [devices, setDevices] = useState([]);
  const [allRoles, setRoles] = useState([]);
  const [deviceRoles, setDeviceRoles] = useState([]);

  useEffect(() => {
    getDevicesCall();
    getUsersCall();
  }, []);

  const getUsersCall = () => {
    getAllUsers().then((res) => {
      setUsers(res.data.users);
    });
  };
  const getDevicesCall = () => {
    getMyUser().then((res) => {
      setRoles(res.data.user.roles);
      setDevices(res.data.user.devices);
      const devRoles = res.data.user.devices
        .map((dev) => {
          return dev.roles;
        })
        .flat();
      const uniqueDevRoles = [];
      devRoles.forEach((r) => {
        const index = uniqueDevRoles.findIndex((dev) => dev.id === r.id);
        // eslint-disable-next-line no-unused-expressions
        index === -1 ? uniqueDevRoles.push(r) : null;
      });
      setDeviceRoles(uniqueDevRoles);
    });
  };
  const getOneUser = (username) => {
    return users.find((user) => user.user_name === username);
  };

  return (
    <div>
      <UsersContext.Provider
        value={{
          users,
          allRoles,
          devices,
          deviceRoles,
          getUsersCall,
          getDevicesCall,
          getOneUser,
        }}
      >
        {props.children}
      </UsersContext.Provider>
    </div>
  );
}
export { UsersContext, UsersProvider };
