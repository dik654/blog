import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { otcLifecycleData } from "./derivative-risk-data";
import MarginTimeViz from "./otc-master-agreement-collateral-netting-and-cva/viz/MarginTimeViz";
import NettingCollateralViz from "./otc-master-agreement-collateral-netting-and-cva/viz/NettingCollateralViz";

export default function OtcLifecycleArticle() {
  return (
    <DerivativeDeepArticle
      data={otcLifecycleData}
      vizBefore={{
        case: { 0: <NettingCollateralViz /> },
        need: { 0: <MarginTimeViz /> },
      }}
    />
  );
}
