import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const RouteGuard = ({ condition, redirect }) => {
    if (!condition) {
        return <Navigate to={redirect} replace />;
    }

    return <Outlet />;
};
export default RouteGuard;
