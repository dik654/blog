import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { usRegulatoryMapData } from "./derivative-jurisdiction-data";

export default function UsDerivativesRegulatoryMapArticle() {
  return <DerivativeDeepArticle data={usRegulatoryMapData} />;
}
