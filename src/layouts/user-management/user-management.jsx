import React from 'react';
import { UsersProvider } from '../../context/users';
import { Outlet } from 'react-router-dom';

function UserManagementLayout () {
    return (
        <UsersProvider>
            <Outlet />
        </UsersProvider>
    );
}

export default UserManagementLayout;
