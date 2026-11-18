import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { currencyHedgeData } from "./derivative-risk-data";
import ForwardReplicationViz from "./currency-hedging-forward-points-and-cross-currency-basis/viz/ForwardReplicationViz";
import ForwardShortfallViz from "./currency-hedging-forward-points-and-cross-currency-basis/viz/ForwardShortfallViz";
import HedgeChoicePayoffViz from "./currency-hedging-forward-points-and-cross-currency-basis/viz/HedgeChoicePayoffViz";
import SwapImpliedRateViz from "./currency-hedging-forward-points-and-cross-currency-basis/viz/SwapImpliedRateViz";

export default function CurrencyHedgeArticle() {
  return (
    <DerivativeDeepArticle
      data={currencyHedgeData}
      vizBefore={{
        case: { 0: <ForwardReplicationViz /> },
        picture: { 0: <ForwardShortfallViz /> },
        names: { 1: <SwapImpliedRateViz /> },
        limits: { 0: <HedgeChoicePayoffViz /> },
      }}
    />
  );
}
