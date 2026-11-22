import { describe, it, expect } from "vitest";
import { getPermanentSnapshot, getBySlug, getPermanentSnapshotMeta } from "./store.js";
describe("published snapshot immutability", () => {
 it("rejects consumer edits to objects and collections", () => {
  const snapshot = getPermanentSnapshot()!;
  const object = snapshot.objects[0];
  const name = object.primary_name;
  expect(() => { object.primary_name = "invented"; }).toThrow();
  expect(() => { snapshot.objects.pop(); }).toThrow();
  expect(getBySlug(object.slug)?.primary_name).toBe(name);
 });
 it("protects nested metadata shared by every consumer", () => {
  const meta = getPermanentSnapshotMeta()!;
  expect(() => { meta.counts.LOCAL_GOVERNMENT_AREA = 0; }).toThrow();
  expect(getPermanentSnapshotMeta()!.counts.LOCAL_GOVERNMENT_AREA).toBe(774);
 });
});
