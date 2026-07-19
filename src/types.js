"use strict";
/**
 * Shared Type Definitions and Core Contracts for CAOS SDK.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaosError = void 0;
class CaosError extends Error {
    code;
    detail;
    constructor(payload) {
        super(payload.message);
        this.code = payload.code;
        this.detail = payload.detail;
        this.name = 'CaosError';
    }
}
exports.CaosError = CaosError;
//# sourceMappingURL=types.js.map