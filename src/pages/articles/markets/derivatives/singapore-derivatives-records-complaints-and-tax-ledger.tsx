import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { singaporeDerivativesAftercareData } from "./derivative-applied-ledgers-data";
import IdLinkMapViz from "./singapore-derivatives-records-complaints-and-tax-ledger/viz/IdLinkMapViz";
import TwoClocksViz from "./singapore-derivatives-records-complaints-and-tax-ledger/viz/TwoClocksViz";

export default function SingaporeDerivativesAftercareArticle() {
  return (
    <DerivativeDeepArticle
      data={singaporeDerivativesAftercareData}
      vizBefore={{ case: { 0: <TwoClocksViz /> }, picture: { 0: <IdLinkMapViz /> } }}
    />
  );
}
