import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { bankIrrbbAlmData } from "./derivative-professional-practice-data";
import BankIrrbbAlmViz from "./BankIrrbbAlmViz";

export default function BankIrrbbAlmArticle() {
  return (
    <div className="space-y-16">
      <BankIrrbbAlmViz />
      <DerivativeDeepArticle data={bankIrrbbAlmData} />
    </div>
  );
}
