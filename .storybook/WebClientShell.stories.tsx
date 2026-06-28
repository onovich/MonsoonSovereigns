import { WebClientShell } from "../apps/web/src/shell/web-client-shell";

export default {
  component: WebClientShell,
  title: "Foundation/WebClientShell"
};

export const Baseline = {
  render: () => <WebClientShell />
};

export const AppShellNormal = {
  render: () => <WebClientShell />
};

export const AppShellEmpty = {
  render: () => <WebClientShell initialSearch="?fixture=m7-empty" />
};

export const AppShellError = {
  render: () => <WebClientShell initialSearch="?fixture=m7-error" />
};

export const AppShellExtreme = {
  render: () => <WebClientShell initialSearch="?fixture=m7-extreme" />
};

export const AppShellNarrow = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1"
    }
  },
  render: () => <WebClientShell />
};

export const AppShellEnglish = {
  render: () => <WebClientShell initialLocalePreference="en-US" />
};

export const AppShellSimplifiedChinese = {
  render: () => (
    <WebClientShell initialLocalePreference="zh-CN" initialSystemLocales={["zh-Hans"]} />
  )
};

export const AppShellSystemFallbackChinese = {
  render: () => (
    <WebClientShell initialLocalePreference="system" initialSystemLocales={["zh-Hans"]} />
  )
};

export const AppShellSystemFallbackEnglish = {
  render: () => <WebClientShell initialLocalePreference="system" initialSystemLocales={["fr-FR"]} />
};

export const AppShellDebugOff = {
  render: () => <WebClientShell initialSearch="?debug=0" />
};

export const AppShellDebugOn = {
  render: () => <WebClientShell initialSearch="?debug=1" />
};

export const M7CoverageDebug = {
  render: () => <WebClientShell initialSearch="?surface=coverage&debug=1" />
};

export const M7CoverageEmptyDebug = {
  render: () => <WebClientShell initialSearch="?fixture=m7-empty&surface=coverage&debug=1" />
};

export const M7CoverageErrorDebug = {
  render: () => <WebClientShell initialSearch="?fixture=m7-error&surface=coverage&debug=1" />
};

export const AppointmentFlowNormal = {
  render: () => <WebClientShell initialLocalePreference="en-US" />
};

export const AppointmentFlowEmpty = {
  render: () => <WebClientShell initialSearch="?fixture=appointment-empty" />
};

export const AppointmentFlowRejected = {
  render: () => <WebClientShell initialSearch="?fixture=appointment-error" />
};

export const AppointmentFlowExtreme = {
  render: () => <WebClientShell initialSearch="?fixture=appointment-extreme" />
};

export const AppointmentFlowNarrow = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1"
    }
  },
  render: () => <WebClientShell initialSearch="?fixture=appointment-extreme" />
};

export const DistrictInspectorNormal = {
  render: () => <WebClientShell initialLocalePreference="en-US" />
};

export const DistrictInspectorEmpty = {
  render: () => <WebClientShell initialSearch="?fixture=district-empty" />
};

export const DistrictInspectorError = {
  render: () => <WebClientShell initialSearch="?fixture=district-error" />
};

export const DistrictInspectorExtreme = {
  render: () => <WebClientShell initialSearch="?fixture=stress" />
};

export const DistrictInspectorNarrow = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1"
    }
  },
  render: () => <WebClientShell initialSearch="?fixture=stress" />
};

export const DistrictInspectorEnglish = {
  render: () => <WebClientShell initialLocalePreference="en-US" />
};

export const DistrictInspectorSimplifiedChinese = {
  render: () => <WebClientShell initialLocalePreference="zh-CN" />
};

export const MapPresentationNormal = {
  render: () => <WebClientShell initialLocalePreference="en-US" />
};

export const MapPresentationEmpty = {
  render: () => <WebClientShell initialSearch="?fixture=district-empty" />
};

export const MapPresentationError = {
  render: () => <WebClientShell initialSearch="?fixture=district-error" />
};

export const MapPresentationExtreme = {
  render: () => <WebClientShell initialSearch="?fixture=stress" />
};

export const MapPresentationNarrow = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1"
    }
  },
  render: () => <WebClientShell initialSearch="?fixture=stress" />
};

export const MapPresentationEnglish = {
  render: () => <WebClientShell initialLocalePreference="en-US" />
};

export const MapPresentationSimplifiedChinese = {
  render: () => (
    <WebClientShell initialLocalePreference="zh-CN" initialSystemLocales={["zh-Hans"]} />
  )
};
