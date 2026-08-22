/**
 * In-memory indexes over the published Permanent Snapshot distribution bundle.
 *
 * Loads the permanent snapshot from the distribution JSON file at startup
 * and provides read-only access to spatial objects by slug, canonical id,
 * and classification.
 *
 * Read-only. No network. No presentation. No compose.
 */

import type {
  PermanentSnapshot,
  PermanentSnapshotClassification,
  PermanentSnapshotMeta,
  PermanentSpatialObject,
} from "./types.js";

// Direct JSON import — bundled by webpack/Next.js, no fs path resolution needed.
import snapshotData from "./data/permanent-snapshot.json" with { type: "json" };

// ── Eager singleton loader ────────────────────────────────────────────────────
const _snapshot: PermanentSnapshot | null = (snapshotData as PermanentSnapshot) ?? null;
const _slugIndex: Map<string, PermanentSpatialObject> = new Map();
const _canonicalIndex: Map<string, PermanentSpatialObject> = new Map();

if (_snapshot?.objects) {
  for (const obj of _snapshot.objects) {
    if (obj.slug) _slugIndex.set(obj.slug, obj);
    if (obj.canonical_id) _canonicalIndex.set(obj.canonical_id, obj);
  }
}

/**
 * Return the loaded permanent snapshot, or null if unavailable.
 */
export function getPermanentSnapshot(): PermanentSnapshot | null {
  return _snapshot;
}

/** Epoch metadata — returns snapshot-level meta fields. */
export function getPermanentSnapshotMeta(): PermanentSnapshotMeta | null {
  if (!_snapshot) return null;
  return {
    epoch_id: (_snapshot as any).epoch_id ?? "unknown",
    snapshot_epoch: (_snapshot as any).epoch_id ?? "unknown",
    generated_at: (_snapshot as any).built_at ?? new Date().toISOString(),
    generated_from_commit: null,
    content_hash: (_snapshot as any).content_hash ?? null,
    counts: { total_objects: _snapshot.objects?.length ?? 0 },
    built_at: (_snapshot as any).built_at ?? null,
    object_count: _snapshot.objects?.length ?? 0,
  } as unknown as PermanentSnapshotMeta;
}

export function getByCanonicalId(canonicalId: string): PermanentSpatialObject | null {
  return _canonicalIndex?.get(canonicalId) ?? null;
}

export function getBySlug(slug: string): PermanentSpatialObject | null {
  return _slugIndex?.get(slug) ?? null;
}

/** Resolve by canonical id, slug, or legacy alias. */
export function resolvePermanentObject(idOrSlug: string): PermanentSpatialObject | null {
  return _canonicalIndex?.get(idOrSlug) ?? _slugIndex?.get(idOrSlug) ?? null;
}

export function listByClassification(
  classification: PermanentSnapshotClassification,
): PermanentSpatialObject[] {
  return (_snapshot?.objects ?? []).filter((o) => o.classification === classification);
}

export function listChildren(parentCanonicalId: string): PermanentSpatialObject[] {
  return (_snapshot?.objects ?? []).filter((o) => o.parent_id === parentCanonicalId);
}

/** Root → … → object breadcrumb built by walking parent_id chain. */
export function breadcrumb(canonicalId: string): PermanentSpatialObject[] {
  const chain: PermanentSpatialObject[] = [];
  let current = _canonicalIndex?.get(canonicalId) ?? null;
  while (current) {
    chain.unshift(current);
    current = current.parent_id ? (_canonicalIndex?.get(current.parent_id) ?? null) : null;
  }
  return chain;
}

/**
 * Navigation-shaped tree for LGA discovery: states → LGAs.
 */
export function lgaNavigationTree(): Array<{
  state: PermanentSpatialObject;
  lgas: PermanentSpatialObject[];
}> {
  if (!_snapshot) return [];
  const states = (_snapshot.objects ?? []).filter((o) => o.classification === "STATE");
  return states.map((state) => ({
    state,
    lgas: (_snapshot?.objects ?? []).filter(
      (o) => o.classification === "LOCAL_GOVERNMENT_AREA" && o.parent_id === state.canonical_id,
    ),
  }));
}
