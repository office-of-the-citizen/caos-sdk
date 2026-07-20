/**
 * Projection contracts — the lawful boundary between the Citizen Application
 * and the CAOS operating system.
 *
 * These schemas mirror the projection artifacts the OS emits
 * (prj_public_record / prj_navigation). They are validated at the edge like
 * any external client would validate a remote API. The application never
 * imports OS code and never derives constitutional truth from anything other
 * than these shapes.
 *
 * Optional regions (identity media, budget, activity) model FUTURE lawful
 * expansions of the projection. The renderer must treat every one of them as
 * absent-by-default: missing truth is a designed state, never an error.
 */
import { z } from "zod";
/**
 * PROJECTION_VERSION 3 (Engine 10 v3, DEC-2026-07-20-001): context entries
 * may carry data_origin "RESOLVED_CLAIM" (Occupancy Resolver truth over
 * published assertions) alongside "REPOSITORY_REFERENCE" identity joins;
 * badges on resolved entries reflect verification posture, never dressed
 * above their evidence grade.
 */
export const BadgePresentationSchema = z.object({
    badge_code: z.string(),
    label: z.string(),
    colour_role: z.string(),
    colour_hex: z.string(),
    surface_mark: z.string(),
    surface_mark_treatment: z.string(),
});
export const MissingnessSchema = z.object({
    missingness_state: z.string(),
    label: z.string(),
    colour_role: z.string(),
    colour_hex: z.string(),
    explanation: z.string(),
});
export const SectionAnswerSchema = z.object({
    kind: z.string(),
    value: z.string(),
    display_name: z.string().nullable(),
    portrait: z.string().nullable(),
});
export const VerificationSchema = z
    .object({
    claim_id: z.string().optional(),
    verification_status: z.string().optional(),
    badge_code: z.string().optional(),
    assessed_at: z.string().optional(),
})
    .passthrough();
export const RecordSectionSchema = z.object({
    section_code: z.string(),
    question: z.string(),
    /** Registry-governed display label (e.g. "Executive Chairman"). */
    display_label: z.string().nullable().optional().default(null),
    layout_slot: z.string(),
    projection_form: z.string(),
    claim_ref: z.string().nullable(),
    valid_from: z.string().nullable(),
    valid_to: z.string().nullable(),
    answer: SectionAnswerSchema.nullable(),
    missingness: MissingnessSchema.nullable(),
    verification: VerificationSchema.nullable().optional(),
    badge: BadgePresentationSchema,
    evidence: z.unknown().nullable().optional(),
});
/** Registry-governed presentation hints for a context entry. */
export const ContextPresentationSchema = z.object({
    icon: z.string(),
    accent_role: z.string(),
    accent_hex: z.string(),
});
export const ContextEntrySchema = z.object({
    provider: z.string(),
    label: z.string(),
    layout_slot: z.string(),
    presentation: ContextPresentationSchema.nullable().optional().default(null),
    data_origin: z.string(),
    person_id: z.string().nullable(),
    display_name: z.string().nullable(),
    party: z
        .object({
        party_id: z.string().nullable(),
        name: z.string(),
        acronym: z.string().nullable(),
    })
        .nullable(),
    detail: z.string().nullable(),
    badge: BadgePresentationSchema,
    missingness: MissingnessSchema.nullable(),
    source_references: z.array(z.string()),
});
export const CivicJourneyStepSchema = z.object({
    step_code: z.string(),
    title: z.string(),
    body: z.string(),
    source_reference: z.string(),
});
/** Media locator — future identity expansion. Never assumed present. */
export const MediaProjectionSchema = z.object({
    locator: z.string().nullable(),
    alt: z.string().nullable().optional(),
    credit: z.string().nullable().optional(),
});
/** Quick-fact — future identity expansion. */
export const IdentityFactSchema = z.object({
    fact_code: z.string(),
    label: z.string(),
    value: z.union([z.string(), z.number()]).nullable(),
    unit: z.string().nullable().optional(),
    as_of: z.string().nullable().optional(),
    missingness: MissingnessSchema.nullable().optional(),
});
/** Budget region — projected fiscal claims. Absent until truth is admitted. */
export const BudgetProjectionSchema = z.object({
    posture: z.enum(["APPROVED_LATEST", "KNOWN_LATEST", "MISSING"]),
    /** Registry-governed heading ("Latest Approved Budget"). Never app-authored. */
    posture_label: z.string().nullable().optional().default(null),
    /** Registry-governed total caption ("Total Approved Budget"). */
    total_label: z.string().nullable().optional().default(null),
    fiscal_year: z.string().nullable(),
    currency: z.string().default("NGN"),
    total: z.number().nullable(),
    components: z
        .array(z.object({
        component_code: z.string(),
        label: z.string(),
        amount: z.number(),
        colour_role: z.string().nullable().optional(),
    }))
        .default([]),
    claim_refs: z.array(z.string()).default([]),
});
/** Constitutional activity stream — projected truth events only. */
export const ActivityEntrySchema = z.object({
    activity_code: z.string(),
    category: z.string(),
    /** Registry-governed presentation for the category (icon code + colour role). */
    presentation: z
        .object({ icon: z.string(), colour_role: z.string(), colour_hex: z.string() })
        .nullable()
        .optional()
        .default(null),
    occurred_at: z.string(),
    title: z.string(),
    summary: z.string().nullable(),
    badge: BadgePresentationSchema.nullable().optional(),
    object_ref: z.string().nullable().optional(),
});
export const PublicRecordSchema = z.object({
    record_type: z.string(),
    subject_object_id: z.string(),
    slug: z.string(),
    layout_template: z.string(),
    layout_order: z.array(z.string()),
    display: z.object({
        subject_name: z.string(),
        subject_kind: z.string(),
        subject_icon_glyph: z.string(),
        breadcrumb: z.array(z.object({ object_id: z.string(), name: z.string() })),
        owner: z.object({ object_id: z.string(), name: z.string() }).nullable(),
    }),
    sections: z.record(RecordSectionSchema),
    context: z.array(ContextEntrySchema),
    civic_journey: z.array(CivicJourneyStepSchema).default([]),
    /** Registry-governed copy for designed absences (MISSING_PORTRAIT…). */
    placeholders: z
        .record(z.object({ title: z.string(), body: z.string() }))
        .optional()
        .default({}),
    /** Registry-governed cross-section display vocabulary. */
    vocabulary: z.record(z.string()).optional().default({}),
    provenance: z.object({
        built_at: z.string(),
        build_input_hash: z.string(),
        projection_version: z.number(),
        builder: z.string(),
    }),
    /* ---- optional future projection regions (zero-assumption rendering) ---- */
    identity: z
        .object({
        header: MediaProjectionSchema.nullable().optional(),
        logo: MediaProjectionSchema.nullable().optional(),
        facts: z.array(IdentityFactSchema).optional(),
    })
        .nullable()
        .optional(),
    budget: BudgetProjectionSchema.nullable().optional(),
    activity: z.array(ActivityEntrySchema).nullable().optional(),
});
export const NavigationIndexSchema = z.object({
    record_type: z.string(),
    built_at: z.string(),
    groups: z.array(z.object({
        group_object_id: z.string(),
        group_name: z.string(),
        /** Stable presentation key: slugified name without the " State" suffix. */
        group_code: z.string().optional(),
        /** Display name without the " State" suffix (chips, carousels). */
        group_short_name: z.string().optional(),
        records: z.array(z.object({
            slug: z.string(),
            subject_object_id: z.string(),
            name: z.string(),
        })),
    })),
});
/** Engine 11 search result — references prepared public records only. */
export const SearchResultSchema = z.object({
    record_type: z.string(),
    slug: z.string(),
    subject_object_id: z.string(),
    title: z.string(),
    group_name: z.string(),
    answer_summary: z.string().nullable(),
    badge_code: z.string().nullable(),
    score: z.number(),
});
export const SearchResponseSchema = z.object({
    query: z.string(),
    total: z.number().optional(),
    results: z.array(SearchResultSchema),
});
