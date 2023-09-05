import { DEVICES } from '../types/devices';
import CycollectorImg from '../assets/images/devices/cycollector.webp';
import CyTagImg from '../assets/images/devices/cytag.webp';

export const CycollectorForm = [
    {
        name: 'Imei',
        type: 'text',
        default: ''
    },
    {
        name: 'Name',
        type: 'text',
        default: ''
    }
];

export const CypowerForm = [
    {
        name: 'Imei',
        type: 'text',
        default: ''
    },
    {
        name: 'Name',
        type: 'text',
        default: ''
    }
];

export const CytagForm = [
    {
        name: 'Bluetooth Id',
        type: 'text',
        default: ''
    },
    {
        name: 'Name',
        type: 'text',
        default: ''
    }
];

export function getDeviceForm (type) {
    switch (type) {
    case DEVICES.CYCOLLECTOR:
        return CycollectorForm;

    case DEVICES.CYTAG:
        return CytagForm;

    default:
        return CypowerForm;
    }
}

export function getDeviceIdentifier (type) {
    switch (type) {
    case DEVICES.CYTAG:
        return 'Bluetooth Id';

    default:
        return 'Imei';
    }
}

export function getDeviceImg (type) {
    switch (type) {
    case DEVICES.CYCOLLECTOR:
        return CycollectorImg;

    case DEVICES.CYTAG:
        return CyTagImg;
    }
}
