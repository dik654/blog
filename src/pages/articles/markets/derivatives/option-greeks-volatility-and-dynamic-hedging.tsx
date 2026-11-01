import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { greeksData } from "./derivative-data";
import OptionGreeksHedgeMapViz from "./OptionGreeksHedgeMapViz";

export default function OptionGreeksArticle() {
  return (
    <div className="space-y-16">
      <OptionGreeksHedgeMapViz />
      <DerivativeDeepArticle data={greeksData} />
    </div>
  );
}
