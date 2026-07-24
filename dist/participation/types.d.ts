/**
 * Constitutional Participation types — the public contract for
 * participation capabilities exposed through the SDK.
 *
 * These types present civic-language interfaces that remain stable
 * even as engine internals evolve.
 */
export type ParticipationType = 'QUESTION' | 'REQUEST' | 'CONTRIBUTION' | 'CORRECTION' | 'CHALLENGE' | 'APPEAL' | 'REPORT' | 'WATCH' | 'SUBSCRIPTION';
export type ParticipationLifecycleState = 'COMPOSED' | 'IDENTIFIED' | 'CONSENTED' | 'FILED' | 'DISPATCHED' | 'DELIVERED' | 'ACKNOWLEDGED' | 'TRANSFERRED' | 'CLARIFIED' | 'RESPONDED' | 'SILENCE_RECORDED' | 'ESCALATED' | 'CLOSED' | 'WITHDRAWN';
export type ParticipationOutcome = 'RESPONDED_FULL' | 'RESPONDED_PARTIAL' | 'REFUSED' | 'DEEMED_REFUSED' | 'WITHDRAWN' | 'ESCALATED' | 'RESOLVED' | 'TRANSFERRED';
export interface ParticipationCase {
    participation_id: string;
    participation_type: ParticipationType;
    lifecycle_state: ParticipationLifecycleState;
    service_ref: string | null;
    channel: string;
    created_at: string;
    filed_at: string | null;
    closed_at: string | null;
    outcome: ParticipationOutcome | null;
    priority: string;
}
export interface ParticipationTimeline {
    participation_id: string;
    events: TimelineEvent[];
}
export interface TimelineEvent {
    from_state: string;
    to_state: string;
    trigger: string;
    timestamp: string;
    actor: string;
}
export interface Question {
    participation_id: string;
    question_text: string;
    resolution_state: 'OPEN' | 'ANSWERED' | 'PARTIALLY_ANSWERED' | 'UNANSWERABLE';
    demand_count: number;
    created_at: string;
}
export interface FOIRequest {
    participation_id: string;
    institution_id: string;
    institution_name: string;
    question_text: string;
    record_description: string;
    lifecycle_state: ParticipationLifecycleState;
    delivery_state: string | null;
    clock_state: ClockInfo | null;
    response_state: string | null;
    outcome: ParticipationOutcome | null;
    created_at: string;
    filed_at: string | null;
}
export interface ClockInfo {
    obligation_id: string;
    started_at: string;
    expires_at: string;
    expired: boolean;
    remaining_hours: number | null;
}
export interface DemandInfo {
    subject_ref: string;
    demand_count: number;
    latest_question_at: string | null;
}
export interface TransparencyProfile {
    institution_id: string;
    institution_name: string;
    total_requests: number;
    responded: number;
    refused: number;
    silence: number;
    response_rate: number;
    median_response_days: number | null;
}
export interface WatchResult {
    watch_id: string;
    watched_crn: string;
    active: boolean;
    created_at: string;
}
export interface SubscriptionResult {
    subscription_id: string;
    channel: string;
    frequency: string;
    active: boolean;
    created_at: string;
}
export interface CreateQuestionParams {
    question_text: string;
    subject_ref?: string;
    predicate_ref?: string;
}
export interface CreateFOIRequestParams {
    institution_id: string;
    question_text: string;
    record_description: string;
}
export interface SubmitContributionParams {
    target_gap_ref?: string;
    description: string;
    artifact_refs?: string[];
}
export interface SubmitCorrectionParams {
    target_assertion_ref: string;
    correction_value: string;
    evidence_description: string;
}
export interface SubmitChallengeParams {
    challenged_assertion_ref: string;
    challenge_basis: string;
    supporting_evidence?: string[];
}
export interface WatchObjectParams {
    crn: string;
    scope?: 'PREDICATE' | 'SUBJECT' | 'CASE' | 'INSTITUTION';
}
export interface SubscribeParams {
    channel: 'EMAIL' | 'SMS' | 'WHATSAPP' | 'PUSH' | 'IN_APP';
    frequency?: 'IMMEDIATE' | 'DAILY_DIGEST' | 'WEEKLY_DIGEST';
    filters?: Record<string, unknown>;
}
export type SlaStatus = 'on_track' | 'warning' | 'breached' | 'none';
export interface ParticipationCaseRow {
    participation_id: string;
    participation_type: string;
    lifecycle_state: string;
    service_ref: string | null;
    channel: string;
    priority: string;
    institution_name: string | null;
    created_at: string;
    filed_at: string | null;
    closed_at: string | null;
    outcome: string | null;
    sla_status: SlaStatus;
}
export interface ParticipationQueueStats {
    total_open: number;
    critical_sla: number;
    silence_today: number;
}
export interface ParticipationQueueResponse {
    cases: ParticipationCaseRow[];
    stats: ParticipationQueueStats;
}
export interface AssignCaseParams {
    assignee?: string;
    priority?: string;
    notes?: string;
}
export interface EscalateCaseParams extends AssignCaseParams {
    escalation_path?: string;
}
export interface RespondToCaseParams {
    response_note: string;
}
export interface CloseCaseParams {
    reason: string;
}
export interface CaseActionResult {
    success: boolean;
    participation_id: string;
    message?: string;
}
export type EpistemicKind = 'LEGISLATED' | 'DECLARED' | 'OBSERVED' | 'REPORTED';
export type CorroborationStatus = 'VERIFIED' | 'PROVISIONAL' | 'DISPUTED' | 'SUPERSEDED';
export interface KnowledgeUnit {
    ku_id: string;
    artifact_id: string;
    chunk_id: string;
    subject: string;
    predicate: string;
    value: string;
    epistemic_kind: EpistemicKind;
    confidence: number;
    corroboration: CorroborationStatus;
    superseded_by: string | null;
    extractor_version: string;
    created_at: string;
}
export interface KiResponse {
    total: number;
    displayed: number;
    knowledge_units: KnowledgeUnit[];
    checked_at: string;
}
export type WorkflowStageId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;
export type StageStatus = 'RUNNING' | 'COMPLETED' | 'SKIPPED' | 'FAILED' | 'BLOCKED' | 'REUSED';
export interface StageTraceEntry {
    stage: WorkflowStageId;
    name: string;
    owner: string;
    status: StageStatus;
    started_at: string;
    completed_at: string;
    detail?: Record<string, unknown>;
    error?: string;
}
export type DecisionOriginEngine = '01_SECURITY' | '02_LEDGER' | '05_PARTICIPATION' | '06_UTE' | '07_SOURCES' | '08_EVIDENCE' | '09_VERIFICATION' | '10_PROJECTION' | '12_GATEWAY' | '13_GRAPH' | 'AI_RUNTIME' | 'OPS';
export type DecisionLevel = 'INFORMATION' | 'WARNING' | 'ADMISSION_HOLD' | 'QUARANTINE' | 'SYSTEM_FAILURE' | 'PROVIDER_FAILURE' | 'CONSTITUTIONAL_CONFLICT';
export type DecisionOutcome = 'SUCCESS' | 'ADMITTED' | 'DUPLICATE' | 'REJECTED' | 'QUARANTINED' | 'SUPERSEDED' | 'FAILED' | 'BLOCKED';
export interface DecisionDiagnostics {
    origin: {
        engine: DecisionOriginEngine;
        subsystem: string;
        component: string;
    };
    provider?: {
        id: string;
        model: string | null;
        latency_ms: number | null;
    } | null;
    classifier_ran?: boolean;
    fell_back?: boolean;
    attempts?: string[];
    reasoning?: string;
    sample_chars?: number;
    exception?: {
        name: string;
        message: string;
        stack_hash?: string;
    } | null;
}
export interface ConstitutionalDecision {
    outcome: DecisionOutcome;
    level: DecisionLevel;
    reason: string;
    explanation: string;
    action_required: string;
    confidence: number;
    diagnostics: DecisionDiagnostics;
    decided_at: string;
}
export interface ClassificationOperatorView {
    provider: string;
    model: string | null;
    classification: string;
    confidence: number;
    in_scope: boolean;
    reasoning: string;
    classifier_ran: boolean;
    fell_back: boolean;
    sample_chars: number;
    latency_ms: number | null;
    attempts: string[];
    admission_decision: string;
    admission_reasons: string[];
    headline: string;
}
export interface OperatorAdmitItemResult {
    filename: string;
    sha256: string;
    source_artifact_id: string | null;
    cas_locator: string | null;
    duplicate: boolean;
    admission_decision?: 'ADMITTED' | 'REJECTED' | 'DUPLICATE' | 'QUARANTINED' | 'SUPERSEDED';
    /** @deprecated use decision.reason + decision.explanation instead */
    admission_decision_reason?: string | null;
    duplicate_of_source_artifact_id?: string | null;
    stage_trace?: StageTraceEntry[];
    /** Single canonical decision — the only source of truth for outcome/error. */
    decision?: ConstitutionalDecision | null;
    /** @deprecated use decision.diagnostics instead */
    classification_summary?: ClassificationOperatorView | null;
    error?: string;
}
export type OperatorAdmitProgressEvent = {
    type: 'file_started';
    index: number;
    total: number;
    filename: string;
} | {
    type: 'stage';
    index: number;
    total: number;
    filename: string;
    entry: StageTraceEntry;
} | {
    type: 'file_result';
    index: number;
    total: number;
    filename: string;
    result: OperatorAdmitItemResult;
};
//# sourceMappingURL=types.d.ts.map