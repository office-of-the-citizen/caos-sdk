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
}, z.core.$strip>;
export declare const MissingnessSchema: z.ZodObject<{
    missingness_state: z.ZodString;
    label: z.ZodString;
    colour_role: z.ZodString;
    colour_hex: z.ZodString;
    explanation: z.ZodString;
}, z.core.$strip>;
export declare const SectionAnswerSchema: z.ZodObject<{
    kind: z.ZodString;
    value: z.ZodString;
    display_name: z.ZodNullable<z.ZodString>;
    portrait: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
export declare const VerificationSchema: z.ZodObject<{
    claim_id: z.ZodOptional<z.ZodString>;
    verification_status: z.ZodOptional<z.ZodString>;
    badge_code: z.ZodOptional<z.ZodString>;
    assessed_at: z.ZodOptional<z.ZodString>;
}, z.core.$loose>;
export declare const RecordSectionSchema: z.ZodObject<{
    section_code: z.ZodString;
    question: z.ZodString;
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
    }, z.core.$strip>>;
    missingness: z.ZodNullable<z.ZodObject<{
        missingness_state: z.ZodString;
        label: z.ZodString;
        colour_role: z.ZodString;
        colour_hex: z.ZodString;
        explanation: z.ZodString;
    }, z.core.$strip>>;
    verification: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        claim_id: z.ZodOptional<z.ZodString>;
        verification_status: z.ZodOptional<z.ZodString>;
        badge_code: z.ZodOptional<z.ZodString>;
        assessed_at: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>;
    badge: z.ZodObject<{
        badge_code: z.ZodString;
        label: z.ZodString;
        colour_role: z.ZodString;
        colour_hex: z.ZodString;
        surface_mark: z.ZodString;
        surface_mark_treatment: z.ZodString;
    }, z.core.$strip>;
    evidence: z.ZodOptional<z.ZodNullable<z.ZodUnknown>>;
}, z.core.$strip>;
export declare const ContextEntrySchema: z.ZodObject<{
    provider: z.ZodString;
    label: z.ZodString;
    layout_slot: z.ZodString;
    data_origin: z.ZodString;
    person_id: z.ZodNullable<z.ZodString>;
    display_name: z.ZodNullable<z.ZodString>;
    party: z.ZodNullable<z.ZodObject<{
        party_id: z.ZodNullable<z.ZodString>;
        name: z.ZodString;
        acronym: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
    detail: z.ZodNullable<z.ZodString>;
    badge: z.ZodObject<{
        badge_code: z.ZodString;
        label: z.ZodString;
        colour_role: z.ZodString;
        colour_hex: z.ZodString;
        surface_mark: z.ZodString;
        surface_mark_treatment: z.ZodString;
    }, z.core.$strip>;
    missingness: z.ZodNullable<z.ZodObject<{
        missingness_state: z.ZodString;
        label: z.ZodString;
        colour_role: z.ZodString;
        colour_hex: z.ZodString;
        explanation: z.ZodString;
    }, z.core.$strip>>;
    source_references: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export declare const CivicJourneyStepSchema: z.ZodObject<{
    step_code: z.ZodString;
    title: z.ZodString;
    body: z.ZodString;
    source_reference: z.ZodString;
}, z.core.$strip>;
/** Media locator — future identity expansion. Never assumed present. */
export declare const MediaProjectionSchema: z.ZodObject<{
    locator: z.ZodNullable<z.ZodString>;
    alt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    credit: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
/** Quick-fact — future identity expansion. */
export declare const IdentityFactSchema: z.ZodObject<{
    fact_code: z.ZodString;
    label: z.ZodString;
    value: z.ZodNullable<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    unit: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    as_of: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    missingness: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        missingness_state: z.ZodString;
        label: z.ZodString;
        colour_role: z.ZodString;
        colour_hex: z.ZodString;
        explanation: z.ZodString;
    }, z.core.$strip>>>;
}, z.core.$strip>;
/** Budget region — projected fiscal claims. Absent until truth is admitted. */
export declare const BudgetProjectionSchema: z.ZodObject<{
    posture: z.ZodEnum<{
        APPROVED_LATEST: "APPROVED_LATEST";
        KNOWN_LATEST: "KNOWN_LATEST";
        MISSING: "MISSING";
    }>;
    fiscal_year: z.ZodNullable<z.ZodString>;
    currency: z.ZodDefault<z.ZodString>;
    total: z.ZodNullable<z.ZodNumber>;
    components: z.ZodDefault<z.ZodArray<z.ZodObject<{
        component_code: z.ZodString;
        label: z.ZodString;
        amount: z.ZodNumber;
        colour_role: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>>>;
    claim_refs: z.ZodDefault<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
/** Constitutional activity stream — projected truth events only. */
export declare const ActivityEntrySchema: z.ZodObject<{
    activity_code: z.ZodString;
    category: z.ZodString;
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
    }, z.core.$strip>>>;
    object_ref: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export declare const PublicRecordSchema: z.ZodObject<{
    record_type: z.ZodString;
    subject_object_id: z.ZodString;
    slug: z.ZodString;
    layout_template: z.ZodString;
    layout_order: z.ZodArray<z.ZodString>;
    display: z.ZodObject<{
        subject_name: z.ZodString;
        subject_kind: z.ZodString;
        subject_icon_glyph: z.ZodString;
        breadcrumb: z.ZodArray<z.ZodObject<{
            object_id: z.ZodString;
            name: z.ZodString;
        }, z.core.$strip>>;
        owner: z.ZodNullable<z.ZodObject<{
            object_id: z.ZodString;
            name: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>;
    sections: z.ZodRecord<z.core.$ZodRecordKey, z.core.SomeType>;
    context: z.ZodArray<z.ZodObject<{
        provider: z.ZodString;
        label: z.ZodString;
        layout_slot: z.ZodString;
        data_origin: z.ZodString;
        person_id: z.ZodNullable<z.ZodString>;
        display_name: z.ZodNullable<z.ZodString>;
        party: z.ZodNullable<z.ZodObject<{
            party_id: z.ZodNullable<z.ZodString>;
            name: z.ZodString;
            acronym: z.ZodNullable<z.ZodString>;
        }, z.core.$strip>>;
        detail: z.ZodNullable<z.ZodString>;
        badge: z.ZodObject<{
            badge_code: z.ZodString;
            label: z.ZodString;
            colour_role: z.ZodString;
            colour_hex: z.ZodString;
            surface_mark: z.ZodString;
            surface_mark_treatment: z.ZodString;
        }, z.core.$strip>;
        missingness: z.ZodNullable<z.ZodObject<{
            missingness_state: z.ZodString;
            label: z.ZodString;
            colour_role: z.ZodString;
            colour_hex: z.ZodString;
            explanation: z.ZodString;
        }, z.core.$strip>>;
        source_references: z.ZodArray<z.ZodString>;
    }, z.core.$strip>>;
    civic_journey: z.ZodDefault<z.ZodArray<z.ZodObject<{
        step_code: z.ZodString;
        title: z.ZodString;
        body: z.ZodString;
        source_reference: z.ZodString;
    }, z.core.$strip>>>;
    provenance: z.ZodObject<{
        built_at: z.ZodString;
        build_input_hash: z.ZodString;
        projection_version: z.ZodNumber;
        builder: z.ZodString;
    }, z.core.$strip>;
    identity: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        header: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            locator: z.ZodNullable<z.ZodString>;
            alt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            credit: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>>>;
        logo: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            locator: z.ZodNullable<z.ZodString>;
            alt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            credit: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>>>;
        facts: z.ZodOptional<z.ZodArray<z.ZodObject<{
            fact_code: z.ZodString;
            label: z.ZodString;
            value: z.ZodNullable<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
            unit: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            as_of: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            missingness: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                missingness_state: z.ZodString;
                label: z.ZodString;
                colour_role: z.ZodString;
                colour_hex: z.ZodString;
                explanation: z.ZodString;
            }, z.core.$strip>>>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>>;
    budget: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        posture: z.ZodEnum<{
            APPROVED_LATEST: "APPROVED_LATEST";
            KNOWN_LATEST: "KNOWN_LATEST";
            MISSING: "MISSING";
        }>;
        fiscal_year: z.ZodNullable<z.ZodString>;
        currency: z.ZodDefault<z.ZodString>;
        total: z.ZodNullable<z.ZodNumber>;
        components: z.ZodDefault<z.ZodArray<z.ZodObject<{
            component_code: z.ZodString;
            label: z.ZodString;
            amount: z.ZodNumber;
            colour_role: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>>>;
        claim_refs: z.ZodDefault<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>>;
    activity: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
        activity_code: z.ZodString;
        category: z.ZodString;
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
        }, z.core.$strip>>>;
        object_ref: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>>>>;
}, z.core.$strip>;
export declare const NavigationIndexSchema: z.ZodObject<{
    record_type: z.ZodString;
    built_at: z.ZodString;
    groups: z.ZodArray<z.ZodObject<{
        group_object_id: z.ZodString;
        group_name: z.ZodString;
        records: z.ZodArray<z.ZodObject<{
            slug: z.ZodString;
            subject_object_id: z.ZodString;
            name: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type BadgePresentation = z.infer<typeof BadgePresentationSchema>;
export type Missingness = z.infer<typeof MissingnessSchema>;
export type RecordSection = z.infer<typeof RecordSectionSchema>;
export type ContextEntry = z.infer<typeof ContextEntrySchema>;
export type PublicRecord = z.infer<typeof PublicRecordSchema>;
export type NavigationIndex = z.infer<typeof NavigationIndexSchema>;
export type BudgetProjection = z.infer<typeof BudgetProjectionSchema>;
export type ActivityEntry = z.infer<typeof ActivityEntrySchema>;
export type IdentityFact = z.infer<typeof IdentityFactSchema>;
//# sourceMappingURL=contracts.d.ts.map