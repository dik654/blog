import type { FlowNode } from './FlowDiagram';
import { validatorFlowData } from './archFlowDataValidator';
import { beaconFlowData } from './archFlowDataBeacon';
import { engineFlowData } from './archFlowDataEngine';
import { devp2pFlowData } from './archFlowDataDevp2p';
import { txpoolFlowData } from './archFlowDataTxpool';
import { libp2pHotcoldFlowData } from './archFlowDataLibp2p';
import { syncFlowData } from './archFlowDataSync';
import { storageFlowData } from './archFlowDataStorage';
import { rpcFlowData } from './archFlowDataRpc';

export const flowData: Record<string, FlowNode[]> = {
  ...validatorFlowData,
  ...beaconFlowData,
  ...engineFlowData,
  ...devp2pFlowData,
  ...txpoolFlowData,
  ...libp2pHotcoldFlowData,
  ...syncFlowData,
  ...storageFlowData,
  ...rpcFlowData,
};
