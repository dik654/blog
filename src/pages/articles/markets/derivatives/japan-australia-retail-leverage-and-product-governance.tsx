import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { japanAustraliaLeverageData } from "./derivative-jurisdiction-data";
import JapanAustraliaLeverageGovernanceViz from "./JapanAustraliaLeverageGovernanceViz";

export default function JapanAustraliaRetailLeverageArticle() {
  return (
    <div className="space-y-16">
      <JapanAustraliaLeverageGovernanceViz />
      <DerivativeDeepArticle data={japanAustraliaLeverageData} />
    </div>
  );
}
