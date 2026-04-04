import type { FlowNode } from './FlowDiagram';
import { rpcBuilderFlowData } from './archFlowDataRpcBuilder';
import { rpcCallFlowData } from './archFlowDataRpcCall';

export const rpcFlowData: Record<string, FlowNode[]> = {
  ...rpcBuilderFlowData,
  ...rpcCallFlowData,
};
