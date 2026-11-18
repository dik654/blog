import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { japanAustraliaLeverageData } from "./derivative-jurisdiction-data";
import ExposureLossViz from "./japan-australia-retail-leverage-and-product-governance/viz/ExposureLossViz";

export default function JapanAustraliaRetailLeverageArticle() {
  return <DerivativeDeepArticle data={japanAustraliaLeverageData} vizBefore={{ case: { 0: <ExposureLossViz /> } }} />;
}
