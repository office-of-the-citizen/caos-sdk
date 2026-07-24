/**
 * Shared Type Definitions and Core Contracts for CAOS SDK.
 */

// === Constitutional Resource Name (CRN) ===
// The unified identity grammar of the Knowledge Index.
// Grammar: crn:<kind>:<designator>
// The kind determines the stratum level (S0–S5); the designator is the
// kind-specific unique identifier.

export type CRNStratum = 's0' | 's1' | 's2' | 's3' | 's4' | 's5';

export type CRNKind =
  | 'artifact'
  | 'structure'
  | 'entity'
  | 'person'
  | 'organisation'
  | 'ku'
  | 'evidence'
  | 'claim'
  | 'assertion'
  | 'episode'
  | 'absence'
  | 'answer';

export interface CRN {
  raw: string;
  stratum: CRNStratum;
  kind: CRNKind;
  designator: string;
}

/** The result of resolving a CRN to its governed element. */
export interface ResolvedElement {
  crn: string;
  stratum: CRNStratum;
  kind: CRNKind;
  element: unknown;
  visibility: 'PUBLIC' | 'RESTRICTED' | 'SEALED';
  resolved_at: string;
  ledger_seq: number;
}

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

export class CaosError extends Error {
  public code: string;
  public detail?: string;
  public status?: number;
  public data?: unknown;

  constructor(payload: CaosErrorPayload) {
    super(payload.message);
    this.code = payload.code;
    this.detail = payload.detail;
    this.status = payload.status;
    this.data = payload.data;
    this.name = 'CaosError';
  }
}

export type RightCode =
  | 'CLAIM_DRAFT'
  | 'OBJECT_LINEAGE_RECORD'
  | 'SOURCE_INGEST'
  | 'OPERATIONAL_COMMAND_ADMIT_SOURCE'
  | 'SYNC_SOURCE_LIBRARY';

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
  // Extended fields for detailed view
  item?: {
    id: number;
    decision_kind: string;
    reason: string;
    priority: string;
    adjudication_status: string;
    resolved_by_actor_id?: string;
    resolved_at?: string;
    resolution_note?: string;
  };
  ku?: {
    ku_id: string;
    extracted_predicate: string;
    extracted_subject: string;
    extracted_value: string;
    linked_subject_id?: string;
    linked_value_id?: string;
    corroboration_status: string;
    source_artifact_id: string;
    confidence_score: number;
    c_extract: number;
    c_entity: number;
    c_predicate: number;
    c_document: number;
    lineage_metadata?: Record<string, unknown>;
  };
  corroboration?: {
    peers: Array<{
      ku_id: string;
      issuer_id?: string;
      extracted_value: string;
      source_artifact_id: string;
      corroboration_status: string;
    }>;
    reason: string;
    independent_issuer_count_for_value: number;
  };
}

/* ──────────────────────────────────────────────────────────────────────────
   ANSWER ENVELOPE — Knowledge Index §24.6 (Every Answer Explains — KI-7)
   The seven governed shapes a constitutional answer may take.
   ────────────────────────────────────────────────────────────────────────── */

export type AnswerShape =
  | 'VERIFIED_VALUE'
  | 'PROVISIONAL_VALUE'
  | 'CONTESTED_RIVALS'
  | 'ASSERTED_UNKNOWN'
  | 'GOVERNED_ABSENCE'
  | 'LAWFUL_REFUSAL'
  | 'TEMPORAL_BOUNDARY';

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
    rivals?: Array<{ value: string; display_name: string; basis: string }>;
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
