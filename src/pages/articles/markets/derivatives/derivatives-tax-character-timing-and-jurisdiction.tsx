import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { derivativesTaxData } from "./derivative-professional-practice-data";
import DerivativesTaxLedgerViz from "./DerivativesTaxLedgerViz";

export default function DerivativesTaxArticle() {
  return (
    <div className="space-y-16">
      <DerivativesTaxLedgerViz />
      <DerivativeDeepArticle data={derivativesTaxData} />
    </div>
  );
}
