"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavigationIndexSchema = exports.PublicRecordSchema = exports.ActivityEntrySchema = exports.BudgetProjectionSchema = exports.IdentityFactSchema = exports.MediaProjectionSchema = exports.CivicJourneyStepSchema = exports.ContextEntrySchema = exports.RecordSectionSchema = exports.VerificationSchema = exports.SectionAnswerSchema = exports.MissingnessSchema = exports.BadgePresentationSchema = void 0;
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
const zod_1 = require("zod");
exports.BadgePresentationSchema = zod_1.z.object({
    badge_code: zod_1.z.string(),
    label: zod_1.z.string(),
    colour_role: zod_1.z.string(),
    colour_hex: zod_1.z.string(),
    surface_mark: zod_1.z.string(),
    surface_mark_treatment: zod_1.z.string(),
});
exports.MissingnessSchema = zod_1.z.object({
    missingness_state: zod_1.z.string(),
    label: zod_1.z.string(),
    colour_role: zod_1.z.string(),
    colour_hex: zod_1.z.string(),
    explanation: zod_1.z.string(),
});
exports.SectionAnswerSchema = zod_1.z.object({
    kind: zod_1.z.string(),
    value: zod_1.z.string(),
    display_name: zod_1.z.string().nullable(),
    portrait: zod_1.z.string().nullable(),
});
exports.VerificationSchema = zod_1.z
    .object({
    claim_id: zod_1.z.string().optional(),
    verification_status: zod_1.z.string().optional(),
    badge_code: zod_1.z.string().optional(),
    assessed_at: zod_1.z.string().optional(),
})
    .passthrough();
exports.RecordSectionSchema = zod_1.z.object({
    section_code: zod_1.z.string(),
    question: zod_1.z.string(),
    layout_slot: zod_1.z.string(),
    projection_form: zod_1.z.string(),
    claim_ref: zod_1.z.string().nullable(),
    valid_from: zod_1.z.string().nullable(),
    valid_to: zod_1.z.string().nullable(),
    answer: exports.SectionAnswerSchema.nullable(),
    missingness: exports.MissingnessSchema.nullable(),
    verification: exports.VerificationSchema.nullable().optional(),
    badge: exports.BadgePresentationSchema,
    evidence: zod_1.z.unknown().nullable().optional(),
});
exports.ContextEntrySchema = zod_1.z.object({
    provider: zod_1.z.string(),
    label: zod_1.z.string(),
    layout_slot: zod_1.z.string(),
    data_origin: zod_1.z.string(),
    person_id: zod_1.z.string().nullable(),
    display_name: zod_1.z.string().nullable(),
    party: zod_1.z
        .object({
        party_id: zod_1.z.string().nullable(),
        name: zod_1.z.string(),
        acronym: zod_1.z.string().nullable(),
    })
        .nullable(),
    detail: zod_1.z.string().nullable(),
    badge: exports.BadgePresentationSchema,
    missingness: exports.MissingnessSchema.nullable(),
    source_references: zod_1.z.array(zod_1.z.string()),
});
exports.CivicJourneyStepSchema = zod_1.z.object({
    step_code: zod_1.z.string(),
    title: zod_1.z.string(),
    body: zod_1.z.string(),
    source_reference: zod_1.z.string(),
});
/** Media locator — future identity expansion. Never assumed present. */
exports.MediaProjectionSchema = zod_1.z.object({
    locator: zod_1.z.string().nullable(),
    alt: zod_1.z.string().nullable().optional(),
    credit: zod_1.z.string().nullable().optional(),
});
/** Quick-fact — future identity expansion. */
exports.IdentityFactSchema = zod_1.z.object({
    fact_code: zod_1.z.string(),
    label: zod_1.z.string(),
    value: zod_1.z.union([zod_1.z.string(), zod_1.z.number()]).nullable(),
    unit: zod_1.z.string().nullable().optional(),
    as_of: zod_1.z.string().nullable().optional(),
    missingness: exports.MissingnessSchema.nullable().optional(),
});
/** Budget region — projected fiscal claims. Absent until truth is admitted. */
exports.BudgetProjectionSchema = zod_1.z.object({
    posture: zod_1.z.enum(["APPROVED_LATEST", "KNOWN_LATEST", "MISSING"]),
    fiscal_year: zod_1.z.string().nullable(),
    currency: zod_1.z.string().default("NGN"),
    total: zod_1.z.number().nullable(),
    components: zod_1.z
        .array(zod_1.z.object({
        component_code: zod_1.z.string(),
        label: zod_1.z.string(),
        amount: zod_1.z.number(),
        colour_role: zod_1.z.string().nullable().optional(),
    }))
        .default([]),
    claim_refs: zod_1.z.array(zod_1.z.string()).default([]),
});
/** Constitutional activity stream — projected truth events only. */
exports.ActivityEntrySchema = zod_1.z.object({
    activity_code: zod_1.z.string(),
    category: zod_1.z.string(),
    occurred_at: zod_1.z.string(),
    title: zod_1.z.string(),
    summary: zod_1.z.string().nullable(),
    badge: exports.BadgePresentationSchema.nullable().optional(),
    object_ref: zod_1.z.string().nullable().optional(),
});
exports.PublicRecordSchema = zod_1.z.object({
    record_type: zod_1.z.string(),
    subject_object_id: zod_1.z.string(),
    slug: zod_1.z.string(),
    layout_template: zod_1.z.string(),
    layout_order: zod_1.z.array(zod_1.z.string()),
    display: zod_1.z.object({
        subject_name: zod_1.z.string(),
        subject_kind: zod_1.z.string(),
        subject_icon_glyph: zod_1.z.string(),
        breadcrumb: zod_1.z.array(zod_1.z.object({ object_id: zod_1.z.string(), name: zod_1.z.string() })),
        owner: zod_1.z.object({ object_id: zod_1.z.string(), name: zod_1.z.string() }).nullable(),
    }),
    sections: zod_1.z.record(exports.RecordSectionSchema),
    context: zod_1.z.array(exports.ContextEntrySchema),
    civic_journey: zod_1.z.array(exports.CivicJourneyStepSchema).default([]),
    provenance: zod_1.z.object({
        built_at: zod_1.z.string(),
        build_input_hash: zod_1.z.string(),
        projection_version: zod_1.z.number(),
        builder: zod_1.z.string(),
    }),
    /* ---- optional future projection regions (zero-assumption rendering) ---- */
    identity: zod_1.z
        .object({
        header: exports.MediaProjectionSchema.nullable().optional(),
        logo: exports.MediaProjectionSchema.nullable().optional(),
        facts: zod_1.z.array(exports.IdentityFactSchema).optional(),
    })
        .nullable()
        .optional(),
    budget: exports.BudgetProjectionSchema.nullable().optional(),
    activity: zod_1.z.array(exports.ActivityEntrySchema).nullable().optional(),
});
exports.NavigationIndexSchema = zod_1.z.object({
    record_type: zod_1.z.string(),
    built_at: zod_1.z.string(),
    groups: zod_1.z.array(zod_1.z.object({
        group_object_id: zod_1.z.string(),
        group_name: zod_1.z.string(),
        records: zod_1.z.array(zod_1.z.object({
            slug: zod_1.z.string(),
            subject_object_id: zod_1.z.string(),
            name: zod_1.z.string(),
        })),
    })),
});
//# sourceMappingURL=contracts.js.map