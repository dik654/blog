import Opening from "./pcie-blackwell-moe-node-build/Opening";
import Topology from "./pcie-blackwell-moe-node-build/Topology";
import NodeTrace from "./pcie-blackwell-moe-node-build/NodeTrace";
import NetworkScale from "./pcie-blackwell-moe-node-build/NetworkScale";
import SourcesLimits from "./pcie-blackwell-moe-node-build/SourcesLimits";

/**
 * NVLink 없는 Blackwell 8장으로 1T MoE 노드 짜기
 *
 * 같은 사례(Kimi K2.5 INT4 595.2GB, RTX PRO 6000 Server Edition 8장, 사용률 0.92)를
 * S → B → 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 복습 순서로 끝까지 쓴다.
 * 근거 원장: docs/moe-serving-research-2026-11-03/ (00, 01, 03, 04, k8s-drafts).
 */
export default function PcieBlackwellMoeNodeBuildArticle() {
  return (
    <div className="space-y-16">
      <Opening />
      <Topology />
      <NodeTrace />
      <NetworkScale />
      <SourcesLimits />
    </div>
  );
}
