/**
 * Zod schemas for participation API responses.
 */
import { z } from 'zod';
export declare const ParticipationCaseSchema: z.ZodObject<{
    participation_id: z.ZodString;
    participation_type: z.ZodString;
    lifecycle_state: z.ZodString;
    service_ref: z.ZodNullable<z.ZodString>;
    channel: z.ZodString;
    created_at: z.ZodString;
    filed_at: z.ZodNullable<z.ZodString>;
    closed_at: z.ZodNullable<z.ZodString>;
    outcome: z.ZodNullable<z.ZodString>;
    priority: z.ZodString;
}, "strip", z.ZodTypeAny, {
    participation_id: string;
    participation_type: string;
    lifecycle_state: string;
    service_ref: string | null;
    channel: string;
    created_at: string;
    filed_at: string | null;
    closed_at: string | null;
    outcome: string | null;
    priority: string;
}, {
    participation_id: string;
    participation_type: string;
    lifecycle_state: string;
    service_ref: string | null;
    channel: string;
    created_at: string;
    filed_at: string | null;
    closed_at: string | null;
    outcome: string | null;
    priority: string;
}>;
export declare const TimelineEventSchema: z.ZodObject<{
    from_state: z.ZodString;
    to_state: z.ZodString;
    trigger: z.ZodString;
    timestamp: z.ZodString;
    actor: z.ZodString;
}, "strip", z.ZodTypeAny, {
    from_state: string;
    to_state: string;
    trigger: string;
    timestamp: string;
    actor: string;
}, {
    from_state: string;
    to_state: string;
    trigger: string;
    timestamp: string;
    actor: string;
}>;
export declare const ParticipationTimelineSchema: z.ZodObject<{
    participation_id: z.ZodString;
    events: z.ZodArray<z.ZodObject<{
        from_state: z.ZodString;
        to_state: z.ZodString;
        trigger: z.ZodString;
        timestamp: z.ZodString;
        actor: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        from_state: string;
        to_state: string;
        trigger: string;
        timestamp: string;
        actor: string;
    }, {
        from_state: string;
        to_state: string;
        trigger: string;
        timestamp: string;
        actor: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    participation_id: string;
    events: {
        from_state: string;
        to_state: string;
        trigger: string;
        timestamp: string;
        actor: string;
    }[];
}, {
    participation_id: string;
    events: {
        from_state: string;
        to_state: string;
        trigger: string;
        timestamp: string;
        actor: string;
    }[];
}>;
export declare const QuestionSchema: z.ZodObject<{
    participation_id: z.ZodString;
    question_text: z.ZodString;
    resolution_state: z.ZodEnum<["OPEN", "ANSWERED", "PARTIALLY_ANSWERED", "UNANSWERABLE"]>;
    demand_count: z.ZodNumber;
    created_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    participation_id: string;
    created_at: string;
    question_text: string;
    resolution_state: "OPEN" | "ANSWERED" | "PARTIALLY_ANSWERED" | "UNANSWERABLE";
    demand_count: number;
}, {
    participation_id: string;
    created_at: string;
    question_text: string;
    resolution_state: "OPEN" | "ANSWERED" | "PARTIALLY_ANSWERED" | "UNANSWERABLE";
    demand_count: number;
}>;
export declare const ClockInfoSchema: z.ZodObject<{
    obligation_id: z.ZodString;
    started_at: z.ZodString;
    expires_at: z.ZodString;
    expired: z.ZodBoolean;
    remaining_hours: z.ZodNullable<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    obligation_id: string;
    started_at: string;
    expires_at: string;
    expired: boolean;
    remaining_hours: number | null;
}, {
    obligation_id: string;
    started_at: string;
    expires_at: string;
    expired: boolean;
    remaining_hours: number | null;
}>;
export declare const FOIRequestSchema: z.ZodObject<{
    participation_id: z.ZodString;
    institution_id: z.ZodString;
    institution_name: z.ZodString;
    question_text: z.ZodString;
    record_description: z.ZodString;
    lifecycle_state: z.ZodString;
    delivery_state: z.ZodNullable<z.ZodString>;
    clock_state: z.ZodNullable<z.ZodObject<{
        obligation_id: z.ZodString;
        started_at: z.ZodString;
        expires_at: z.ZodString;
        expired: z.ZodBoolean;
        remaining_hours: z.ZodNullable<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        obligation_id: string;
        started_at: string;
        expires_at: string;
        expired: boolean;
        remaining_hours: number | null;
    }, {
        obligation_id: string;
        started_at: string;
        expires_at: string;
        expired: boolean;
        remaining_hours: number | null;
    }>>;
    response_state: z.ZodNullable<z.ZodString>;
    outcome: z.ZodNullable<z.ZodString>;
    created_at: z.ZodString;
    filed_at: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    participation_id: string;
    lifecycle_state: string;
    created_at: string;
    filed_at: string | null;
    outcome: string | null;
    question_text: string;
    institution_id: string;
    institution_name: string;
    record_description: string;
    delivery_state: string | null;
    clock_state: {
        obligation_id: string;
        started_at: string;
        expires_at: string;
        expired: boolean;
        remaining_hours: number | null;
    } | null;
    response_state: string | null;
}, {
    participation_id: string;
    lifecycle_state: string;
    created_at: string;
    filed_at: string | null;
    outcome: string | null;
    question_text: string;
    institution_id: string;
    institution_name: string;
    record_description: string;
    delivery_state: string | null;
    clock_state: {
        obligation_id: string;
        started_at: string;
        expires_at: string;
        expired: boolean;
        remaining_hours: number | null;
    } | null;
    response_state: string | null;
}>;
export declare const DemandInfoSchema: z.ZodObject<{
    subject_ref: z.ZodString;
    demand_count: z.ZodNumber;
    latest_question_at: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    demand_count: number;
    subject_ref: string;
    latest_question_at: string | null;
}, {
    demand_count: number;
    subject_ref: string;
    latest_question_at: string | null;
}>;
export declare const TransparencyProfileSchema: z.ZodObject<{
    institution_id: z.ZodString;
    institution_name: z.ZodString;
    total_requests: z.ZodNumber;
    responded: z.ZodNumber;
    refused: z.ZodNumber;
    silence: z.ZodNumber;
    response_rate: z.ZodNumber;
    median_response_days: z.ZodNullable<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    institution_id: string;
    institution_name: string;
    total_requests: number;
    responded: number;
    refused: number;
    silence: number;
    response_rate: number;
    median_response_days: number | null;
}, {
    institution_id: string;
    institution_name: string;
    total_requests: number;
    responded: number;
    refused: number;
    silence: number;
    response_rate: number;
    median_response_days: number | null;
}>;
export declare const WatchResultSchema: z.ZodObject<{
    watch_id: z.ZodString;
    watched_crn: z.ZodString;
    active: z.ZodBoolean;
    created_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    created_at: string;
    watch_id: string;
    watched_crn: string;
    active: boolean;
}, {
    created_at: string;
    watch_id: string;
    watched_crn: string;
    active: boolean;
}>;
export declare const SubscriptionResultSchema: z.ZodObject<{
    subscription_id: z.ZodString;
    channel: z.ZodString;
    frequency: z.ZodString;
    active: z.ZodBoolean;
    created_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    channel: string;
    created_at: string;
    active: boolean;
    subscription_id: string;
    frequency: string;
}, {
    channel: string;
    created_at: string;
    active: boolean;
    subscription_id: string;
    frequency: string;
}>;
/**
 * Module health response — the SDK-level descriptor for Module 05 status.
 * Allows the SDK consumer to verify the participation module is operational
 * before invoking capabilities.
 */
export declare const ModuleHealthSchema: z.ZodObject<{
    module: z.ZodLiteral<"05_participation">;
    status: z.ZodEnum<["healthy", "degraded", "unavailable"]>;
    version: z.ZodString;
    engine_status: z.ZodString;
    capabilities: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    status: "healthy" | "degraded" | "unavailable";
    module: "05_participation";
    version: string;
    engine_status: string;
    capabilities: string[];
}, {
    status: "healthy" | "degraded" | "unavailable";
    module: "05_participation";
    version: string;
    engine_status: string;
    capabilities: string[];
}>;
export type ModuleHealth = z.infer<typeof ModuleHealthSchema>;
//# sourceMappingURL=contracts.d.ts.map