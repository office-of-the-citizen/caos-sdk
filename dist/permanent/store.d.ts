/**
 * In-memory indexes over the published Permanent Snapshot distribution bundle.
 * Read-only. No network. No presentation. No compose.
 */
import type { PermanentSnapshot, PermanentSnapshotClassification, PermanentSnapshotMeta, PermanentSpatialObject } from "./types.js";
/** Full published snapshot (read-only reference). */
export declare function getPermanentSnapshot(): PermanentSnapshot;
/** Epoch metadata for the distributed snapshot. */
export declare function getPermanentSnapshotMeta(): PermanentSnapshotMeta;
export declare function getByCanonicalId(canonicalId: string): PermanentSpatialObject | null;
export declare function getBySlug(slug: string): PermanentSpatialObject | null;
/** Resolve by canonical id, slug, or legacy alias (e.g. caos:obj:lg-…). */
export declare function resolvePermanentObject(idOrSlug: string): PermanentSpatialObject | null;
export declare function listByClassification(classification: PermanentSnapshotClassification): PermanentSpatialObject[];
export declare function listChildren(parentCanonicalId: string): PermanentSpatialObject[];
/** Root → … → object breadcrumb (inclusive of object). */
export declare function breadcrumb(canonicalId: string): PermanentSpatialObject[];
/**
 * Navigation-shaped tree for LGA discovery: states → LGAs.
 * Semantic structure only — applications render as they choose.
 */
export declare function lgaNavigationTree(): Array<{
    state: PermanentSpatialObject;
    lgas: PermanentSpatialObject[];
}>;
//# sourceMappingURL=store.d.ts.map