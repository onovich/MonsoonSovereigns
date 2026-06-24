import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";

import {
  createInitialClientReadModelSnapshot,
  createSyntheticDistrictPressureFixture,
  withDistrictListReadModel
} from "../packages/client-core/src/index";
import { ClientShellView } from "../packages/ui/src/index";

describe("M2 district client UI", () => {
  test("renders the district panel fields from the read-model slice", () => {
    const snapshot = withDistrictListReadModel(
      createInitialClientReadModelSnapshot(),
      createSyntheticDistrictPressureFixture()
    );
    const markup = renderToStaticMarkup(<ClientShellView snapshot={snapshot} mapAnchorCount={3} />);

    expect(markup).toContain("M2 district panel");
    expect(markup).toContain("Population");
    expect(markup).toContain("Labor");
    expect(markup).toContain("Grain");
    expect(markup).toContain("Cash");
    expect(markup).toContain("Route");
    expect(markup).toContain("Synthetic UI pressure data");
  });

  test("server renders only the virtualized first window for the 4000-row fixture", () => {
    const snapshot = withDistrictListReadModel(
      createInitialClientReadModelSnapshot(),
      createSyntheticDistrictPressureFixture()
    );
    const markup = renderToStaticMarkup(<ClientShellView snapshot={snapshot} mapAnchorCount={3} />);

    expect(markup).toContain('data-row-count="4000"');
    expect(markup).toContain('data-rendered-row-count="16"');
    expect(markup).toContain("Synthetic District 0001");
    expect(markup).not.toContain("Synthetic District 4000");
  });
});
