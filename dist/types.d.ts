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
export type AnswerShape = 'VERIFIED_VALUE' | 'PROVISIONAL_VALUE' | 'CONTESTED_RIVALS' | 'ASSERTED_UNKNOWN' | 'GOVERNED_ABSENCE' | 'LAWFUL_REFUSAL' | 'TEMPORAL_BOUNDARY';
export interface AnswerQuestion {
    predicate_id: string;
    subjects: string[];
    frame: Record<string, unknown>;
    clocks: Record<string, string>;
}
export interface AnswerPosture {
    verification_status: string;
    publication: string;
    contest: string;
}
export interface AnswerCitation {
    crn: string;
    excerpt?: string;
    authority_class?: string;
}
/**
 * The governed answer envelope. Every answer the OS emits carries this shape.
 * The `shape` field determines which content fields are meaningful.
 */
export interface AnswerEnvelope {
    answer_crn: string;
    shape: AnswerShape;
    question: AnswerQuestion;
    content: {
        kind: string;
        value?: string;
        display_name?: string;
        person_crn?: string;
        rivals?: Array<{
            value: string;
            display_name: string;
            basis: string;
        }>;
        absence_class?: string;
        refusal_basis?: string;
        temporal_note?: string;
    };
    applicability: {
        from: string | null;
        to: string | null;
        open: boolean;
    };
    posture: AnswerPosture;
    citations: AnswerCitation[];
    explanation: {
        why: string;
        grounding_chain?: string[];
    };
    resolved_against: {
        ledger_seq: number;
        registry_versions: Record<string, number>;
    };
    visibility_basis: string;
}
/** Response from the /ask endpoint. */
export interface AskResponse {
    query: string;
    answers: AnswerEnvelope[];
    total: number;
    resolved_at: string;
}
//# sourceMappingURL=types.d.ts.map