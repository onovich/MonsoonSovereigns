# Save Format Golden Fixtures

## Intentional Golden Update Workflow

Golden save files are compatibility evidence, not snapshots to refresh casually. A schema, checksum, or state hash change must include a recorded reason in the task handoff and in this file, then regenerate the fixture from the shared save codec and run:

- `pnpm --filter @monsoon/save-format test`
- `pnpm --filter @monsoon/sim-core test`
- `pnpm sim:determinism`

Current recorded reason: `SIM-005 initial Save Envelope v1 golden for m1.abstract-graph-30`.
