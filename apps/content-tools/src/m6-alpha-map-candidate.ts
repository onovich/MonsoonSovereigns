import {
  parseM6AlphaMapCandidateSetSourceV0,
  validateM6AlphaMapCandidateSetSourceV0,
  type M6AlphaMapCandidateSetSourceV0,
  type M6AlphaMapCandidateSourceV0,
  type M6AlphaMapDistrictSourceV0,
  type M6AlphaMapRouteSourceV0,
  type M6AlphaMapSettlementSourceV0
} from "@monsoon/content-schema";
import {
  parseM6AlphaMapCandidateManifestHash,
  parseM6AlphaMapCandidateId,
  parseM6AlphaMapDistrictId,
  parseM6AlphaMapRouteId,
  parseM6AlphaMapSettlementId,
  parseRuntimeM6AlphaMapCandidateContentPackV0,
  type RuntimeM6AlphaMapCandidateContentPackV0,
  type RuntimeM6AlphaMapCandidateV0,
  type RuntimeM6AlphaMapDistrictV0,
  type RuntimeM6AlphaMapRouteV0,
  type RuntimeM6AlphaMapSettlementV0
} from "@monsoon/content-runtime";

import type { ContentCompileError, ContentCompileResultV0 } from "./index.ts";

interface StableCandidateAssignment {
  readonly candidate: M6AlphaMapCandidateSourceV0;
  readonly runtimeId: number;
}

interface StableDistrictAssignment {
  readonly district: M6AlphaMapDistrictSourceV0;
  readonly runtimeId: number;
}

interface StableSettlementAssignment {
  readonly settlement: M6AlphaMapSettlementSourceV0;
  readonly runtimeId: number;
}

interface StableRouteAssignment {
  readonly route: M6AlphaMapRouteSourceV0;
  readonly runtimeId: number;
}

const INITIAL_HASH_OFFSET = 2_166_136_261;
const HASH_PRIME = 16_777_619;

export function compileM6AlphaMapCandidateContentPackV0(input: unknown): ContentCompileResultV0 {
  const schemaErrors = validateM6AlphaMapCandidateSetSourceV0(input);
  if (schemaErrors.length > 0) {
    return {
      status: "error",
      errors: schemaErrors.map((error) => ({
        code: error.code,
        path: error.path,
        message: error.message
      }))
    };
  }

  const source = parseM6AlphaMapCandidateSetSourceV0(input);
  const semanticErrors = validateM6AlphaMapCandidateSemantics(source);
  if (semanticErrors.length > 0) {
    return {
      status: "error",
      errors: semanticErrors
    };
  }

  const pack = buildRuntimeM6AlphaMapCandidatePack(source);
  return {
    status: "ok",
    pack: parseRuntimeM6AlphaMapCandidateContentPackV0(pack),
    errors: []
  };
}

function validateM6AlphaMapCandidateSemantics(
  source: M6AlphaMapCandidateSetSourceV0
): readonly ContentCompileError[] {
  const errors: ContentCompileError[] = [];

  if (source.candidates.length === 0) {
    errors.push({
      code: "invalid-count",
      path: "candidates",
      message: "M6 alpha map candidate set must contain at least one candidate."
    });
  }

  validateStableOrderAndUniqueIds(source.candidates, "candidates", errors);
  source.candidates.forEach((candidate, candidateIndex) =>
    validateCandidate(candidate, `candidates[${candidateIndex}]`, errors)
  );

  return errors;
}

function validateCandidate(
  candidate: M6AlphaMapCandidateSourceV0,
  path: string,
  errors: ContentCompileError[]
): void {
  if (candidate.reviewNotes.length === 0) {
    errors.push({
      code: "missing-label",
      path: `${path}.reviewNotes`,
      message: `Map candidate ${candidate.sourceId} must keep review notes visible.`
    });
  }

  validateStableOrderAndUniqueIds(candidate.districts, `${path}.districts`, errors);
  validateStableOrderAndUniqueIds(candidate.settlements, `${path}.settlements`, errors);
  validateStableOrderAndUniqueIds(candidate.routes, `${path}.routes`, errors);
  validateRenderOrder(candidate.districts, `${path}.districts`, errors);
  validateRenderOrder(candidate.settlements, `${path}.settlements`, errors);
  validateRenderOrder(candidate.routes, `${path}.routes`, errors);
  validateDistricts(candidate, path, errors);
  validateSettlements(candidate, path, errors);
  validateRoutes(candidate, path, errors);
}

function validateDistricts(
  candidate: M6AlphaMapCandidateSourceV0,
  path: string,
  errors: ContentCompileError[]
): void {
  const districtReferences = new Set<string>();
  const landWaterClasses = new Set<string>();
  candidate.districts.forEach((district, index) => {
    if (district.sourceId !== district.districtReferenceId) {
      errors.push({
        code: "bad-reference",
        path: `${path}.districts[${index}].districtReferenceId`,
        message: `District ${district.sourceId} must use its sourceId as the stable districtReferenceId.`
      });
    }
    if (districtReferences.has(district.districtReferenceId)) {
      errors.push({
        code: "duplicate-id",
        path: `${path}.districts[${index}].districtReferenceId`,
        message: `Duplicate districtReferenceId ${district.districtReferenceId}.`
      });
    }
    if (district.polygon.length < 3) {
      errors.push({
        code: "invalid-geometry",
        path: `${path}.districts[${index}].polygon`,
        message: `District ${district.sourceId} must provide at least three polygon points.`
      });
    }
    if (!pointInsideBounds(district.anchor, candidate)) {
      errors.push({
        code: "invalid-geometry",
        path: `${path}.districts[${index}].anchor`,
        message: `District ${district.sourceId} anchor must fit candidate bounds.`
      });
    }
    district.polygon.forEach((point, pointIndex) => {
      if (!pointInsideBounds(point, candidate)) {
        errors.push({
          code: "invalid-geometry",
          path: `${path}.districts[${index}].polygon[${pointIndex}]`,
          message: `District ${district.sourceId} polygon point must fit candidate bounds.`
        });
      }
    });
    districtReferences.add(district.districtReferenceId);
    landWaterClasses.add(district.landWaterClass);
  });

  if (!landWaterClasses.has("land") || !landWaterClasses.has("water")) {
    errors.push({
      code: "invalid-classification",
      path: `${path}.districts`,
      message: "M6 alpha map candidate must explicitly include both land and water districts."
    });
  }
}

function validateSettlements(
  candidate: M6AlphaMapCandidateSourceV0,
  path: string,
  errors: ContentCompileError[]
): void {
  const districtReferences = new Set(
    candidate.districts.map((district) => district.districtReferenceId)
  );
  const settlementReferences = new Set<string>();
  candidate.settlements.forEach((settlement, index) => {
    if (settlement.sourceId !== settlement.settlementReferenceId) {
      errors.push({
        code: "bad-reference",
        path: `${path}.settlements[${index}].settlementReferenceId`,
        message: `Settlement ${settlement.sourceId} must use its sourceId as stable reference.`
      });
    }
    if (settlementReferences.has(settlement.settlementReferenceId)) {
      errors.push({
        code: "duplicate-id",
        path: `${path}.settlements[${index}].settlementReferenceId`,
        message: `Duplicate settlementReferenceId ${settlement.settlementReferenceId}.`
      });
    }
    if (!districtReferences.has(settlement.districtReferenceId)) {
      errors.push({
        code: "bad-reference",
        path: `${path}.settlements[${index}].districtReferenceId`,
        message: `Settlement ${settlement.sourceId} references missing district ${settlement.districtReferenceId}.`
      });
    }
    if (!pointInsideBounds(settlement.anchor, candidate)) {
      errors.push({
        code: "invalid-geometry",
        path: `${path}.settlements[${index}].anchor`,
        message: `Settlement ${settlement.sourceId} anchor must fit candidate bounds.`
      });
    }
    settlementReferences.add(settlement.settlementReferenceId);
  });
}

function validateRoutes(
  candidate: M6AlphaMapCandidateSourceV0,
  path: string,
  errors: ContentCompileError[]
): void {
  const districtReferences = new Set(
    candidate.districts.map((district) => district.districtReferenceId)
  );
  const routeReferences = new Set<string>();
  candidate.routes.forEach((route, index) => {
    if (route.sourceId !== route.routeReferenceId) {
      errors.push({
        code: "bad-reference",
        path: `${path}.routes[${index}].routeReferenceId`,
        message: `Route ${route.sourceId} must use its sourceId as stable routeReferenceId.`
      });
    }
    if (routeReferences.has(route.routeReferenceId)) {
      errors.push({
        code: "duplicate-id",
        path: `${path}.routes[${index}].routeReferenceId`,
        message: `Duplicate routeReferenceId ${route.routeReferenceId}.`
      });
    }
    if (!districtReferences.has(route.fromDistrictReferenceId)) {
      errors.push({
        code: "bad-reference",
        path: `${path}.routes[${index}].fromDistrictReferenceId`,
        message: `Route ${route.sourceId} references missing origin district ${route.fromDistrictReferenceId}.`
      });
    }
    if (!districtReferences.has(route.toDistrictReferenceId)) {
      errors.push({
        code: "bad-reference",
        path: `${path}.routes[${index}].toDistrictReferenceId`,
        message: `Route ${route.sourceId} references missing destination district ${route.toDistrictReferenceId}.`
      });
    }
    if (!routeClassificationMatches(route)) {
      errors.push({
        code: "invalid-classification",
        path: `${path}.routes[${index}].waterClass`,
        message: `Route ${route.sourceId} waterClass is incompatible with routeKind ${route.routeKind}.`
      });
    }
    if (route.points.length < 2) {
      errors.push({
        code: "invalid-route",
        path: `${path}.routes[${index}].points`,
        message: `Route ${route.sourceId} must provide at least two render points.`
      });
    }
    route.points.forEach((point, pointIndex) => {
      if (!pointInsideBounds(point, candidate)) {
        errors.push({
          code: "invalid-route",
          path: `${path}.routes[${index}].points[${pointIndex}]`,
          message: `Route ${route.sourceId} render point must fit candidate bounds.`
        });
      }
    });
    routeReferences.add(route.routeReferenceId);
  });
}

function routeClassificationMatches(route: M6AlphaMapRouteSourceV0): boolean {
  switch (route.routeKind) {
    case "road":
      return route.waterClass === "land";
    case "river":
      return route.waterClass === "water" || route.waterClass === "mixed";
    case "coast":
      return route.waterClass === "water" || route.waterClass === "mixed";
  }
}

function buildRuntimeM6AlphaMapCandidatePack(
  source: M6AlphaMapCandidateSetSourceV0
): RuntimeM6AlphaMapCandidateContentPackV0 {
  const candidates = assignCandidates(source.candidates).map((assignment) =>
    buildRuntimeCandidate(assignment)
  );
  const manifestHash = hashM6AlphaMapCandidateManifest(source.fixtureId, candidates);

  return {
    schemaVersion: 1,
    kind: "runtime-m6-alpha-map-candidate-content-pack-v0",
    fixtureId: source.fixtureId,
    manifest: {
      schemaVersion: 1,
      fixtureId: source.fixtureId,
      fixtureKind: source.fixtureKind,
      syntheticScope: source.syntheticScope,
      manifestHash: parseM6AlphaMapCandidateManifestHash(manifestHash),
      candidateCount: candidates.length,
      districtCount: candidates.reduce((count, candidate) => count + candidate.districts.length, 0),
      settlementCount: candidates.reduce(
        (count, candidate) => count + candidate.settlements.length,
        0
      ),
      routeCount: candidates.reduce((count, candidate) => count + candidate.routes.length, 0)
    },
    candidates
  };
}

function buildRuntimeCandidate(
  assignment: StableCandidateAssignment
): RuntimeM6AlphaMapCandidateV0 {
  const districtAssignments = assignDistricts(assignment.candidate.districts);
  const settlementAssignments = assignSettlements(assignment.candidate.settlements);
  const routeAssignments = assignRoutes(assignment.candidate.routes);
  const districtIdByReference = new Map(
    districtAssignments.map((entry) => [entry.district.districtReferenceId, entry.runtimeId])
  );
  const districts = districtAssignments.map((entry) => ({
    id: parseM6AlphaMapDistrictId(entry.runtimeId),
    sourceId: entry.district.sourceId,
    districtReferenceId: entry.district.districtReferenceId,
    displayNameKey: entry.district.displayNameKey,
    landWaterClass: entry.district.landWaterClass,
    renderOrder: entry.district.renderOrder,
    anchor: { ...entry.district.anchor },
    polygon: entry.district.polygon.map((point) => ({ ...point }))
  }));
  const settlements = settlementAssignments.map((entry) => {
    const districtId = districtIdByReference.get(entry.settlement.districtReferenceId);
    if (districtId === undefined) {
      throw new Error(`Compiler invariant failed for settlement ${entry.settlement.sourceId}.`);
    }
    return {
      id: parseM6AlphaMapSettlementId(entry.runtimeId),
      sourceId: entry.settlement.sourceId,
      settlementReferenceId: entry.settlement.settlementReferenceId,
      districtReferenceId: entry.settlement.districtReferenceId,
      districtId: parseM6AlphaMapDistrictId(districtId),
      displayNameKey: entry.settlement.displayNameKey,
      renderOrder: entry.settlement.renderOrder,
      anchor: { ...entry.settlement.anchor }
    };
  });
  const routes = routeAssignments.map((entry) => {
    const fromDistrictId = districtIdByReference.get(entry.route.fromDistrictReferenceId);
    const toDistrictId = districtIdByReference.get(entry.route.toDistrictReferenceId);
    if (fromDistrictId === undefined || toDistrictId === undefined) {
      throw new Error(`Compiler invariant failed for route ${entry.route.sourceId}.`);
    }
    return {
      id: parseM6AlphaMapRouteId(entry.runtimeId),
      sourceId: entry.route.sourceId,
      routeReferenceId: entry.route.routeReferenceId,
      fromDistrictReferenceId: entry.route.fromDistrictReferenceId,
      toDistrictReferenceId: entry.route.toDistrictReferenceId,
      fromDistrictId: parseM6AlphaMapDistrictId(fromDistrictId),
      toDistrictId: parseM6AlphaMapDistrictId(toDistrictId),
      routeKind: entry.route.routeKind,
      waterClass: entry.route.waterClass,
      renderOrder: entry.route.renderOrder,
      points: entry.route.points.map((point) => ({ ...point }))
    };
  });

  return {
    id: parseM6AlphaMapCandidateId(assignment.runtimeId),
    sourceId: assignment.candidate.sourceId,
    displayNameKey: assignment.candidate.displayNameKey,
    historicity: assignment.candidate.historicity,
    confidence: assignment.candidate.confidence,
    sourceLabel: assignment.candidate.sourceLabel,
    reviewNotes: [...assignment.candidate.reviewNotes],
    bounds: { ...assignment.candidate.bounds },
    districts,
    settlements,
    routes
  };
}

function validateStableOrderAndUniqueIds(
  entries: readonly { readonly sourceId: string }[],
  path: string,
  errors: ContentCompileError[]
): void {
  const seen = new Set<string>();
  let previousSourceId = "";
  entries.forEach((entry, index) => {
    if (seen.has(entry.sourceId)) {
      errors.push({
        code: "duplicate-id",
        path: `${path}[${index}].sourceId`,
        message: `Duplicate ${path} sourceId ${entry.sourceId}.`
      });
    }
    if (index > 0 && compareText(entry.sourceId, previousSourceId) <= 0) {
      errors.push({
        code: "unstable-order",
        path: `${path}[${index}].sourceId`,
        message: `${path} must be sorted by sourceId for deterministic stable ID assignment.`
      });
    }
    seen.add(entry.sourceId);
    previousSourceId = entry.sourceId;
  });
}

function validateRenderOrder(
  entries: readonly { readonly renderOrder: number; readonly sourceId: string }[],
  path: string,
  errors: ContentCompileError[]
): void {
  const seen = new Set<number>();
  let previousOrder = 0;
  entries.forEach((entry, index) => {
    if (seen.has(entry.renderOrder)) {
      errors.push({
        code: "duplicate-id",
        path: `${path}[${index}].renderOrder`,
        message: `Duplicate renderOrder ${entry.renderOrder}.`
      });
    }
    if (entry.renderOrder <= previousOrder) {
      errors.push({
        code: "unstable-order",
        path: `${path}[${index}].renderOrder`,
        message: `${path} must be sorted by renderOrder for deterministic rendering.`
      });
    }
    seen.add(entry.renderOrder);
    previousOrder = entry.renderOrder;
  });
}

function assignCandidates(
  candidates: readonly M6AlphaMapCandidateSourceV0[]
): readonly StableCandidateAssignment[] {
  return sortBySourceId(candidates).map((candidate, index) => ({
    candidate,
    runtimeId: index + 1
  }));
}

function assignDistricts(
  districts: readonly M6AlphaMapDistrictSourceV0[]
): readonly StableDistrictAssignment[] {
  return sortBySourceId(districts).map((district, index) => ({
    district,
    runtimeId: index + 1
  }));
}

function assignSettlements(
  settlements: readonly M6AlphaMapSettlementSourceV0[]
): readonly StableSettlementAssignment[] {
  return sortBySourceId(settlements).map((settlement, index) => ({
    settlement,
    runtimeId: index + 1
  }));
}

function assignRoutes(
  routes: readonly M6AlphaMapRouteSourceV0[]
): readonly StableRouteAssignment[] {
  return sortBySourceId(routes).map((route, index) => ({
    route,
    runtimeId: index + 1
  }));
}

function sortBySourceId<TValue extends { readonly sourceId: string }>(
  values: readonly TValue[]
): readonly TValue[] {
  return [...values].sort((left, right) => compareText(left.sourceId, right.sourceId));
}

function pointInsideBounds(
  point: { readonly x: number; readonly y: number },
  candidate: M6AlphaMapCandidateSourceV0
): boolean {
  return (
    point.x >= 0 &&
    point.y >= 0 &&
    point.x <= candidate.bounds.widthInMapUnits &&
    point.y <= candidate.bounds.heightInMapUnits
  );
}

function hashM6AlphaMapCandidateManifest(
  fixtureId: string,
  candidates: readonly RuntimeM6AlphaMapCandidateV0[]
): string {
  return toFixedHexHash(
    hashText(
      [
        "runtime-m6-alpha-map-candidate-content-pack-v0",
        `fixtureId=${fixtureId}`,
        `candidates=${candidates.map(formatCandidateForHash).join(",")}`
      ].join("\n")
    )
  );
}

function formatCandidateForHash(candidate: RuntimeM6AlphaMapCandidateV0): string {
  return [
    `${candidate.id}:${candidate.sourceId}:${candidate.displayNameKey}:${candidate.historicity}:${candidate.confidence}:${candidate.sourceLabel}`,
    `notes=${candidate.reviewNotes.join("|")}`,
    `bounds=${candidate.bounds.widthInMapUnits}:${candidate.bounds.heightInMapUnits}`,
    `districts=${candidate.districts.map(formatDistrictForHash).join("|")}`,
    `settlements=${candidate.settlements.map(formatSettlementForHash).join("|")}`,
    `routes=${candidate.routes.map(formatRouteForHash).join("|")}`
  ].join(";");
}

function formatDistrictForHash(district: RuntimeM6AlphaMapDistrictV0): string {
  return `${district.id}:${district.sourceId}:${district.districtReferenceId}:${district.displayNameKey}:${district.landWaterClass}:${district.renderOrder}:${formatPointForHash(district.anchor)}:${district.polygon.map(formatPointForHash).join("/")}`;
}

function formatSettlementForHash(settlement: RuntimeM6AlphaMapSettlementV0): string {
  return `${settlement.id}:${settlement.sourceId}:${settlement.settlementReferenceId}:${settlement.districtReferenceId}:${settlement.districtId}:${settlement.displayNameKey}:${settlement.renderOrder}:${formatPointForHash(settlement.anchor)}`;
}

function formatRouteForHash(route: RuntimeM6AlphaMapRouteV0): string {
  return `${route.id}:${route.sourceId}:${route.routeReferenceId}:${route.fromDistrictReferenceId}:${route.toDistrictReferenceId}:${route.fromDistrictId}:${route.toDistrictId}:${route.routeKind}:${route.waterClass}:${route.renderOrder}:${route.points.map(formatPointForHash).join("/")}`;
}

function formatPointForHash(point: { readonly x: number; readonly y: number }): string {
  return `${point.x}:${point.y}`;
}

function hashText(text: string): number {
  let hash = INITIAL_HASH_OFFSET;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, HASH_PRIME) >>> 0;
  }
  return hash;
}

function toFixedHexHash(hash: number): string {
  return hash.toString(16).padStart(8, "0");
}

function compareText(left: string, right: string): number {
  if (left < right) {
    return -1;
  }
  if (left > right) {
    return 1;
  }
  return 0;
}
