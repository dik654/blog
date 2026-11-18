import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { tradeLifecycleData } from "./derivative-operations-and-governance-data";
import ErrorSpreadViz from "./derivatives-trade-lifecycle-confirmation-settlement-and-reconciliation/viz/ErrorSpreadViz";
import EventLogViz from "./derivatives-trade-lifecycle-confirmation-settlement-and-reconciliation/viz/EventLogViz";
import ReconcileViz from "./derivatives-trade-lifecycle-confirmation-settlement-and-reconciliation/viz/ReconcileViz";
import StatusLanesViz from "./derivatives-trade-lifecycle-confirmation-settlement-and-reconciliation/viz/StatusLanesViz";

export default function DerivativesTradeLifecycleArticle() {
  return (
    <DerivativeDeepArticle
      data={tradeLifecycleData}
      vizBefore={{
        case: { 1: <ErrorSpreadViz /> },
        picture: { 0: <EventLogViz /> },
        need: { 1: <ReconcileViz /> },
        limits: { 0: <StatusLanesViz /> },
      }}
    />
  );
}
