import type { FlowNode } from './FlowDiagram';
import { beaconGossipFlowData } from './archFlowDataBeaconGossip';
import { beaconProcessFlowData } from './archFlowDataBeaconProcess';

export const beaconFlowData: Record<string, FlowNode[]> = {
  ...beaconGossipFlowData,
  ...beaconProcessFlowData,
};
