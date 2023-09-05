import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RouteGuard from './helpers/route-guard';
import { isLoggedIn } from './api/user';
import MainLayout from './layouts/main/main';
import Dashboard from './components/pages/dashboard/dashboard';
import Users from './components/pages/users/users';
import Login from './components/pages/authentication/login/login';
import Device from './components/pages/device/device';
import Reports from './components/pages/reports/reports';
import CytagPage from './components/pages/cytag-page/cytag-page';
import DeviceManagement from './components/pages/device-management/device-management';
import UserPage from './components/pages/users/user-page/user-page';
import { hasPermission } from './helpers/permissions-helper';
import { PERMISSIONS } from './types/devices';
import Geofences from './components/pages/geofences/geofences';
import AlarmsSettings from './components/pages/alarms-settings/alarms-settings';
import Notifications from './components/pages/notifications/notifications';
import ScheduledReports from './components/pages/reports/scheduled-reports/scheduled-reports';
import RoutesPage from './components/pages/routes-page/routes-page';

function Routers () {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route element={<RouteGuard condition={isLoggedIn()} redirect={'/login'} />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/device/:Id/:identifier" element={<Device />} />
                        <Route path="/device/Cytag/:Id/:identifier" element={<CytagPage />} />
                        <Route element={<RouteGuard condition={hasPermission(PERMISSIONS.GET_USERS)} redirect={'/'} />}>
                            <Route path="users" element={<Users />} />
                            <Route path="/users/:id" element={<UserPage />} />
                        </Route>
                        <Route element={<RouteGuard condition={hasPermission(PERMISSIONS.GET_GEOFENCES)} redirect={'/'} />}>
                            <Route path="geofences" element={<Geofences />} />
                        </Route>
                        <Route path="routes" element={<RoutesPage />} />
                        <Route path="reports" element={<Reports />} />
                        <Route path="alarms-settings" element={<AlarmsSettings />} />
                        <Route path="notifications" element={<Notifications />} />
                        
                        <Route path="devices" element={<DeviceManagement />} />
                        <Route path="/scheduled-reports" element={<ScheduledReports />} />
                    </Route>
                    <Route path='/login' element={<Login />}/>
                </Route>
            </Routes>
        </Router>
    );
}
export default Routers;
