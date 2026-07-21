/**
 * Permanent Snapshot distribution surface.
 *
 * The SDK distributes the published Engine 10 permanent snapshot.
 * It does not own permanent spatial objects. CAOS remains the constitutional owner.
 */

export type {
  PermanentSnapshot,
  PermanentSpatialObject,
  PermanentSnapshotClassification,
  PermanentSnapshotMeta,
} from "./types.js";

export {
  getPermanentSnapshot,
  getPermanentSnapshotMeta,
  getByCanonicalId,
  getBySlug,
  resolvePermanentObject,
  listByClassification,
  listChildren,
  breadcrumb,
  lgaNavigationTree,
} from "./store.js";
