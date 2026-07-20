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
export declare const BadgePresentationSchema: z.ZodObject<{
    badge_code: z.ZodString;
    label: z.ZodString;
    colour_role: z.ZodString;
    colour_hex: z.ZodString;
    surface_mark: z.ZodString;
    surface_mark_treatment: z.ZodString;
}, "strip", z.ZodTypeAny, {
    badge_code: string;
    label: string;
    colour_role: string;
    colour_hex: string;
    surface_mark: string;
    surface_mark_treatment: string;
}, {
    badge_code: string;
    label: string;
    colour_role: string;
    colour_hex: string;
    surface_mark: string;
    surface_mark_treatment: string;
}>;
export declare const MissingnessSchema: z.ZodObject<{
    missingness_state: z.ZodString;
    label: z.ZodString;
    colour_role: z.ZodString;
    colour_hex: z.ZodString;
    explanation: z.ZodString;
}, "strip", z.ZodTypeAny, {
    label: string;
    colour_role: string;
    colour_hex: string;
    missingness_state: string;
    explanation: string;
}, {
    label: string;
    colour_role: string;
    colour_hex: string;
    missingness_state: string;
    explanation: string;
}>;
export declare const SectionAnswerSchema: z.ZodObject<{
    kind: z.ZodString;
    value: z.ZodString;
    display_name: z.ZodNullable<z.ZodString>;
    portrait: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    value: string;
    kind: string;
    display_name: string | null;
    portrait: string | null;
}, {
    value: string;
    kind: string;
    display_name: string | null;
    portrait: string | null;
}>;
export declare const VerificationSchema: z.ZodObject<{
    claim_id: z.ZodOptional<z.ZodString>;
    verification_status: z.ZodOptional<z.ZodString>;
    badge_code: z.ZodOptional<z.ZodString>;
    assessed_at: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    claim_id: z.ZodOptional<z.ZodString>;
    verification_status: z.ZodOptional<z.ZodString>;
    badge_code: z.ZodOptional<z.ZodString>;
    assessed_at: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    claim_id: z.ZodOptional<z.ZodString>;
    verification_status: z.ZodOptional<z.ZodString>;
    badge_code: z.ZodOptional<z.ZodString>;
    assessed_at: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>;
export declare const RecordSectionSchema: z.ZodObject<{
    section_code: z.ZodString;
    question: z.ZodString;
    /** Registry-governed display label (e.g. "Executive Chairman"). */
    display_label: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    layout_slot: z.ZodString;
    projection_form: z.ZodString;
    claim_ref: z.ZodNullable<z.ZodString>;
    valid_from: z.ZodNullable<z.ZodString>;
    valid_to: z.ZodNullable<z.ZodString>;
    answer: z.ZodNullable<z.ZodObject<{
        kind: z.ZodString;
        value: z.ZodString;
        display_name: z.ZodNullable<z.ZodString>;
        portrait: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        value: string;
        kind: string;
        display_name: string | null;
        portrait: string | null;
    }, {
        value: string;
        kind: string;
        display_name: string | null;
        portrait: string | null;
    }>>;
    missingness: z.ZodNullable<z.ZodObject<{
        missingness_state: z.ZodString;
        label: z.ZodString;
        colour_role: z.ZodString;
        colour_hex: z.ZodString;
        explanation: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        label: string;
        colour_role: string;
        colour_hex: string;
        missingness_state: string;
        explanation: string;
    }, {
        label: string;
        colour_role: string;
        colour_hex: string;
        missingness_state: string;
        explanation: string;
    }>>;
    verification: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        claim_id: z.ZodOptional<z.ZodString>;
        verification_status: z.ZodOptional<z.ZodString>;
        badge_code: z.ZodOptional<z.ZodString>;
        assessed_at: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        claim_id: z.ZodOptional<z.ZodString>;
        verification_status: z.ZodOptional<z.ZodString>;
        badge_code: z.ZodOptional<z.ZodString>;
        assessed_at: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        claim_id: z.ZodOptional<z.ZodString>;
        verification_status: z.ZodOptional<z.ZodString>;
        badge_code: z.ZodOptional<z.ZodString>;
        assessed_at: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>>>;
    badge: z.ZodObject<{
        badge_code: z.ZodString;
        label: z.ZodString;
        colour_role: z.ZodString;
        colour_hex: z.ZodString;
        surface_mark: z.ZodString;
        surface_mark_treatment: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        badge_code: string;
        label: string;
        colour_role: string;
        colour_hex: string;
        surface_mark: string;
        surface_mark_treatment: string;
    }, {
        badge_code: string;
        label: string;
        colour_role: string;
        colour_hex: string;
        surface_mark: string;
        surface_mark_treatment: string;
    }>;
    evidence: z.ZodOptional<z.ZodNullable<z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    section_code: string;
    question: string;
    display_label: string | null;
    layout_slot: string;
    projection_form: string;
    claim_ref: string | null;
    valid_from: string | null;
    valid_to: string | null;
    answer: {
        value: string;
        kind: string;
        display_name: string | null;
        portrait: string | null;
    } | null;
    missingness: {
        label: string;
        colour_role: string;
        colour_hex: string;
        missingness_state: string;
        explanation: string;
    } | null;
    badge: {
        badge_code: string;
        label: string;
        colour_role: string;
        colour_hex: string;
        surface_mark: string;
        surface_mark_treatment: string;
    };
    verification?: z.objectOutputType<{
        claim_id: z.ZodOptional<z.ZodString>;
        verification_status: z.ZodOptional<z.ZodString>;
        badge_code: z.ZodOptional<z.ZodString>;
        assessed_at: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough"> | null | undefined;
    evidence?: unknown;
}, {
    section_code: string;
    question: string;
    layout_slot: string;
    projection_form: string;
    claim_ref: string | null;
    valid_from: string | null;
    valid_to: string | null;
    answer: {
        value: string;
        kind: string;
        display_name: string | null;
        portrait: string | null;
    } | null;
    missingness: {
        label: string;
        colour_role: string;
        colour_hex: string;
        missingness_state: string;
        explanation: string;
    } | null;
    badge: {
        badge_code: string;
        label: string;
        colour_role: string;
        colour_hex: string;
        surface_mark: string;
        surface_mark_treatment: string;
    };
    display_label?: string | null | undefined;
    verification?: z.objectInputType<{
        claim_id: z.ZodOptional<z.ZodString>;
        verification_status: z.ZodOptional<z.ZodString>;
        badge_code: z.ZodOptional<z.ZodString>;
        assessed_at: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough"> | null | undefined;
    evidence?: unknown;
}>;
/** Registry-governed presentation hints for a context entry. */
export declare const ContextPresentationSchema: z.ZodObject<{
    icon: z.ZodString;
    accent_role: z.ZodString;
    accent_hex: z.ZodString;
}, "strip", z.ZodTypeAny, {
    icon: string;
    accent_role: string;
    accent_hex: string;
}, {
    icon: string;
    accent_role: string;
    accent_hex: string;
}>;
export declare const ContextEntrySchema: z.ZodObject<{
    provider: z.ZodString;
    label: z.ZodString;
    layout_slot: z.ZodString;
    presentation: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        icon: z.ZodString;
        accent_role: z.ZodString;
        accent_hex: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        icon: string;
        accent_role: string;
        accent_hex: string;
    }, {
        icon: string;
        accent_role: string;
        accent_hex: string;
    }>>>>;
    data_origin: z.ZodString;
    person_id: z.ZodNullable<z.ZodString>;
    display_name: z.ZodNullable<z.ZodString>;
    party: z.ZodNullable<z.ZodObject<{
        party_id: z.ZodNullable<z.ZodString>;
        name: z.ZodString;
        acronym: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        party_id: string | null;
        name: string;
        acronym: string | null;
    }, {
        party_id: string | null;
        name: string;
        acronym: string | null;
    }>>;
    detail: z.ZodNullable<z.ZodString>;
    badge: z.ZodObject<{
        badge_code: z.ZodString;
        label: z.ZodString;
        colour_role: z.ZodString;
        colour_hex: z.ZodString;
        surface_mark: z.ZodString;
        surface_mark_treatment: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        badge_code: string;
        label: string;
        colour_role: string;
        colour_hex: string;
        surface_mark: string;
        surface_mark_treatment: string;
    }, {
        badge_code: string;
        label: string;
        colour_role: string;
        colour_hex: string;
        surface_mark: string;
        surface_mark_treatment: string;
    }>;
    missingness: z.ZodNullable<z.ZodObject<{
        missingness_state: z.ZodString;
        label: z.ZodString;
        colour_role: z.ZodString;
        colour_hex: z.ZodString;
        explanation: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        label: string;
        colour_role: string;
        colour_hex: string;
        missingness_state: string;
        explanation: string;
    }, {
        label: string;
        colour_role: string;
        colour_hex: string;
        missingness_state: string;
        explanation: string;
    }>>;
    source_references: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    label: string;
    display_name: string | null;
    layout_slot: string;
    missingness: {
        label: string;
        colour_role: string;
        colour_hex: string;
        missingness_state: string;
        explanation: string;
    } | null;
    badge: {
        badge_code: string;
        label: string;
        colour_role: string;
        colour_hex: string;
        surface_mark: string;
        surface_mark_treatment: string;
    };
    provider: string;
    presentation: {
        icon: string;
        accent_role: string;
        accent_hex: string;
    } | null;
    data_origin: string;
    person_id: string | null;
    party: {
        party_id: string | null;
        name: string;
        acronym: string | null;
    } | null;
    detail: string | null;
    source_references: string[];
}, {
    label: string;
    display_name: string | null;
    layout_slot: string;
    missingness: {
        label: string;
        colour_role: string;
        colour_hex: string;
        missingness_state: string;
        explanation: string;
    } | null;
    badge: {
        badge_code: string;
        label: string;
        colour_role: string;
        colour_hex: string;
        surface_mark: string;
        surface_mark_treatment: string;
    };
    provider: string;
    data_origin: string;
    person_id: string | null;
    party: {
        party_id: string | null;
        name: string;
        acronym: string | null;
    } | null;
    detail: string | null;
    source_references: string[];
    presentation?: {
        icon: string;
        accent_role: string;
        accent_hex: string;
    } | null | undefined;
}>;
export declare const CivicJourneyStepSchema: z.ZodObject<{
    step_code: z.ZodString;
    title: z.ZodString;
    body: z.ZodString;
    source_reference: z.ZodString;
}, "strip", z.ZodTypeAny, {
    step_code: string;
    title: string;
    body: string;
    source_reference: string;
}, {
    step_code: string;
    title: string;
    body: string;
    source_reference: string;
}>;
/** Media locator — future identity expansion. Never assumed present. */
export declare const MediaProjectionSchema: z.ZodObject<{
    locator: z.ZodNullable<z.ZodString>;
    alt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    credit: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    locator: string | null;
    alt?: string | null | undefined;
    credit?: string | null | undefined;
}, {
    locator: string | null;
    alt?: string | null | undefined;
    credit?: string | null | undefined;
}>;
/** Quick-fact — future identity expansion. */
export declare const IdentityFactSchema: z.ZodObject<{
    fact_code: z.ZodString;
    label: z.ZodString;
    value: z.ZodNullable<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
    unit: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    as_of: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    missingness: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        missingness_state: z.ZodString;
        label: z.ZodString;
        colour_role: z.ZodString;
        colour_hex: z.ZodString;
        explanation: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        label: string;
        colour_role: string;
        colour_hex: string;
        missingness_state: string;
        explanation: string;
    }, {
        label: string;
        colour_role: string;
        colour_hex: string;
        missingness_state: string;
        explanation: string;
    }>>>;
}, "strip", z.ZodTypeAny, {
    label: string;
    value: string | number | null;
    fact_code: string;
    missingness?: {
        label: string;
        colour_role: string;
        colour_hex: string;
        missingness_state: string;
        explanation: string;
    } | null | undefined;
    unit?: string | null | undefined;
    as_of?: string | null | undefined;
}, {
    label: string;
    value: string | number | null;
    fact_code: string;
    missingness?: {
        label: string;
        colour_role: string;
        colour_hex: string;
        missingness_state: string;
        explanation: string;
    } | null | undefined;
    unit?: string | null | undefined;
    as_of?: string | null | undefined;
}>;
/** Budget region — projected fiscal claims. Absent until truth is admitted. */
export declare const BudgetProjectionSchema: z.ZodObject<{
    posture: z.ZodEnum<["APPROVED_LATEST", "KNOWN_LATEST", "MISSING"]>;
    /** Registry-governed heading ("Latest Approved Budget"). Never app-authored. */
    posture_label: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    /** Registry-governed total caption ("Total Approved Budget"). */
    total_label: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    fiscal_year: z.ZodNullable<z.ZodString>;
    currency: z.ZodDefault<z.ZodString>;
    total: z.ZodNullable<z.ZodNumber>;
    components: z.ZodDefault<z.ZodArray<z.ZodObject<{
        component_code: z.ZodString;
        label: z.ZodString;
        amount: z.ZodNumber;
        colour_role: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        label: string;
        component_code: string;
        amount: number;
        colour_role?: string | null | undefined;
    }, {
        label: string;
        component_code: string;
        amount: number;
        colour_role?: string | null | undefined;
    }>, "many">>;
    claim_refs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    posture: "APPROVED_LATEST" | "KNOWN_LATEST" | "MISSING";
    posture_label: string | null;
    total_label: string | null;
    fiscal_year: string | null;
    currency: string;
    total: number | null;
    components: {
        label: string;
        component_code: string;
        amount: number;
        colour_role?: string | null | undefined;
    }[];
    claim_refs: string[];
}, {
    posture: "APPROVED_LATEST" | "KNOWN_LATEST" | "MISSING";
    fiscal_year: string | null;
    total: number | null;
    posture_label?: string | null | undefined;
    total_label?: string | null | undefined;
    currency?: string | undefined;
    components?: {
        label: string;
        component_code: string;
        amount: number;
        colour_role?: string | null | undefined;
    }[] | undefined;
    claim_refs?: string[] | undefined;
}>;
/** Constitutional activity stream — projected truth events only. */
export declare const ActivityEntrySchema: z.ZodObject<{
    activity_code: z.ZodString;
    category: z.ZodString;
    /** Registry-governed presentation for the category (icon code + colour role). */
    presentation: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        icon: z.ZodString;
        colour_role: z.ZodString;
        colour_hex: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        colour_role: string;
        colour_hex: string;
        icon: string;
    }, {
        colour_role: string;
        colour_hex: string;
        icon: string;
    }>>>>;
    occurred_at: z.ZodString;
    title: z.ZodString;
    summary: z.ZodNullable<z.ZodString>;
    badge: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        badge_code: z.ZodString;
        label: z.ZodString;
        colour_role: z.ZodString;
        colour_hex: z.ZodString;
        surface_mark: z.ZodString;
        surface_mark_treatment: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        badge_code: string;
        label: string;
        colour_role: string;
        colour_hex: string;
        surface_mark: string;
        surface_mark_treatment: string;
    }, {
        badge_code: string;
        label: string;
        colour_role: string;
        colour_hex: string;
        surface_mark: string;
        surface_mark_treatment: string;
    }>>>;
    object_ref: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    presentation: {
        colour_role: string;
        colour_hex: string;
        icon: string;
    } | null;
    title: string;
    activity_code: string;
    category: string;
    occurred_at: string;
    summary: string | null;
    badge?: {
        badge_code: string;
        label: string;
        colour_role: string;
        colour_hex: string;
        surface_mark: string;
        surface_mark_treatment: string;
    } | null | undefined;
    object_ref?: string | null | undefined;
}, {
    title: string;
    activity_code: string;
    category: string;
    occurred_at: string;
    summary: string | null;
    badge?: {
        badge_code: string;
        label: string;
        colour_role: string;
        colour_hex: string;
        surface_mark: string;
        surface_mark_treatment: string;
    } | null | undefined;
    presentation?: {
        colour_role: string;
        colour_hex: string;
        icon: string;
    } | null | undefined;
    object_ref?: string | null | undefined;
}>;
export declare const PublicRecordSchema: z.ZodObject<{
    record_type: z.ZodString;
    subject_object_id: z.ZodString;
    slug: z.ZodString;
    layout_template: z.ZodString;
    layout_order: z.ZodArray<z.ZodString, "many">;
    display: z.ZodObject<{
        subject_name: z.ZodString;
        subject_kind: z.ZodString;
        subject_icon_glyph: z.ZodString;
        breadcrumb: z.ZodArray<z.ZodObject<{
            object_id: z.ZodString;
            name: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            object_id: string;
        }, {
            name: string;
            object_id: string;
        }>, "many">;
        owner: z.ZodNullable<z.ZodObject<{
            object_id: z.ZodString;
            name: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            object_id: string;
        }, {
            name: string;
            object_id: string;
        }>>;
    }, "strip", z.ZodTypeAny, {
        subject_name: string;
        subject_kind: string;
        subject_icon_glyph: string;
        breadcrumb: {
            name: string;
            object_id: string;
        }[];
        owner: {
            name: string;
            object_id: string;
        } | null;
    }, {
        subject_name: string;
        subject_kind: string;
        subject_icon_glyph: string;
        breadcrumb: {
            name: string;
            object_id: string;
        }[];
        owner: {
            name: string;
            object_id: string;
        } | null;
    }>;
    sections: z.ZodRecord<z.ZodString, z.ZodObject<{
        section_code: z.ZodString;
        question: z.ZodString;
        /** Registry-governed display label (e.g. "Executive Chairman"). */
        display_label: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
        layout_slot: z.ZodString;
        projection_form: z.ZodString;
        claim_ref: z.ZodNullable<z.ZodString>;
        valid_from: z.ZodNullable<z.ZodString>;
        valid_to: z.ZodNullable<z.ZodString>;
        answer: z.ZodNullable<z.ZodObject<{
            kind: z.ZodString;
            value: z.ZodString;
            display_name: z.ZodNullable<z.ZodString>;
            portrait: z.ZodNullable<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            value: string;
            kind: string;
            display_name: string | null;
            portrait: string | null;
        }, {
            value: string;
            kind: string;
            display_name: string | null;
            portrait: string | null;
        }>>;
        missingness: z.ZodNullable<z.ZodObject<{
            missingness_state: z.ZodString;
            label: z.ZodString;
            colour_role: z.ZodString;
            colour_hex: z.ZodString;
            explanation: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            label: string;
            colour_role: string;
            colour_hex: string;
            missingness_state: string;
            explanation: string;
        }, {
            label: string;
            colour_role: string;
            colour_hex: string;
            missingness_state: string;
            explanation: string;
        }>>;
        verification: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            claim_id: z.ZodOptional<z.ZodString>;
            verification_status: z.ZodOptional<z.ZodString>;
            badge_code: z.ZodOptional<z.ZodString>;
            assessed_at: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            claim_id: z.ZodOptional<z.ZodString>;
            verification_status: z.ZodOptional<z.ZodString>;
            badge_code: z.ZodOptional<z.ZodString>;
            assessed_at: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            claim_id: z.ZodOptional<z.ZodString>;
            verification_status: z.ZodOptional<z.ZodString>;
            badge_code: z.ZodOptional<z.ZodString>;
            assessed_at: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>>>;
        badge: z.ZodObject<{
            badge_code: z.ZodString;
            label: z.ZodString;
            colour_role: z.ZodString;
            colour_hex: z.ZodString;
            surface_mark: z.ZodString;
            surface_mark_treatment: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            badge_code: string;
            label: string;
            colour_role: string;
            colour_hex: string;
            surface_mark: string;
            surface_mark_treatment: string;
        }, {
            badge_code: string;
            label: string;
            colour_role: string;
            colour_hex: string;
            surface_mark: string;
            surface_mark_treatment: string;
        }>;
        evidence: z.ZodOptional<z.ZodNullable<z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        section_code: string;
        question: string;
        display_label: string | null;
        layout_slot: string;
        projection_form: string;
        claim_ref: string | null;
        valid_from: string | null;
        valid_to: string | null;
        answer: {
            value: string;
            kind: string;
            display_name: string | null;
            portrait: string | null;
        } | null;
        missingness: {
            label: string;
            colour_role: string;
            colour_hex: string;
            missingness_state: string;
            explanation: string;
        } | null;
        badge: {
            badge_code: string;
            label: string;
            colour_role: string;
            colour_hex: string;
            surface_mark: string;
            surface_mark_treatment: string;
        };
        verification?: z.objectOutputType<{
            claim_id: z.ZodOptional<z.ZodString>;
            verification_status: z.ZodOptional<z.ZodString>;
            badge_code: z.ZodOptional<z.ZodString>;
            assessed_at: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough"> | null | undefined;
        evidence?: unknown;
    }, {
        section_code: string;
        question: string;
        layout_slot: string;
        projection_form: string;
        claim_ref: string | null;
        valid_from: string | null;
        valid_to: string | null;
        answer: {
            value: string;
            kind: string;
            display_name: string | null;
            portrait: string | null;
        } | null;
        missingness: {
            label: string;
            colour_role: string;
            colour_hex: string;
            missingness_state: string;
            explanation: string;
        } | null;
        badge: {
            badge_code: string;
            label: string;
            colour_role: string;
            colour_hex: string;
            surface_mark: string;
            surface_mark_treatment: string;
        };
        display_label?: string | null | undefined;
        verification?: z.objectInputType<{
            claim_id: z.ZodOptional<z.ZodString>;
            verification_status: z.ZodOptional<z.ZodString>;
            badge_code: z.ZodOptional<z.ZodString>;
            assessed_at: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough"> | null | undefined;
        evidence?: unknown;
    }>>;
    context: z.ZodArray<z.ZodObject<{
        provider: z.ZodString;
        label: z.ZodString;
        layout_slot: z.ZodString;
        presentation: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            icon: z.ZodString;
            accent_role: z.ZodString;
            accent_hex: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            icon: string;
            accent_role: string;
            accent_hex: string;
        }, {
            icon: string;
            accent_role: string;
            accent_hex: string;
        }>>>>;
        data_origin: z.ZodString;
        person_id: z.ZodNullable<z.ZodString>;
        display_name: z.ZodNullable<z.ZodString>;
        party: z.ZodNullable<z.ZodObject<{
            party_id: z.ZodNullable<z.ZodString>;
            name: z.ZodString;
            acronym: z.ZodNullable<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            party_id: string | null;
            name: string;
            acronym: string | null;
        }, {
            party_id: string | null;
            name: string;
            acronym: string | null;
        }>>;
        detail: z.ZodNullable<z.ZodString>;
        badge: z.ZodObject<{
            badge_code: z.ZodString;
            label: z.ZodString;
            colour_role: z.ZodString;
            colour_hex: z.ZodString;
            surface_mark: z.ZodString;
            surface_mark_treatment: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            badge_code: string;
            label: string;
            colour_role: string;
            colour_hex: string;
            surface_mark: string;
            surface_mark_treatment: string;
        }, {
            badge_code: string;
            label: string;
            colour_role: string;
            colour_hex: string;
            surface_mark: string;
            surface_mark_treatment: string;
        }>;
        missingness: z.ZodNullable<z.ZodObject<{
            missingness_state: z.ZodString;
            label: z.ZodString;
            colour_role: z.ZodString;
            colour_hex: z.ZodString;
            explanation: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            label: string;
            colour_role: string;
            colour_hex: string;
            missingness_state: string;
            explanation: string;
        }, {
            label: string;
            colour_role: string;
            colour_hex: string;
            missingness_state: string;
            explanation: string;
        }>>;
        source_references: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        label: string;
        display_name: string | null;
        layout_slot: string;
        missingness: {
            label: string;
            colour_role: string;
            colour_hex: string;
            missingness_state: string;
            explanation: string;
        } | null;
        badge: {
            badge_code: string;
            label: string;
            colour_role: string;
            colour_hex: string;
            surface_mark: string;
            surface_mark_treatment: string;
        };
        provider: string;
        presentation: {
            icon: string;
            accent_role: string;
            accent_hex: string;
        } | null;
        data_origin: string;
        person_id: string | null;
        party: {
            party_id: string | null;
            name: string;
            acronym: string | null;
        } | null;
        detail: string | null;
        source_references: string[];
    }, {
        label: string;
        display_name: string | null;
        layout_slot: string;
        missingness: {
            label: string;
            colour_role: string;
            colour_hex: string;
            missingness_state: string;
            explanation: string;
        } | null;
        badge: {
            badge_code: string;
            label: string;
            colour_role: string;
            colour_hex: string;
            surface_mark: string;
            surface_mark_treatment: string;
        };
        provider: string;
        data_origin: string;
        person_id: string | null;
        party: {
            party_id: string | null;
            name: string;
            acronym: string | null;
        } | null;
        detail: string | null;
        source_references: string[];
        presentation?: {
            icon: string;
            accent_role: string;
            accent_hex: string;
        } | null | undefined;
    }>, "many">;
    civic_journey: z.ZodDefault<z.ZodArray<z.ZodObject<{
        step_code: z.ZodString;
        title: z.ZodString;
        body: z.ZodString;
        source_reference: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        step_code: string;
        title: string;
        body: string;
        source_reference: string;
    }, {
        step_code: string;
        title: string;
        body: string;
        source_reference: string;
    }>, "many">>;
    /** Registry-governed copy for designed absences (MISSING_PORTRAIT…). */
    placeholders: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        title: z.ZodString;
        body: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        title: string;
        body: string;
    }, {
        title: string;
        body: string;
    }>>>>;
    /** Registry-governed cross-section display vocabulary. */
    vocabulary: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>>;
    provenance: z.ZodObject<{
        built_at: z.ZodString;
        build_input_hash: z.ZodString;
        projection_version: z.ZodNumber;
        builder: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        built_at: string;
        build_input_hash: string;
        projection_version: number;
        builder: string;
    }, {
        built_at: string;
        build_input_hash: string;
        projection_version: number;
        builder: string;
    }>;
    identity: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        header: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            locator: z.ZodNullable<z.ZodString>;
            alt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            credit: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            locator: string | null;
            alt?: string | null | undefined;
            credit?: string | null | undefined;
        }, {
            locator: string | null;
            alt?: string | null | undefined;
            credit?: string | null | undefined;
        }>>>;
        logo: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            locator: z.ZodNullable<z.ZodString>;
            alt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            credit: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            locator: string | null;
            alt?: string | null | undefined;
            credit?: string | null | undefined;
        }, {
            locator: string | null;
            alt?: string | null | undefined;
            credit?: string | null | undefined;
        }>>>;
        facts: z.ZodOptional<z.ZodArray<z.ZodObject<{
            fact_code: z.ZodString;
            label: z.ZodString;
            value: z.ZodNullable<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            unit: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            as_of: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            missingness: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                missingness_state: z.ZodString;
                label: z.ZodString;
                colour_role: z.ZodString;
                colour_hex: z.ZodString;
                explanation: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                label: string;
                colour_role: string;
                colour_hex: string;
                missingness_state: string;
                explanation: string;
            }, {
                label: string;
                colour_role: string;
                colour_hex: string;
                missingness_state: string;
                explanation: string;
            }>>>;
        }, "strip", z.ZodTypeAny, {
            label: string;
            value: string | number | null;
            fact_code: string;
            missingness?: {
                label: string;
                colour_role: string;
                colour_hex: string;
                missingness_state: string;
                explanation: string;
            } | null | undefined;
            unit?: string | null | undefined;
            as_of?: string | null | undefined;
        }, {
            label: string;
            value: string | number | null;
            fact_code: string;
            missingness?: {
                label: string;
                colour_role: string;
                colour_hex: string;
                missingness_state: string;
                explanation: string;
            } | null | undefined;
            unit?: string | null | undefined;
            as_of?: string | null | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        header?: {
            locator: string | null;
            alt?: string | null | undefined;
            credit?: string | null | undefined;
        } | null | undefined;
        logo?: {
            locator: string | null;
            alt?: string | null | undefined;
            credit?: string | null | undefined;
        } | null | undefined;
        facts?: {
            label: string;
            value: string | number | null;
            fact_code: string;
            missingness?: {
                label: string;
                colour_role: string;
                colour_hex: string;
                missingness_state: string;
                explanation: string;
            } | null | undefined;
            unit?: string | null | undefined;
            as_of?: string | null | undefined;
        }[] | undefined;
    }, {
        header?: {
            locator: string | null;
            alt?: string | null | undefined;
            credit?: string | null | undefined;
        } | null | undefined;
        logo?: {
            locator: string | null;
            alt?: string | null | undefined;
            credit?: string | null | undefined;
        } | null | undefined;
        facts?: {
            label: string;
            value: string | number | null;
            fact_code: string;
            missingness?: {
                label: string;
                colour_role: string;
                colour_hex: string;
                missingness_state: string;
                explanation: string;
            } | null | undefined;
            unit?: string | null | undefined;
            as_of?: string | null | undefined;
        }[] | undefined;
    }>>>;
    budget: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        posture: z.ZodEnum<["APPROVED_LATEST", "KNOWN_LATEST", "MISSING"]>;
        /** Registry-governed heading ("Latest Approved Budget"). Never app-authored. */
        posture_label: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
        /** Registry-governed total caption ("Total Approved Budget"). */
        total_label: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
        fiscal_year: z.ZodNullable<z.ZodString>;
        currency: z.ZodDefault<z.ZodString>;
        total: z.ZodNullable<z.ZodNumber>;
        components: z.ZodDefault<z.ZodArray<z.ZodObject<{
            component_code: z.ZodString;
            label: z.ZodString;
            amount: z.ZodNumber;
            colour_role: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            label: string;
            component_code: string;
            amount: number;
            colour_role?: string | null | undefined;
        }, {
            label: string;
            component_code: string;
            amount: number;
            colour_role?: string | null | undefined;
        }>, "many">>;
        claim_refs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        posture: "APPROVED_LATEST" | "KNOWN_LATEST" | "MISSING";
        posture_label: string | null;
        total_label: string | null;
        fiscal_year: string | null;
        currency: string;
        total: number | null;
        components: {
            label: string;
            component_code: string;
            amount: number;
            colour_role?: string | null | undefined;
        }[];
        claim_refs: string[];
    }, {
        posture: "APPROVED_LATEST" | "KNOWN_LATEST" | "MISSING";
        fiscal_year: string | null;
        total: number | null;
        posture_label?: string | null | undefined;
        total_label?: string | null | undefined;
        currency?: string | undefined;
        components?: {
            label: string;
            component_code: string;
            amount: number;
            colour_role?: string | null | undefined;
        }[] | undefined;
        claim_refs?: string[] | undefined;
    }>>>;
    activity: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
        activity_code: z.ZodString;
        category: z.ZodString;
        /** Registry-governed presentation for the category (icon code + colour role). */
        presentation: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            icon: z.ZodString;
            colour_role: z.ZodString;
            colour_hex: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            colour_role: string;
            colour_hex: string;
            icon: string;
        }, {
            colour_role: string;
            colour_hex: string;
            icon: string;
        }>>>>;
        occurred_at: z.ZodString;
        title: z.ZodString;
        summary: z.ZodNullable<z.ZodString>;
        badge: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            badge_code: z.ZodString;
            label: z.ZodString;
            colour_role: z.ZodString;
            colour_hex: z.ZodString;
            surface_mark: z.ZodString;
            surface_mark_treatment: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            badge_code: string;
            label: string;
            colour_role: string;
            colour_hex: string;
            surface_mark: string;
            surface_mark_treatment: string;
        }, {
            badge_code: string;
            label: string;
            colour_role: string;
            colour_hex: string;
            surface_mark: string;
            surface_mark_treatment: string;
        }>>>;
        object_ref: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        presentation: {
            colour_role: string;
            colour_hex: string;
            icon: string;
        } | null;
        title: string;
        activity_code: string;
        category: string;
        occurred_at: string;
        summary: string | null;
        badge?: {
            badge_code: string;
            label: string;
            colour_role: string;
            colour_hex: string;
            surface_mark: string;
            surface_mark_treatment: string;
        } | null | undefined;
        object_ref?: string | null | undefined;
    }, {
        title: string;
        activity_code: string;
        category: string;
        occurred_at: string;
        summary: string | null;
        badge?: {
            badge_code: string;
            label: string;
            colour_role: string;
            colour_hex: string;
            surface_mark: string;
            surface_mark_treatment: string;
        } | null | undefined;
        presentation?: {
            colour_role: string;
            colour_hex: string;
            icon: string;
        } | null | undefined;
        object_ref?: string | null | undefined;
    }>, "many">>>;
}, "strip", z.ZodTypeAny, {
    record_type: string;
    subject_object_id: string;
    slug: string;
    layout_template: string;
    layout_order: string[];
    display: {
        subject_name: string;
        subject_kind: string;
        subject_icon_glyph: string;
        breadcrumb: {
            name: string;
            object_id: string;
        }[];
        owner: {
            name: string;
            object_id: string;
        } | null;
    };
    sections: Record<string, {
        section_code: string;
        question: string;
        display_label: string | null;
        layout_slot: string;
        projection_form: string;
        claim_ref: string | null;
        valid_from: string | null;
        valid_to: string | null;
        answer: {
            value: string;
            kind: string;
            display_name: string | null;
            portrait: string | null;
        } | null;
        missingness: {
            label: string;
            colour_role: string;
            colour_hex: string;
            missingness_state: string;
            explanation: string;
        } | null;
        badge: {
            badge_code: string;
            label: string;
            colour_role: string;
            colour_hex: string;
            surface_mark: string;
            surface_mark_treatment: string;
        };
        verification?: z.objectOutputType<{
            claim_id: z.ZodOptional<z.ZodString>;
            verification_status: z.ZodOptional<z.ZodString>;
            badge_code: z.ZodOptional<z.ZodString>;
            assessed_at: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough"> | null | undefined;
        evidence?: unknown;
    }>;
    context: {
        label: string;
        display_name: string | null;
        layout_slot: string;
        missingness: {
            label: string;
            colour_role: string;
            colour_hex: string;
            missingness_state: string;
            explanation: string;
        } | null;
        badge: {
            badge_code: string;
            label: string;
            colour_role: string;
            colour_hex: string;
            surface_mark: string;
            surface_mark_treatment: string;
        };
        provider: string;
        presentation: {
            icon: string;
            accent_role: string;
            accent_hex: string;
        } | null;
        data_origin: string;
        person_id: string | null;
        party: {
            party_id: string | null;
            name: string;
            acronym: string | null;
        } | null;
        detail: string | null;
        source_references: string[];
    }[];
    civic_journey: {
        step_code: string;
        title: string;
        body: string;
        source_reference: string;
    }[];
    placeholders: Record<string, {
        title: string;
        body: string;
    }>;
    vocabulary: Record<string, string>;
    provenance: {
        built_at: string;
        build_input_hash: string;
        projection_version: number;
        builder: string;
    };
    identity?: {
        header?: {
            locator: string | null;
            alt?: string | null | undefined;
            credit?: string | null | undefined;
        } | null | undefined;
        logo?: {
            locator: string | null;
            alt?: string | null | undefined;
            credit?: string | null | undefined;
        } | null | undefined;
        facts?: {
            label: string;
            value: string | number | null;
            fact_code: string;
            missingness?: {
                label: string;
                colour_role: string;
                colour_hex: string;
                missingness_state: string;
                explanation: string;
            } | null | undefined;
            unit?: string | null | undefined;
            as_of?: string | null | undefined;
        }[] | undefined;
    } | null | undefined;
    budget?: {
        posture: "APPROVED_LATEST" | "KNOWN_LATEST" | "MISSING";
        posture_label: string | null;
        total_label: string | null;
        fiscal_year: string | null;
        currency: string;
        total: number | null;
        components: {
            label: string;
            component_code: string;
            amount: number;
            colour_role?: string | null | undefined;
        }[];
        claim_refs: string[];
    } | null | undefined;
    activity?: {
        presentation: {
            colour_role: string;
            colour_hex: string;
            icon: string;
        } | null;
        title: string;
        activity_code: string;
        category: string;
        occurred_at: string;
        summary: string | null;
        badge?: {
            badge_code: string;
            label: string;
            colour_role: string;
            colour_hex: string;
            surface_mark: string;
            surface_mark_treatment: string;
        } | null | undefined;
        object_ref?: string | null | undefined;
    }[] | null | undefined;
}, {
    record_type: string;
    subject_object_id: string;
    slug: string;
    layout_template: string;
    layout_order: string[];
    display: {
        subject_name: string;
        subject_kind: string;
        subject_icon_glyph: string;
        breadcrumb: {
            name: string;
            object_id: string;
        }[];
        owner: {
            name: string;
            object_id: string;
        } | null;
    };
    sections: Record<string, {
        section_code: string;
        question: string;
        layout_slot: string;
        projection_form: string;
        claim_ref: string | null;
        valid_from: string | null;
        valid_to: string | null;
        answer: {
            value: string;
            kind: string;
            display_name: string | null;
            portrait: string | null;
        } | null;
        missingness: {
            label: string;
            colour_role: string;
            colour_hex: string;
            missingness_state: string;
            explanation: string;
        } | null;
        badge: {
            badge_code: string;
            label: string;
            colour_role: string;
            colour_hex: string;
            surface_mark: string;
            surface_mark_treatment: string;
        };
        display_label?: string | null | undefined;
        verification?: z.objectInputType<{
            claim_id: z.ZodOptional<z.ZodString>;
            verification_status: z.ZodOptional<z.ZodString>;
            badge_code: z.ZodOptional<z.ZodString>;
            assessed_at: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough"> | null | undefined;
        evidence?: unknown;
    }>;
    context: {
        label: string;
        display_name: string | null;
        layout_slot: string;
        missingness: {
            label: string;
            colour_role: string;
            colour_hex: string;
            missingness_state: string;
            explanation: string;
        } | null;
        badge: {
            badge_code: string;
            label: string;
            colour_role: string;
            colour_hex: string;
            surface_mark: string;
            surface_mark_treatment: string;
        };
        provider: string;
        data_origin: string;
        person_id: string | null;
        party: {
            party_id: string | null;
            name: string;
            acronym: string | null;
        } | null;
        detail: string | null;
        source_references: string[];
        presentation?: {
            icon: string;
            accent_role: string;
            accent_hex: string;
        } | null | undefined;
    }[];
    provenance: {
        built_at: string;
        build_input_hash: string;
        projection_version: number;
        builder: string;
    };
    civic_journey?: {
        step_code: string;
        title: string;
        body: string;
        source_reference: string;
    }[] | undefined;
    placeholders?: Record<string, {
        title: string;
        body: string;
    }> | undefined;
    vocabulary?: Record<string, string> | undefined;
    identity?: {
        header?: {
            locator: string | null;
            alt?: string | null | undefined;
            credit?: string | null | undefined;
        } | null | undefined;
        logo?: {
            locator: string | null;
            alt?: string | null | undefined;
            credit?: string | null | undefined;
        } | null | undefined;
        facts?: {
            label: string;
            value: string | number | null;
            fact_code: string;
            missingness?: {
                label: string;
                colour_role: string;
                colour_hex: string;
                missingness_state: string;
                explanation: string;
            } | null | undefined;
            unit?: string | null | undefined;
            as_of?: string | null | undefined;
        }[] | undefined;
    } | null | undefined;
    budget?: {
        posture: "APPROVED_LATEST" | "KNOWN_LATEST" | "MISSING";
        fiscal_year: string | null;
        total: number | null;
        posture_label?: string | null | undefined;
        total_label?: string | null | undefined;
        currency?: string | undefined;
        components?: {
            label: string;
            component_code: string;
            amount: number;
            colour_role?: string | null | undefined;
        }[] | undefined;
        claim_refs?: string[] | undefined;
    } | null | undefined;
    activity?: {
        title: string;
        activity_code: string;
        category: string;
        occurred_at: string;
        summary: string | null;
        badge?: {
            badge_code: string;
            label: string;
            colour_role: string;
            colour_hex: string;
            surface_mark: string;
            surface_mark_treatment: string;
        } | null | undefined;
        presentation?: {
            colour_role: string;
            colour_hex: string;
            icon: string;
        } | null | undefined;
        object_ref?: string | null | undefined;
    }[] | null | undefined;
}>;
export declare const NavigationIndexSchema: z.ZodObject<{
    record_type: z.ZodString;
    built_at: z.ZodString;
    groups: z.ZodArray<z.ZodObject<{
        group_object_id: z.ZodString;
        group_name: z.ZodString;
        /** Stable presentation key: slugified name without the " State" suffix. */
        group_code: z.ZodOptional<z.ZodString>;
        /** Display name without the " State" suffix (chips, carousels). */
        group_short_name: z.ZodOptional<z.ZodString>;
        records: z.ZodArray<z.ZodObject<{
            slug: z.ZodString;
            subject_object_id: z.ZodString;
            name: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            subject_object_id: string;
            slug: string;
        }, {
            name: string;
            subject_object_id: string;
            slug: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        group_object_id: string;
        group_name: string;
        records: {
            name: string;
            subject_object_id: string;
            slug: string;
        }[];
        group_code?: string | undefined;
        group_short_name?: string | undefined;
    }, {
        group_object_id: string;
        group_name: string;
        records: {
            name: string;
            subject_object_id: string;
            slug: string;
        }[];
        group_code?: string | undefined;
        group_short_name?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    record_type: string;
    built_at: string;
    groups: {
        group_object_id: string;
        group_name: string;
        records: {
            name: string;
            subject_object_id: string;
            slug: string;
        }[];
        group_code?: string | undefined;
        group_short_name?: string | undefined;
    }[];
}, {
    record_type: string;
    built_at: string;
    groups: {
        group_object_id: string;
        group_name: string;
        records: {
            name: string;
            subject_object_id: string;
            slug: string;
        }[];
        group_code?: string | undefined;
        group_short_name?: string | undefined;
    }[];
}>;
/** Engine 11 search result — references prepared public records only. */
export declare const SearchResultSchema: z.ZodObject<{
    record_type: z.ZodString;
    slug: z.ZodString;
    subject_object_id: z.ZodString;
    title: z.ZodString;
    group_name: z.ZodString;
    answer_summary: z.ZodNullable<z.ZodString>;
    badge_code: z.ZodNullable<z.ZodString>;
    score: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    badge_code: string | null;
    title: string;
    record_type: string;
    subject_object_id: string;
    slug: string;
    group_name: string;
    answer_summary: string | null;
    score: number;
}, {
    badge_code: string | null;
    title: string;
    record_type: string;
    subject_object_id: string;
    slug: string;
    group_name: string;
    answer_summary: string | null;
    score: number;
}>;
export declare const SearchResponseSchema: z.ZodObject<{
    query: z.ZodString;
    total: z.ZodOptional<z.ZodNumber>;
    results: z.ZodArray<z.ZodObject<{
        record_type: z.ZodString;
        slug: z.ZodString;
        subject_object_id: z.ZodString;
        title: z.ZodString;
        group_name: z.ZodString;
        answer_summary: z.ZodNullable<z.ZodString>;
        badge_code: z.ZodNullable<z.ZodString>;
        score: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        badge_code: string | null;
        title: string;
        record_type: string;
        subject_object_id: string;
        slug: string;
        group_name: string;
        answer_summary: string | null;
        score: number;
    }, {
        badge_code: string | null;
        title: string;
        record_type: string;
        subject_object_id: string;
        slug: string;
        group_name: string;
        answer_summary: string | null;
        score: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    query: string;
    results: {
        badge_code: string | null;
        title: string;
        record_type: string;
        subject_object_id: string;
        slug: string;
        group_name: string;
        answer_summary: string | null;
        score: number;
    }[];
    total?: number | undefined;
}, {
    query: string;
    results: {
        badge_code: string | null;
        title: string;
        record_type: string;
        subject_object_id: string;
        slug: string;
        group_name: string;
        answer_summary: string | null;
        score: number;
    }[];
    total?: number | undefined;
}>;
export type SearchResult = z.infer<typeof SearchResultSchema>;
export type SearchResponse = z.infer<typeof SearchResponseSchema>;
export type ContextPresentation = z.infer<typeof ContextPresentationSchema>;
export type BadgePresentation = z.infer<typeof BadgePresentationSchema>;
export type Missingness = z.infer<typeof MissingnessSchema>;
export type RecordSection = z.infer<typeof RecordSectionSchema>;
export type ContextEntry = z.infer<typeof ContextEntrySchema>;
export type PublicRecord = z.infer<typeof PublicRecordSchema>;
export type NavigationIndex = z.infer<typeof NavigationIndexSchema>;
export type BudgetProjection = z.infer<typeof BudgetProjectionSchema>;
export type ActivityEntry = z.infer<typeof ActivityEntrySchema>;
export type IdentityFact = z.infer<typeof IdentityFactSchema>;
