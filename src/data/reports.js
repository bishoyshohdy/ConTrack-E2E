export function getReportsUiSchema () {
    return {
        'ui:submitButtonOptions': {
            submitText: 'Schedule report',
            norender: false,
            props: {
                disabled: false,
                bg: 'action.100'
            }
        },
        scheduled_at: {
            'ui:type': 'datetime'
        }
    };
}
