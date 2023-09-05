import CustomCheckbox from '../components/form-widgets/custom-checkbox';
import CustomNumberInput from '../components/form-widgets/custom-input';
import CustomSelect from '../components/form-widgets/custom-select';

export const SEVERITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent'
};

export const ALARM_STATUS = {
    ACTIVE: 'active',
    ACKNOWLEDGED: 'acknowledged',
    RESOLVED: 'resolved',
    CLEARED: 'cleared'
};

export function createAlarmSettingSchema (alarmTypes, geofences, routes) {
    return {
        type: 'object',
        properties: {
            alarm_type: {
                enum: alarmTypes.map((type) => {
                    return type.name;
                }),
                type: 'string'
            },
            severity: {
                type: 'string',
                enum: Object.values(SEVERITY)
            },
            enabled: {
                type: 'boolean'
            }
        },
        allOf: alarmTypes.map((type) => {
            if (type.name === 'geofence') {
                Object.assign(type, {
                    configurations_schema: {
                        ...type.configurations_schema,
                        properties: {
                            ...type.configurations_schema.properties,
                            geofence_name: geofences.length !== 0
                                ? {
                                    type: 'string',
                                    enum: geofences.map((geo) => geo.name)
                                }
                                : {
                                    type: 'string'
                                }
                        }
                    }
                });
            }
            if (type.name === 'out_of_route') {
                Object.assign(type, {
                    configurations_schema: {
                        ...type.configurations_schema,
                        properties: {
                            ...type.configurations_schema.properties,
                            route_name: routes.length !== 0
                                ? {
                                    type: 'string',
                                    enum: routes.map((route) => route.name)
                                }
                                : {
                                    type: 'string'
                                }
                        }
                    }
                });
            }
            return {
                if: {
                    properties: {
                        alarm_type: {
                            const: type.name
                        }
                    }
                },
                then: type.configurations_schema
            };
        })
    };
}

export function getAlarmSettingUiSchema (unedit = [], editFlag = false, geofences, routes) {
    let ui = {};
    if (editFlag) {
        ui = {
            'ui:submitButtonOptions': {
                submitText: 'Submit',
                norender: false,
                props: {
                    disabled: false,
                    bg: 'action.100'
                }
            },
            alarm_type: {
                'ui:disabled': true
            }
        };
        unedit && unedit.forEach((element) => {
            ui[element] = {
                'ui:disabled': true
            };
        });
    } else {
        ui = {
            'ui:submitButtonOptions': {
                submitText: 'Create Configurations',
                norender: false,
                props: {
                    disabled: false,
                    bg: 'action.100'
                }
            },
            route_name: {
                disabled: routes.length === 0
            },
            geofence_name: {
                disabled: geofences.length === 0
            }
        };
    }
    return ui;
}
export function getNotificationsSettingUiSchema () {
    return {
        'ui:submitButtonOptions': {
            submitText: 'Update Configurations',
            norender: false,
            props: {
                disabled: false,
                bg: 'action.100'
            }
        }
    };
}

export function getFormsWidgets () {
    return {
        SelectWidget: CustomSelect,
        TextWidget: CustomNumberInput,
        CheckboxWidget: CustomCheckbox,
        EmailWidget: CustomNumberInput
    };
}
