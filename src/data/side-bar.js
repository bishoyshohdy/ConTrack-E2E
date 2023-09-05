import { FiHome, FiUser } from 'react-icons/fi';
import { FaMapMarkedAlt, FaRoute } from 'react-icons/fa';
import { HiDocumentReport } from 'react-icons/hi';
import { RiDeviceLine } from 'react-icons/ri';
import { hasPermission } from '../helpers/permissions-helper';
import { PERMISSIONS } from '../types/devices';
import { BiAlarm } from 'react-icons/bi';
import { TbNotification } from 'react-icons/tb';

// const [navSize, changeNavSize] = useState('small');
// navSize = 'small';

export const sideBarData = {
    data: [
        {
            id: 1,
            name: 'Dashboard',
            path: '/',
            icon: FiHome,
            choices: [
                { key: 'cyconnectors', name: 'Cyconnectors' },
                { key: 'cylocks', name: 'CyLocks' }
            ]
        },
        {
            id: 2,
            name: 'Reports',
            path: '/reports',
            icon: HiDocumentReport
        },
        {
            id: 7,
            name: 'Devices Management',
            path: '/devices',
            icon: RiDeviceLine
        },

        {
            id: 6,
            name: 'Notification Settings',
            path: '/notifications',
            icon: TbNotification
        },

    ]
};

if (hasPermission(PERMISSIONS.GET_ALARMS_SETTINGS) && hasPermission(PERMISSIONS.GET_ALARMS_TYPES) ) {
    sideBarData.data.push(        {
        id: 5,
        name: 'Alarms Settings',
        path: '/alarms-settings',
        icon: BiAlarm
    });
}

if (hasPermission(PERMISSIONS.GET_ROUTES)) {
    sideBarData.data.push({
    
            id: 4,
            name: 'Routes',
            path: '/routes',
            icon: FaRoute
        
    });
}

if (hasPermission(PERMISSIONS.GET_GEOFENCES)) {
    sideBarData.data.push({
        id: 3,
        name: 'GeoFences',
        path: '/geofences',
        icon: FaMapMarkedAlt
    });
}

if (hasPermission(PERMISSIONS.GET_USERS)) {
    sideBarData.data.push({
        id: 8,
        name: 'User Management',
        path: '/users',
        icon: FiUser
    });
}

sideBarData.data.sort((a, b) => a.id - b.id);
