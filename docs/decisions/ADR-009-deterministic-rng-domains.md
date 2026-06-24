# ADR-009-deterministic-rng-domains: Deterministic RNG Domains

- Status: Accepted for SIM-004 implementation review
- Date: 2026-06-24
- Risk: R3

## Context

M1 requires authority randomness that is deterministic across Node Runner, Worker-capable builds, and future Electron Worker hosts. Existing accepted decisions require reproducible randomness but do not specify the PRNG algorithm, seed format, domain semantics, or compatibility expectations.

Authority systems must not use `Math.random`, crypto RNG, real time, host entropy, floating-point branch decisions, or external random services.

## Decision

Use `DeterministicRng` from `packages/sim-core` for authority randomness.

The algorithm is `sfc32-fnv1a32-domain-v1`:

- seed/domain expansion uses four FNV-1a 32-bit hashes over canonical length-prefixed text;
- the stream generator is SFC32 with four unsigned 32-bit state words;
- all output values are unsigned 32-bit integers;
- bounded draws use integer rejection sampling and never floating point.

Seeds are explicit non-empty ASCII strings matching `[A-Za-z0-9._:-]{1,128}`. Numeric world seeds may be adapted by callers through a documented string such as `world:1531`, but the RNG API itself stores the canonical seed string.

Every stream is created from a full domain key:

- `system`
- `day`
- `entity`
- `purpose`
- `substream`

The canonical domain text includes the schema version and every field. A caller must create a different domain key rather than sharing an ambient global RNG for unrelated purposes. Extra draws in one domain must not perturb another domain.

## DTO And Compatibility

RNG boundary data is serialized as explicit versioned DTOs in `packages/protocol`:

- `DeterministicRngDomainKeyDtoV1`
- `DeterministicRngStateDtoV1`

The DTO stores schema version, algorithm ID, seed, domain key, draw index, and four state words. SIM-005 save integration may persist these DTOs directly or regenerate streams from seed/domain when no mid-stream continuation is needed.

Golden vector tests lock documented seed/domain sequences. Any intentional change to algorithm, canonical text, seed validation, domain fields, state word order, or bounded draw behavior is a compatibility change and must update this ADR or add a successor ADR with migration expectations.

## Consequences

- Authority code has no ambient global random source.
- Domain streams are reproducible and replayable from serialized DTO state.
- Cross-environment tests can compare integer sequences without relying on float formatting.
- SFC32 is not cryptographic and must not be used for secrets, security tokens, or anti-cheat.
