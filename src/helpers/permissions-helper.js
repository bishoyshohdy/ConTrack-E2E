import { getUserInfo } from '../api/user';

export function hasPermission (perm) {
    return getUserInfo() && getUserInfo().permissions ? getUserInfo().permissions.find((p) => p.scope === perm) : null;
}
