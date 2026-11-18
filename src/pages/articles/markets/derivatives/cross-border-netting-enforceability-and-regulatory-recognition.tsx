import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { crossBorderNettingData } from "./derivative-jurisdiction-data";
import NetGrossExposureViz from "./cross-border-netting-enforceability-and-regulatory-recognition/viz/NetGrossExposureViz";
import TwoLayerRecognitionViz from "./cross-border-netting-enforceability-and-regulatory-recognition/viz/TwoLayerRecognitionViz";

export default function CrossBorderNettingArticle() {
  return (
    <DerivativeDeepArticle
      data={crossBorderNettingData}
      vizBefore={{
        case: { 0: <NetGrossExposureViz /> },
        need: { 0: <TwoLayerRecognitionViz /> },
      }}
    />
  );
}
