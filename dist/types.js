/**
 * Shared Type Definitions and Core Contracts for CAOS SDK.
 */
export class CaosError extends Error {
    code;
    detail;
    constructor(payload) {
        super(payload.message);
        this.code = payload.code;
        this.detail = payload.detail;
        this.name = 'CaosError';
    }
}
