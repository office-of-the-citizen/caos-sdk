/**
 * Shared Type Definitions and Core Contracts for CAOS SDK.
 */
export class CaosError extends Error {
    code;
    detail;
    status;
    data;
    constructor(payload) {
        super(payload.message);
        this.code = payload.code;
        this.detail = payload.detail;
        this.status = payload.status;
        this.data = payload.data;
        this.name = 'CaosError';
    }
}
