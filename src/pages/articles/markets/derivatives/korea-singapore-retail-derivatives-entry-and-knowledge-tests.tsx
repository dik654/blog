import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { koreaSingaporeEntryData } from "./derivative-jurisdiction-data";
import EntryGateViz from "./korea-singapore-retail-derivatives-entry-and-knowledge-tests/viz/EntryGateViz";

export default function KoreaSingaporeRetailDerivativesEntryArticle() {
  return <DerivativeDeepArticle data={koreaSingaporeEntryData} vizBefore={{ picture: { 0: <EntryGateViz /> } }} />;
}
