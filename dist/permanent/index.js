/**
 * Permanent Snapshot distribution surface.
 *
 * The SDK distributes the published Engine 10 permanent snapshot.
 * It does not own permanent spatial objects. CAOS remains the constitutional owner.
 */
export { getPermanentSnapshot, getPermanentSnapshotMeta, getByCanonicalId, getBySlug, resolvePermanentObject, listByClassification, listChildren, breadcrumb, lgaNavigationTree, } from "./store.js";
