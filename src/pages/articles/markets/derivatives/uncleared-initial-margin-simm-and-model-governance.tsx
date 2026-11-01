import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { unclearedInitialMarginData } from "./derivative-operations-and-governance-data";
import UnclearedInitialMarginViz from "./UnclearedInitialMarginViz";

export default function UnclearedInitialMarginArticle() {
  return (
    <div className="space-y-16">
      <UnclearedInitialMarginViz />
      <DerivativeDeepArticle data={unclearedInitialMarginData} />
    </div>
  );
}
