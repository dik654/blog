import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { euUkCfdData } from "./derivative-jurisdiction-data";
import LeverageCloseoutViz from "./eu-uk-cfd-appropriateness-leverage-and-negative-balance/viz/LeverageCloseoutViz";

export default function EuUkCfdProtectionArticle() {
  return <DerivativeDeepArticle data={euUkCfdData} vizBefore={{ picture: { 0: <LeverageCloseoutViz /> } }} />;
}
