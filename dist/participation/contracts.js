/**
 * Zod schemas for participation API responses.
 */
import { z } from 'zod';
export const ParticipationCaseSchema = z.object({
    participation_id: z.string(),
    participation_type: z.string(),
    lifecycle_state: z.string(),
    service_ref: z.string().nullable(),
    channel: z.string(),
    created_at: z.string(),
    filed_at: z.string().nullable(),
    closed_at: z.string().nullable(),
    outcome: z.string().nullable(),
    priority: z.string(),
});
export const TimelineEventSchema = z.object({
    from_state: z.string(),
    to_state: z.string(),
    trigger: z.string(),
    timestamp: z.string(),
    actor: z.string(),
});
export const ParticipationTimelineSchema = z.object({
    participation_id: z.string(),
    events: z.array(TimelineEventSchema),
});
export const QuestionSchema = z.object({
    participation_id: z.string(),
    question_text: z.string(),
    resolution_state: z.enum(['OPEN', 'ANSWERED', 'PARTIALLY_ANSWERED', 'UNANSWERABLE']),
    demand_count: z.number(),
    created_at: z.string(),
});
export const ClockInfoSchema = z.object({
    obligation_id: z.string(),
    started_at: z.string(),
    expires_at: z.string(),
    expired: z.boolean(),
    remaining_hours: z.number().nullable(),
});
export const FOIRequestSchema = z.object({
    participation_id: z.string(),
    institution_id: z.string(),
    institution_name: z.string(),
    question_text: z.string(),
    record_description: z.string(),
    lifecycle_state: z.string(),
    delivery_state: z.string().nullable(),
    clock_state: ClockInfoSchema.nullable(),
    response_state: z.string().nullable(),
    outcome: z.string().nullable(),
    created_at: z.string(),
    filed_at: z.string().nullable(),
});
export const DemandInfoSchema = z.object({
    subject_ref: z.string(),
    demand_count: z.number(),
    latest_question_at: z.string().nullable(),
});
export const TransparencyProfileSchema = z.object({
    institution_id: z.string(),
    institution_name: z.string(),
    total_requests: z.number(),
    responded: z.number(),
    refused: z.number(),
    silence: z.number(),
    response_rate: z.number(),
    median_response_days: z.number().nullable(),
});
export const WatchResultSchema = z.object({
    watch_id: z.string(),
    watched_crn: z.string(),
    active: z.boolean(),
    created_at: z.string(),
});
export const SubscriptionResultSchema = z.object({
    subscription_id: z.string(),
    channel: z.string(),
    frequency: z.string(),
    active: z.boolean(),
    created_at: z.string(),
});
/**
 * Module health response — the SDK-level descriptor for Module 05 status.
 * Allows the SDK consumer to verify the participation module is operational
 * before invoking capabilities.
 */
export const ModuleHealthSchema = z.object({
    module: z.literal('05_participation'),
    status: z.enum(['healthy', 'degraded', 'unavailable']),
    version: z.string(),
    engine_status: z.string(),
    capabilities: z.array(z.string()),
});
