import type { ClientReadModelSnapshot } from "@monsoon/client-core";
import type { ReactElement } from "react";

export interface ClientShellViewProps {
  readonly snapshot: ClientReadModelSnapshot;
  readonly mapAnchorCount: number;
}

export function ClientShellView({ snapshot, mapAnchorCount }: ClientShellViewProps): ReactElement {
  return (
    <main className="client-shell" aria-label="Monsoon Sovereigns client shell">
      <section className="client-shell__map" aria-label="Map read model projection">
        <div className="client-shell__map-surface" data-anchor-count={mapAnchorCount}>
          <span className="client-shell__map-revision">Revision {snapshot.revision}</span>
        </div>
      </section>
      <aside className="client-shell__panel" aria-label="Read model status">
        <h1>Monsoon Sovereigns</h1>
        <p>{snapshot.panels.headline}</p>
        <dl>
          {snapshot.panels.metrics.map((metric) => (
            <div className="client-shell__metric" key={metric.label}>
              <dt>{metric.label}</dt>
              <dd>{metric.value}</dd>
            </div>
          ))}
        </dl>
      </aside>
    </main>
  );
}
