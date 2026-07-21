/**
 * Types for the Permanent Snapshot distribution bundle.
 *
 * Constitutional ownership chain (Founder Amendment 2026-07-21):
 *   CAOS Spatial Repository
 *   → Engine 10 Permanent Snapshot Projection
 *   → Snapshot Publisher
 *   → SDK distribution bundle (this package)
 *   → Citizen
 *
 * The SDK distributes an immutable published snapshot. It does NOT own
 * permanent spatial objects. CAOS remains the sole constitutional owner
 * and admission authority.
 *
 * Semantic data only — no presentation labels, icons, colours, or compose
 * helpers. Applications compose their own view models.
 *
 * Population MUST NEVER appear here (constitutional truth via CAOS claims).
 * Area is permanent metadata when admitted on the spatial object.
 */
export type PermanentSnapshotClassification = "FEDERATION" | "STATE" | "LOCAL_GOVERNMENT_AREA" | "GEOPOLITICAL_ZONE";
export interface PermanentSpatialObject {
    canonical_id: string;
    classification: PermanentSnapshotClassification;
    primary_name: string;
    slug: string;
    parent_id: string | null;
    identifiers: Array<{
        authority: string;
        value: string;
    }>;
    legacy_aliases: string[];
    group_code: string | null;
    /** Land area km² when admitted; null if unknown. Permanent metadata, not a claim. */
    area_km2: number | null;
    ward_count: number | null;
    polling_unit_count: number | null;
}
export interface PermanentSnapshot {
    projection_type: "prj_permanent_snapshot";
    snapshot_epoch: string;
    generated_at: string;
    generated_from_commit: string | null;
    content_hash: string;
    counts: {
        FEDERATION: number;
        STATE: number;
        LOCAL_GOVERNMENT_AREA: number;
        GEOPOLITICAL_ZONE: number;
    };
    objects: PermanentSpatialObject[];
}
export interface PermanentSnapshotMeta {
    snapshot_epoch: string;
    generated_at: string;
    generated_from_commit: string | null;
    content_hash: string;
    counts: PermanentSnapshot["counts"];
}
//# sourceMappingURL=types.d.ts.map