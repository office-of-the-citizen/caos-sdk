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
//# sourceMappingURL=types.d.ts.map