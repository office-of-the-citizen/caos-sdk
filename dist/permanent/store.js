/**
 * In-memory indexes over the published Permanent Snapshot distribution bundle.
 *
 * DISABLED — The permanent snapshot data file has been removed as part of the
 * constitutional separation. The snapshot was previously built by the deleted
 * Engine 10 assembler directly from repositories/spatial_objects/ledger.json
 * and relationship graphs — a violation of the layering that requires
 * projection to consume only the Knowledge Index.
 *
 * This store will be restored when the Knowledge Index emits governed spatial
 * knowledge packets that can be materialized into a permanent snapshot.
 *
 * Read-only. No network. No presentation. No compose.
 */
/**
 * The permanent snapshot is not yet available.
 * Returns null until the Knowledge Index emits governed spatial knowledge.
 */
export function getPermanentSnapshot() {
    return null;
}
/** Epoch metadata — not yet available. */
export function getPermanentSnapshotMeta() {
    return null;
}
export function getByCanonicalId(_canonicalId) {
    return null;
}
export function getBySlug(_slug) {
    return null;
}
/** Resolve by canonical id, slug, or legacy alias — not yet available. */
export function resolvePermanentObject(_idOrSlug) {
    return null;
}
export function listByClassification(_classification) {
    return [];
}
export function listChildren(_parentCanonicalId) {
    return [];
}
/** Root → … → object breadcrumb — not yet available. */
export function breadcrumb(_canonicalId) {
    return [];
}
/**
 * Navigation-shaped tree for LGA discovery: states → LGAs.
 * Not yet available — awaits Knowledge Index.
 */
export function lgaNavigationTree() {
    return [];
}
