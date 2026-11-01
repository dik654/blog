import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { koreaSingaporeEntryData } from "./derivative-jurisdiction-data";
import RetailDerivativesEntryMapViz from "./RetailDerivativesEntryMapViz";

export default function KoreaSingaporeRetailDerivativesEntryArticle() {
  return (
    <div className="space-y-16">
      <RetailDerivativesEntryMapViz />
      <DerivativeDeepArticle data={koreaSingaporeEntryData} />
    </div>
  );
}
