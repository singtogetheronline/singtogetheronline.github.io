const AdminState = {
    MANAGE_ORG: 'org',
    EDIT_SONG: 'song',
    EXPORT: 'export'
}

export const adminStateOrder = {
    org: 0,
    song: 1,
    export: 2
};

export const adminBreadCrumbs = [
    { displayName: 'Manage Org', value: AdminState.MANAGE_ORG },
    { displayName: 'Edit Song', value: AdminState.EDIT_SONG },
    { displayName: 'Export', value: AdminState.EXPORT }
]

export default AdminState;