export const DEVICES = {
    CYCOLLECTOR: 'cycollector',
    CYLOCK: 'cylock',
    CYTAG: 'cytag',
    CYPOWER: 'cypower'
};

export const PERMISSIONS = {
    LOCK: 'api_v2.actions.lock.POST',
    GET_ROLES: 'api_v2.users.roles.GET',
    CREATE_USERS: 'api_v2.users.all.POST',
    GET_USERS: 'api_v2.users.all.GET',
    DELETE_USERS: 'api_v2.users.edit.DELETE',
    CREATE_USER_DEVICE_ROLE: 'api_v2.devices.user_device_roles.PUT',
    GET_USER_DEVICE_ROLE: 'api_v2.devices.user_device_roles.GET',
    EDIT_DEVICE: 'api_v2.devices.requests.PUT',
    GET_DEVICE_REQUESTS: 'api_v2.devices.all-requests.GET',

    GET_DEVICE_TRIP: 'api_v2.spatial.trips-v2.GET',

    LOCK_UNLOCK_DEVICE:'api_v2.actions.lock.POST',
    EXPORT_DEVICE_TELEMETRY:'api_v2.devices.devices-details-export.GET',
    
    GET_DEVICE_DETAILS: 'api_v2.devices.device-details.GET',
    GET_DEVICE: 'api_v2.devices.devices.GET',
    GET_ALL_DEVICES: 'api_v2.devices.all-devices.GET',
    GET_DEVICES_REQUESTS: 'api_v2.devices.requests.GET',
    GET_DEVICES_TELEMETRY: 'api_v2.messages.telemetry.GET',
    GET_DEVICES_SPATIAL: 'api_v2.spatial.device-geofences-v2.GET',


    GET_ALARMS_TYPES: 'alarm.alarm-types.GET',


    GET_ALARMS_SETTINGS: 'alarm.alarm-settings.GET',
    EDIT_ALARMS_SETTINGS: 'alarm.alarm-settings.PUT',
    ASSIGN_ALARMS_SETTINGS: 'alarm.assign-alarm-settings.POST',
    CREATE_ALARMS_SETTINGS: 'alarm.alarm-settings.POST',

    GET_GEOFENCES: 'api_v2.spatial.geofences-v2.GET',
    EDIT_GEOFENCES: 'api_v2.spatial.geofences-v2-id.PUT',
    DELETE_GEOFENCES: 'api_v2.spatial.geofences-v2-id.DELETE',
    CREATE_GEOFENCES: 'api_v2.spatial.geofences-v2.POST',

    GET_ROUTES: 'api_v2.spatial.routes-v2.GET',
    DELETE_ROUTES: 'api_v2.spatial.routes-id-v2.DELETE',
    CREATE_ROUTES: 'api_v2.spatial.routes-v2.POST',

    ASSIGN_TAGS:'api_v2.actions.assignation.PUT',

    GET_USERS: 'api_v2.users.all.GET',
    CREATE_USERS: 'api_v2.users.all.POST',
    EDIT_USERS: 'api_v2.users.roles.PUT',

    CREATE_DEVICE_ROLE: 'api_v2.devices.user_device_roles.PUT',
    EDIT_DEVICE_ROLE: 'api_v2.devices.user_device_roles.PUT',

    EDIT_DEVICE_GEOFENCES: 'api_v2.spatial.device-geofences-v2.POST',

    POST_DEVICE_MODE: 'cycollectormode.POST',
    GET_REPORTS_STATS: 'api_v2.actions.get_containers_stats.GET'
};

export const TABLEMAP = {
    GEOFENCES: 'geofences',
    ROUTES: 'routes'
};
