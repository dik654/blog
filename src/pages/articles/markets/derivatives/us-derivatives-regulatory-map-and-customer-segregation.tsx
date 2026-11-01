import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { usRegulatoryMapData } from "./derivative-jurisdiction-data";
import UsDerivativesRegulatoryMapViz from "./UsDerivativesRegulatoryMapViz";

export default function UsDerivativesRegulatoryMapArticle() {
  return (
    <div className="space-y-16">
      <UsDerivativesRegulatoryMapViz />
      <DerivativeDeepArticle data={usRegulatoryMapData} />
    </div>
  );
}
