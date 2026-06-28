import {
  CLIENT_ASSET_REPLACEMENT_SLOTS,
  DesignTokenAssetSlotsView,
  createAssetSlotStressFixture
} from "../packages/ui/src/index";

export default {
  component: DesignTokenAssetSlotsView,
  title: "Foundation/M7DesignTokensAssetSlots"
};

export const Normal = {
  render: () => <DesignTokenAssetSlotsView locale="en-US" />
};

export const Empty = {
  render: () => <DesignTokenAssetSlotsView evidenceState="empty" locale="en-US" />
};

export const Error = {
  render: () => <DesignTokenAssetSlotsView evidenceState="error" locale="en-US" />
};

export const Extreme = {
  render: () => (
    <DesignTokenAssetSlotsView
      assetSlots={createAssetSlotStressFixture()}
      evidenceState="extreme"
      locale="en-US"
    />
  )
};

export const Narrow = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1"
    }
  },
  render: () => <DesignTokenAssetSlotsView locale="en-US" />
};

export const SimplifiedChineseLayoutStress = {
  render: () => <DesignTokenAssetSlotsView locale="zh-CN" />
};

export const DebugOn = {
  render: () => <DesignTokenAssetSlotsView debugMode={true} locale="en-US" />
};

export const DebugOff = {
  render: () => <DesignTokenAssetSlotsView debugMode={false} locale="en-US" />
};

export const PlaceholderRegistryOnly = {
  render: () => (
    <DesignTokenAssetSlotsView assetSlots={CLIENT_ASSET_REPLACEMENT_SLOTS} locale="en-US" />
  )
};
