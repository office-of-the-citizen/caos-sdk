/**
 * caOs Runtime Identity — public surface.
 *
 * SDK version is imported from the build-generated module.
 * package.json remains the sole authority for that version string.
 */
export { CAOS_SDK_VERSION } from './generated/runtime-identity.js';
/** Minimum Gateway version this SDK release is compatible with (policy, not package version). */
export declare const CAOS_REQUIRED_GATEWAY = ">=0.1.0";
export interface RuntimeIdentity {
    sdkVersion: string;
    gatewayVersion: string | null;
    compatible: boolean;
}
export declare function semverSatisfies(version: string, range: string): boolean;
//# sourceMappingURL=identity.d.ts.map