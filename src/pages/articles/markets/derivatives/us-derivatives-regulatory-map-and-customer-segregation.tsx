import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { usRegulatoryMapData } from "./derivative-jurisdiction-data";
import LegalEntityViz from "./us-derivatives-regulatory-map-and-customer-segregation/viz/LegalEntityViz";
import RegulatorRouteViz from "./us-derivatives-regulatory-map-and-customer-segregation/viz/RegulatorRouteViz";
import SegregatedHundredViz from "./us-derivatives-regulatory-map-and-customer-segregation/viz/SegregatedHundredViz";

export default function UsDerivativesRegulatoryMapArticle() {
  return (
    <DerivativeDeepArticle
      data={usRegulatoryMapData}
      vizBefore={{
        case: { 0: <SegregatedHundredViz /> },
        picture: { 0: <RegulatorRouteViz /> },
        need: { 0: <LegalEntityViz /> },
      }}
    />
  );
}
