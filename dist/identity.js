/**
 * caOs Runtime Identity — public surface.
 *
 * SDK version is imported from the build-generated module.
 * package.json remains the sole authority for that version string.
 */
export { CAOS_SDK_VERSION } from './generated/runtime-identity.js';
/** Minimum Gateway version this SDK release is compatible with (policy, not package version). */
export const CAOS_REQUIRED_GATEWAY = '>=0.1.0';
export function semverSatisfies(version, range) {
    const v = version.split('.').map(Number);
    if (v.length !== 3 || v.some((n) => isNaN(n)))
        return false;
    const m = /^>=(\d+)\.(\d+)\.(\d+)/.exec(range);
    if (!m)
        return false;
    const min = [Number(m[1]), Number(m[2]), Number(m[3])];
    for (let i = 0; i < 3; i++) {
        if (v[i] > min[i])
            return true;
        if (v[i] < min[i])
            return false;
    }
    return true;
}
