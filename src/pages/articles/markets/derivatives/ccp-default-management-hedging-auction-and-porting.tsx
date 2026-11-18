import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { ccpDefaultManagementData } from "./derivative-curriculum-gaps-data";
import DefaultTracksViz from "./ccp-default-management-hedging-auction-and-porting/viz/DefaultTracksViz";
import ResidualSensitivityViz from "./ccp-default-management-hedging-auction-and-porting/viz/ResidualSensitivityViz";

export default function CcpDefaultManagementArticle() {
  return (
    <DerivativeDeepArticle
      data={ccpDefaultManagementData}
      vizBefore={{
        case: { 0: <ResidualSensitivityViz /> },
        picture: { 0: <DefaultTracksViz /> },
      }}
    />
  );
}
