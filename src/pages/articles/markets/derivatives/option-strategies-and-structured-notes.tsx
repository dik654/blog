import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { structuredProductData } from "./derivative-risk-data";
import BarrierPathViz from "./option-strategies-and-structured-notes/viz/BarrierPathViz";
import CallSpreadLegsViz from "./option-strategies-and-structured-notes/viz/CallSpreadLegsViz";
import NoteMaturityViz from "./option-strategies-and-structured-notes/viz/NoteMaturityViz";

export default function StructuredProductArticle() {
  return (
    <DerivativeDeepArticle
      data={structuredProductData}
      vizBefore={{
        case: { 0: <NoteMaturityViz />, 1: <BarrierPathViz /> },
        mechanism: { 0: <CallSpreadLegsViz /> },
      }}
    />
  );
}
