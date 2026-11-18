import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { lmeMetalWarrantData } from "./derivative-applied-ledgers-data";
import MetalAndRightTrackViz from "./lme-metals-warrants-quality-storage-and-load-out/viz/MetalAndRightTrackViz";
import StorageLoadOutLedgerViz from "./lme-metals-warrants-quality-storage-and-load-out/viz/StorageLoadOutLedgerViz";

export default function LmeMetalWarrantArticle() {
  return (
    <DerivativeDeepArticle
      data={lmeMetalWarrantData}
      vizBefore={{
        case: { 1: <StorageLoadOutLedgerViz /> },
        picture: { 0: <MetalAndRightTrackViz /> },
      }}
    />
  );
}
