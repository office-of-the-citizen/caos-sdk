/**
 * In-memory indexes over the published Permanent Snapshot distribution bundle.
 * Read-only. No network. No presentation. No compose.
 */

import type {
  PermanentSnapshot,
  PermanentSnapshotClassification,
  PermanentSnapshotMeta,
  PermanentSpatialObject,
} from "./types.js";
import snapshotData from "./data/permanent-snapshot.json" with { type: "json" };

function loadSnapshot(): PermanentSnapshot {
  const snap = snapshotData as PermanentSnapshot;
  if (snap.projection_type !== "prj_permanent_snapshot") {
    throw new Error("invalid permanent snapshot projection_type");
  }
  if (!snap.snapshot_epoch || !snap.content_hash || !snap.generated_at) {
    throw new Error("permanent snapshot missing epoch metadata");
  }
  // Constitutional invariant: population never in distribution bundle
  const raw = JSON.stringify(snap);
  if (/"population"/i.test(raw)) {
    throw new Error("CONSTITUTIONAL_VIOLATION: population in permanent snapshot bundle");
  }
  return snap;
}

const SNAPSHOT: PermanentSnapshot = loadSnapshot();

const byId = new Map<string, PermanentSpatialObject>();
const bySlug = new Map<string, PermanentSpatialObject>();
const byAlias = new Map<string, PermanentSpatialObject>();
const byClassification = new Map<PermanentSnapshotClassification, PermanentSpatialObject[]>();
const childrenByParent = new Map<string, PermanentSpatialObject[]>();

for (const obj of SNAPSHOT.objects) {
  byId.set(obj.canonical_id, obj);
  if (obj.slug) bySlug.set(obj.slug, obj);
  for (const alias of obj.legacy_aliases) {
    byAlias.set(alias, obj);
    if (alias.startsWith("caos:obj:")) {
      bySlug.set(alias.replace(/^caos:obj:/, ""), obj);
    }
  }
  const list = byClassification.get(obj.classification) ?? [];
  list.push(obj);
  byClassification.set(obj.classification, list);
  if (obj.parent_id) {
    const kids = childrenByParent.get(obj.parent_id) ?? [];
    kids.push(obj);
    childrenByParent.set(obj.parent_id, kids);
  }
}

for (const list of byClassification.values()) {
  list.sort((a, b) => a.primary_name.localeCompare(b.primary_name));
}
for (const list of childrenByParent.values()) {
  list.sort((a, b) => a.primary_name.localeCompare(b.primary_name));
}

/** Full published snapshot (read-only reference). */
export function getPermanentSnapshot(): PermanentSnapshot {
  return SNAPSHOT;
}

/** Epoch metadata for the distributed snapshot. */
export function getPermanentSnapshotMeta(): PermanentSnapshotMeta {
  return {
    snapshot_epoch: SNAPSHOT.snapshot_epoch,
    generated_at: SNAPSHOT.generated_at,
    generated_from_commit: SNAPSHOT.generated_from_commit,
    content_hash: SNAPSHOT.content_hash,
    counts: SNAPSHOT.counts,
  };
}

export function getByCanonicalId(canonicalId: string): PermanentSpatialObject | null {
  return byId.get(canonicalId) ?? null;
}

export function getBySlug(slug: string): PermanentSpatialObject | null {
  return bySlug.get(slug) ?? null;
}

/** Resolve by canonical id, slug, or legacy alias (e.g. caos:obj:lg-…). */
export function resolvePermanentObject(idOrSlug: string): PermanentSpatialObject | null {
  return byId.get(idOrSlug) ?? bySlug.get(idOrSlug) ?? byAlias.get(idOrSlug) ?? null;
}

export function listByClassification(
  classification: PermanentSnapshotClassification,
): PermanentSpatialObject[] {
  return byClassification.get(classification) ?? [];
}

export function listChildren(parentCanonicalId: string): PermanentSpatialObject[] {
  return childrenByParent.get(parentCanonicalId) ?? [];
}

/** Root → … → object breadcrumb (inclusive of object). */
export function breadcrumb(canonicalId: string): PermanentSpatialObject[] {
  const chain: PermanentSpatialObject[] = [];
  let current: PermanentSpatialObject | null | undefined = byId.get(canonicalId);
  const guard = new Set<string>();
  while (current && !guard.has(current.canonical_id)) {
    guard.add(current.canonical_id);
    chain.push(current);
    current = current.parent_id ? byId.get(current.parent_id) : null;
  }
  return chain.reverse();
}

/**
 * Navigation-shaped tree for LGA discovery: states → LGAs.
 * Semantic structure only — applications render as they choose.
 */
export function lgaNavigationTree(): Array<{
  state: PermanentSpatialObject;
  lgas: PermanentSpatialObject[];
}> {
  const states = listByClassification("STATE");
  return states.map((state) => ({
    state,
    lgas: listChildren(state.canonical_id).filter(
      (c) => c.classification === "LOCAL_GOVERNMENT_AREA",
    ),
  }));
}
