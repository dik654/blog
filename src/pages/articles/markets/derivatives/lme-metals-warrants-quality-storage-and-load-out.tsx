import DerivativeDeepArticle from "./DerivativeDeepArticle";
import LmeZincWarrantLoadOutViz from "./LmeZincWarrantLoadOutViz";
import { lmeMetalWarrantData } from "./derivative-applied-ledgers-data";

export default function LmeMetalWarrantArticle() {
  return <div className="space-y-16"><LmeZincWarrantLoadOutViz /><DerivativeDeepArticle data={lmeMetalWarrantData} /></div>;
}
