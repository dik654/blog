import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { greeksData } from "./derivative-data";

export default function OptionGreeksArticle() {
  return <DerivativeDeepArticle data={greeksData} />;
}
