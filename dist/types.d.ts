/**
 * Shared Type Definitions and Core Contracts for CAOS SDK.
 */
export type LifecycleState = 'DRAFT' | 'ADMITTED' | 'PROJECTED' | 'SUPERSEDED' | 'RETIRED';
export type MissingnessState = 'ABSENT' | 'REDUNDANT' | 'INCOMPLETE' | 'ESTABLISHED';
export interface LawfulWriteContext {
    actor_id: string;
    active_role_code: string;
    resolved_right: {
        right_code: string;
    };
}
export interface CaosErrorPayload {
    code: string;
    message: string;
    detail?: string;
    /** HTTP status when the gateway answered; undefined on network failure. */
    status?: number;
    /** Raw response body for callers that need more than the normalized shape. */
    data?: unknown;
}
export declare class CaosError extends Error {
    code: string;
    detail?: string;
    status?: number;
    data?: unknown;
    constructor(payload: CaosErrorPayload);
}
export type RightCode = 'CLAIM_DRAFT' | 'OBJECT_LINEAGE_RECORD' | 'SOURCE_INGEST' | 'OPERATIONAL_COMMAND_ADMIT_SOURCE' | 'SYNC_SOURCE_LIBRARY';
export type RoleCode = 'ADMINISTRATOR' | 'SENIOR_EDITOR' | 'EDITOR' | 'SYSTEM_ENGINE' | 'CITIZEN';
export interface AdmissionDecisionOutcome {
    artifact_hash: string;
    source_artifact_id: string;
    workflow_id: string | null;
    mode: string;
    admission_decision: 'ADMITTED' | 'REJECTED' | 'QUARANTINED' | 'SUPERSEDED';
    duplicate: boolean;
    storage_locator: string;
    byte_length: number;
    status: string;
}
export interface DecisionItem {
    id: number;
    ku_id: string | null;
    claim_id: string | null;
    kind: 'CLAIM_DRAFT' | 'SOURCE_INGEST' | 'MIGRATION' | 'SYSTEM';
    title: string;
    description: string | null;
    adjudication_status: 'OPEN' | 'APPROVED' | 'REJECTED';
    adjudicated_at: string | null;
    adjudicator_id: string | null;
    note: string | null;
}
//# sourceMappingURL=types.d.ts.map