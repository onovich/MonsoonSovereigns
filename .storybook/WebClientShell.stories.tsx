import { WebClientShell } from "../apps/web/src/shell/web-client-shell";

export default {
  component: WebClientShell,
  title: "Foundation/WebClientShell"
};

export const Baseline = {
  render: () => <WebClientShell />
};

export const M7GuidanceNormal = {
  render: () => <WebClientShell />
};

export const M7GuidanceEmpty = {
  render: () => <WebClientShell initialSearch="?fixture=m7-empty" />
};

export const M7GuidanceError = {
  render: () => <WebClientShell initialSearch="?fixture=m7-error" />
};

export const M7GuidanceExtreme = {
  render: () => <WebClientShell initialSearch="?fixture=m7-extreme" />
};

export const M7GuidanceNarrow = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1"
    }
  },
  render: () => <WebClientShell />
};

export const M7CoverageNormal = {
  render: () => <WebClientShell initialSearch="?surface=coverage" />
};

export const M7CoverageEmpty = {
  render: () => <WebClientShell initialSearch="?fixture=m7-empty&surface=coverage" />
};

export const M7CoverageError = {
  render: () => <WebClientShell initialSearch="?fixture=m7-error&surface=coverage" />
};

export const M7CoverageExtreme = {
  render: () => <WebClientShell initialSearch="?fixture=m7-extreme&surface=coverage" />
};

export const M7CoverageNarrow = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1"
    }
  },
  render: () => <WebClientShell initialSearch="?surface=coverage" />
};
